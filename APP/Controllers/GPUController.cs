using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System;

namespace APP.Controllers
{
    [Route("api/gpu")]
    [ApiController]
    [Authorize] // Requiere JWT para todos los endpoints
    public class GpuApiController : ControllerBase
    {
        private readonly ConexionMySql _db;

        public GpuApiController(ConexionMySql db)
        {
            _db = db;
        }

        // DTO para recibir GPU + proveedor opcional
        public class GpuCreateEditDTO
        {
            public Gpu Gpu { get; set; }
            public Proveedor Proveedor { get; set; } // Opcional
        }

        // --- LISTAR TODAS LAS GPUs
        [HttpGet]
        public IActionResult GetGPUs()
        {
            var lista = _db.ObtenerGPUs() ?? new List<Gpu>();

            // Mapeo explícito para asegurar que todos los campos estén presentes
            var result = lista.Select(g => new
            {
                g.IdGPU,
                g.Marca,
                g.Modelo,
                g.VRAM,
                g.NucleosCuda,
                g.Precio,
                g.Imagen,
                g.RayTracing
            }).ToList();

            // Log de depuración
            Console.WriteLine("[GpuApiController] GetGPUs:");
            foreach (var gpu in result)
            {
                Console.WriteLine($"IdGPU={gpu.IdGPU}, Marca={gpu.Marca}, Modelo={gpu.Modelo}, VRAM={gpu.VRAM}, NucleosCUDA={gpu.NucleosCuda}, Precio={gpu.Precio}");
            }

            return Ok(result);
        }

        // --- BUSCAR POR TÉRMINO
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return BadRequest(new { error = "Debe enviar searchTerm" });

            var lista = _db.ObtenerGPUs() ?? new List<Gpu>();
            var resultados = lista
                .Where(gpu => !string.IsNullOrEmpty(gpu.Modelo) &&
                              gpu.Modelo.ToLower().Contains(searchTerm.ToLower()))
                .Select(g => new
                {
                    g.IdGPU,
                    g.Marca,
                    g.Modelo,
                    g.VRAM,
                    g.NucleosCuda,
                    g.Precio,
                    g.Imagen,
                    g.RayTracing
                })
                .ToList();

            if (!resultados.Any())
                return NotFound(new { error = $"No se encontraron GPUs con '{searchTerm}'." });

            return Ok(resultados);
        }

        // --- OBTENER GPU POR ID
        [HttpGet("{id}")]
public IActionResult GetGPU(int id)
{
    try
    {
        var gpu = _db.ObtenerGPUs()?.FirstOrDefault(g => g.IdGPU == id);

        if (gpu == null) return NotFound(new { error = "GPU no encontrada" });

        var result = new
        {
            gpu.IdGPU,
            gpu.Marca,
            gpu.Modelo,
            gpu.VRAM,
            gpu.NucleosCuda,
            gpu.Precio,
            gpu.Imagen,
            gpu.RayTracing,
            Proveedor = gpu.Proveedor == null ? null : new
            {
                IdProveedor = gpu.Proveedor.IdProveedor,
                Nombre = gpu.Proveedor.Nombre,
                Direccion = gpu.Proveedor.Direccion,
                Telefono = gpu.Proveedor.Telefono,
                Email = gpu.Proveedor.Email
            }
        };

        return Ok(result);
    }
    catch (Exception ex)
    {
        // loguear el detalle del error en la consola/servidor
        Console.WriteLine($"[GpuApiController] Error en GetGPU id={id}: {ex}");
        // devolver JSON con mensaje (no poner stacktrace en producción)
        return StatusCode(500, new { error = "Error interno al obtener GPU", detail = ex.Message });
    }
}

        // --- CREAR GPU (solo ADMIN y ENCARGADO)
        [HttpPost]
        [Authorize(Roles = "ADMIN,ENCARGADO")]
        public IActionResult Create([FromBody] GpuCreateEditDTO dto)
        {
            if (dto.Gpu == null)
                return BadRequest(new { error = "Datos de GPU requeridos" });

            var gpu = dto.Gpu;
            var proveedor = dto.Proveedor;

            if (string.IsNullOrEmpty(gpu.Marca) || string.IsNullOrEmpty(gpu.Modelo) ||
                string.IsNullOrEmpty(gpu.VRAM) || gpu.NucleosCuda <= 0 || gpu.Precio <= 0)
            {
                return BadRequest(new { error = "Campos obligatorios incompletos" });
            }

            bool resultado = _db.InsertarGPU(gpu, proveedor);

            if (!resultado)
                return StatusCode(500, new { error = "No se pudo insertar la GPU" });

            return Ok(new
            {
                gpu.IdGPU,
                gpu.Marca,
                gpu.Modelo,
                gpu.VRAM,
                gpu.NucleosCuda,
                gpu.Precio,
                gpu.Imagen,
                gpu.RayTracing
            });
        }

        // --- EDITAR GPU (solo ADMIN y ENCARGADO)
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN,ENCARGADO")]
        public IActionResult Edit(int id, [FromBody] GpuCreateEditDTO dto)
        {
            if (dto.Gpu == null)
                return BadRequest(new { error = "Datos de GPU requeridos" });

            var gpu = dto.Gpu;
            gpu.IdGPU = id;
            var proveedor = dto.Proveedor;

            if (string.IsNullOrEmpty(gpu.Marca) || string.IsNullOrEmpty(gpu.Modelo) ||
                string.IsNullOrEmpty(gpu.VRAM) || gpu.NucleosCuda <= 0 || gpu.Precio <= 0)
            {
                return BadRequest(new { error = "Campos obligatorios incompletos" });
            }

            bool actualizado = _db.EditarGPU(gpu, proveedor);

            if (!actualizado)
                return StatusCode(500, new { error = "No se pudo actualizar la GPU" });

            return Ok(new
            {
                gpu.IdGPU,
                gpu.Marca,
                gpu.Modelo,
                gpu.VRAM,
                gpu.NucleosCuda,
                gpu.Precio,
                gpu.Imagen,
                gpu.RayTracing
            });
        }

        // --- ELIMINAR GPU (solo ADMIN)
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult Delete(int id)
        {
            bool eliminado = _db.EliminarGPU(id);
            if (!eliminado)
                return StatusCode(500, new { error = "No se pudo eliminar la GPU" });

            return Ok(new { message = "GPU eliminada" });
        }
    }
}
