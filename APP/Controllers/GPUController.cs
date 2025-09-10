using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using APP.Filters;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace APP.Controllers
{
    [AuthorizeSession("ADMIN", "ENCARGADO", "EMPLEADO")] // Todos deben tener sesión
    public class GpuController : Controller
    {
        private readonly ConexionMySql _db;

        public GpuController(ConexionMySql db)
        {
            _db = db;
        }

        private List<Proveedor> ObtenerProveedores()
        {
            return _db.ObtenerGPUs()
                      .Select(g => g.Proveedor)
                      .Where(p => p != null)
                      .GroupBy(p => p.IdProveedor)
                      .Select(g => g.First())
                      .ToList();
        }

        // --- LECTURA (todos los roles pueden)
        public IActionResult Index()
        {
            var lista = _db.ObtenerGPUs() ?? new List<Gpu>();
            if (lista.Count == 0)
                ViewBag.Error = "No se encontraron GPUs.";

            return View(lista);
        }

        [HttpPost]
        public IActionResult Find(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return RedirectToAction("Index");

            var lista = _db.ObtenerGPUs();
            var resultados = lista
                .Where(gpu => !string.IsNullOrEmpty(gpu.Modelo) &&
                              gpu.Modelo.ToLower().Contains(searchTerm.ToLower()))
                .ToList();

            if (resultados.Count == 0)
                ViewBag.Error = $"No se encontraron GPUs con '{searchTerm}'.";

            return View("Index", resultados);
        }

        public IActionResult Details(int id)
        {
            var gpu = _db.ObtenerGPUs().FirstOrDefault(g => g.IdGPU == id);
            if (gpu == null) return NotFound();
            return View(gpu);
        }

        // --- CREAR (solo ADMIN y ENCARGADO)
        [AuthorizeSession("ADMIN", "ENCARGADO")]
        public IActionResult Create()
        {
            ViewBag.Proveedores = ObtenerProveedores();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AuthorizeSession("ADMIN", "ENCARGADO")]
        public IActionResult Create(
    Gpu gpu,
    string nuevoProveedorNombre,
    string nuevoProveedorDireccion,
    string nuevoProveedorTelefono,
    string nuevoProveedorEmail)
        {
            // DEBUG: Ver datos que llegan
            Console.WriteLine("=== DATOS RECIBIDOS EN CREATE ===");
            Console.WriteLine($"GPU: {gpu.Marca} {gpu.Modelo}");
            Console.WriteLine($"VRAM: {gpu.VRAM}");
            Console.WriteLine($"NucleosCuda: {gpu.NucleosCuda}");
            Console.WriteLine($"Precio: {gpu.Precio}");
            Console.WriteLine($"ProveedorId: {gpu.ProveedoresIdProveedor}");
            Console.WriteLine($"Nuevo Proveedor Nombre: {nuevoProveedorNombre}");

            // Detectar si estamos creando un proveedor nuevo
            bool creandoNuevoProveedor = !string.IsNullOrEmpty(nuevoProveedorNombre);

            // VALIDACIÓN MANUAL - Ignorar ModelState
            if (string.IsNullOrEmpty(gpu.Marca)
                || string.IsNullOrEmpty(gpu.Modelo)
                || string.IsNullOrEmpty(gpu.VRAM)
                || gpu.NucleosCuda <= 0
                || gpu.Precio <= 0
                || (!creandoNuevoProveedor && gpu.ProveedoresIdProveedor <= 0))
            {
                Console.WriteLine("❌ Validación manual falló");
                ViewBag.Proveedores = ObtenerProveedores();
                ViewBag.Error = "Por favor complete todos los campos requeridos";
                return View(gpu);
            }

            // Crear objeto Proveedor solo si se enviaron datos
            Proveedor nuevoProveedor = null;
            if (creandoNuevoProveedor)
            {
                nuevoProveedor = new Proveedor
                {
                    Nombre = nuevoProveedorNombre,
                    Direccion = nuevoProveedorDireccion,
                    Telefono = nuevoProveedorTelefono,
                    Email = nuevoProveedorEmail
                };
                Console.WriteLine($"✅ Nuevo proveedor creado: {nuevoProveedor.Nombre}");
            }

            // Intentar insertar GPU (y proveedor si aplica)
            bool resultado = _db.InsertarGPU(gpu, nuevoProveedor);
            Console.WriteLine($"Resultado inserción: {resultado}");

            if (resultado)
            {
                return RedirectToAction("Index");
            }

            ViewBag.Error = "No se pudo insertar la GPU.";
            ViewBag.Proveedores = ObtenerProveedores();
            return View(gpu);
        }








        // --- EDITAR (solo ADMIN y ENCARGADO)
[AuthorizeSession("ADMIN", "ENCARGADO")]
public IActionResult Edit(int id)
{
    var gpu = _db.ObtenerGPUs().FirstOrDefault(g => g.IdGPU == id);
    if (gpu == null) 
        return NotFound();

    ViewBag.Proveedores = ObtenerProveedores();
    return View(gpu);
}

        // --- EDIT (POST) (solo ADMIN y ENCARGADO)
        [HttpPost]
        [ValidateAntiForgeryToken]
        [AuthorizeSession("ADMIN", "ENCARGADO")]
        public IActionResult Edit(
            Gpu gpu,
            string nuevoProveedorNombre,
            string nuevoProveedorDireccion,
            string nuevoProveedorTelefono,
            string nuevoProveedorEmail)
        {
            // DEBUG: datos entrantes
            Console.WriteLine("=== DATOS RECIBIDOS EN EDIT ===");
            Console.WriteLine($"IdGPU: {gpu.IdGPU}");
            Console.WriteLine($"Marca/Modelo: {gpu.Marca} {gpu.Modelo}");
            Console.WriteLine($"VRAM: {gpu.VRAM}");
            Console.WriteLine($"Núcleos CUDA: {gpu.NucleosCuda}");
            Console.WriteLine($"Precio: {gpu.Precio}");
            Console.WriteLine($"ProveedorId: {gpu.ProveedoresIdProveedor}");
            Console.WriteLine($"Nuevo Proveedor Nombre: {nuevoProveedorNombre}");

            // Detectar si estamos creando proveedor nuevo
            bool creandoNuevoProveedor = !string.IsNullOrEmpty(nuevoProveedorNombre);

            // VALIDACIÓN MANUAL
            if (string.IsNullOrEmpty(gpu.Marca)
                || string.IsNullOrEmpty(gpu.Modelo)
                || string.IsNullOrEmpty(gpu.VRAM)
                || gpu.NucleosCuda <= 0
                || gpu.Precio <= 0
                || (!creandoNuevoProveedor && gpu.ProveedoresIdProveedor <= 0))
            {
                Console.WriteLine("❌ Validación manual falló en Edit");
                ViewBag.Proveedores = ObtenerProveedores();
                ViewBag.Error = "Por favor complete todos los campos requeridos";
                return View(gpu);
            }

            // Construir objeto Proveedor nuevo si corresponde
            Proveedor nuevoProveedor = null;
            if (creandoNuevoProveedor)
            {
                nuevoProveedor = new Proveedor
                {
                    Nombre = nuevoProveedorNombre,
                    Direccion = nuevoProveedorDireccion,
                    Telefono = nuevoProveedorTelefono,
                    Email = nuevoProveedorEmail
                };
                Console.WriteLine($"✅ Proveedor a insertar: {nuevoProveedor.Nombre}");
            }

            // Llamada al método mejorado que maneja transacción
            bool actualizado = _db.EditarGPU(gpu, nuevoProveedor);
            Console.WriteLine($"Resultado actualización: {actualizado}");

            if (actualizado)
            {
                return RedirectToAction("Details", new { id = gpu.IdGPU });
            }

            // En caso de error, recargar lista y mostrar mensaje
            ViewBag.Proveedores = ObtenerProveedores();
            ViewBag.Error = "No se pudo actualizar la GPU.";
            return View(gpu);
        }







        // --- ELIMINAR (solo ADMIN)
        [AuthorizeSession("ADMIN")]
        public IActionResult Delete(int id)
        {
            _db.EliminarGPU(id);
            return RedirectToAction("Index");
        }


    }
}