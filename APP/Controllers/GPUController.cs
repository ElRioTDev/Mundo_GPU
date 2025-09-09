using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using APP.Filters;
using System.Collections.Generic;
using System.Linq;

namespace APP.Controllers
{
    [SessionRoleAuthorize] // Solo verifica que haya sesión activa
    public class GpuController : Controller
    {
        private readonly ConexionMySql _db;

        public GpuController(ConexionMySql db)
        {
            _db = db;
        }

        // GET: /Gpu
        public IActionResult Index()
        {
            var lista = _db.ObtenerGPUs() ?? new List<Gpu>();
            if (lista.Count == 0)
                ViewBag.Error = "No se encontraron GPUs.";

            return View(lista);
        }

        // POST: /Gpu/Find
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

        // GET: /Gpu/Details/5
        public IActionResult Details(int id)
        {
            var gpu = _db.ObtenerGPUs().FirstOrDefault(g => g.IdGPU == id);
            if (gpu == null) return NotFound();
            return View(gpu);
        }

        // GET: /Gpu/Create
        public IActionResult Create()
        {
            var rolUsuario = HttpContext.Session.GetString("Rol");
            if (rolUsuario != "ADMIN")
                return RedirectToAction("Index");

            // Proveedores existentes para el dropdown
            var proveedores = _db.ObtenerGPUs()
                                 .Select(g => g.Proveedor)
                                 .Where(p => p != null)
                                 .GroupBy(p => p.IdProveedor)
                                 .Select(g => g.First())
                                 .ToList();

            ViewBag.Proveedores = proveedores;
            return View();
        }

        // POST: /Gpu/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Gpu gpu, Proveedor NuevoProveedor)
        {
            var rolUsuario = HttpContext.Session.GetString("Rol");
            if (rolUsuario != "ADMIN")
                return RedirectToAction("Index");

            if (!ModelState.IsValid)
            {
                ViewBag.Proveedores = _db.ObtenerGPUs()
                                         .Select(g => g.Proveedor)
                                         .Where(p => p != null)
                                         .GroupBy(p => p.IdProveedor)
                                         .Select(g => g.First())
                                         .ToList();
                return View(gpu);
            }

            bool resultado = _db.InsertarGPU(gpu, NuevoProveedor);

            if (resultado)
                return RedirectToAction("Index");

            ViewBag.Error = "No se pudo insertar la GPU.";
            ViewBag.Proveedores = _db.ObtenerGPUs()
                                     .Select(g => g.Proveedor)
                                     .Where(p => p != null)
                                     .GroupBy(p => p.IdProveedor)
                                     .Select(g => g.First())
                                     .ToList();
            return View(gpu);
        }



        // GET: /Gpu/Edit/5
        public IActionResult Edit(int id)
        {
            var rolUsuario = HttpContext.Session.GetString("Rol");
            if (rolUsuario != "ADMIN" && rolUsuario != "ENCARGADO")
                return RedirectToAction("Details", new { id });

            var gpu = _db.ObtenerGPUs().FirstOrDefault(g => g.IdGPU == id);
            if (gpu == null) return NotFound();

            var proveedores = _db.ObtenerGPUs()
                                 .Select(g => g.Proveedor)
                                 .Where(p => p != null)
                                 .GroupBy(p => p.IdProveedor)
                                 .Select(g => g.First())
                                 .ToList();
            ViewBag.Proveedores = proveedores;

            return View(gpu);
        }

        // POST: /Gpu/Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Gpu gpu)
        {
            var rolUsuario = HttpContext.Session.GetString("Rol");
            if (rolUsuario != "ADMIN" && rolUsuario != "ENCARGADO")
                return RedirectToAction("Details", new { id = gpu.IdGPU });

            if (!ModelState.IsValid)
            {
                var proveedoresFallback = _db.ObtenerGPUs()
                                             .Select(g => g.Proveedor)
                                             .Where(p => p != null)
                                             .GroupBy(p => p.IdProveedor)
                                             .Select(g => g.First())
                                             .ToList();
                ViewBag.Proveedores = proveedoresFallback;
                return View(gpu);
            }

            bool resultado = _db.EditarGPU(gpu);
            if (resultado)
                return RedirectToAction("Details", new { id = gpu.IdGPU });

            ViewBag.Error = "No se pudo actualizar la GPU.";
            var proveedoresFallback2 = _db.ObtenerGPUs()
                                         .Select(g => g.Proveedor)
                                         .Where(p => p != null)
                                         .GroupBy(p => p.IdProveedor)
                                         .Select(g => g.First())
                                         .ToList();
            ViewBag.Proveedores = proveedoresFallback2;
            return View(gpu);
        }

        // GET: /Gpu/Delete/5
        public IActionResult Delete(int id)
        {
            var rolUsuario = HttpContext.Session.GetString("Rol");
            if (rolUsuario != "ADMIN")
                return RedirectToAction("Details", new { id });

            _db.EliminarGPU(id);
            return RedirectToAction("Index");
        }
    }
}
