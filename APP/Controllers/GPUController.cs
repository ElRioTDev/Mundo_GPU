using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using APP.Filters;
using System.Collections.Generic;
using System.Linq;

namespace APP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AuthorizeSession("ADMIN", "ENCARGADO", "EMPLEADO")]
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
            return Ok(lista);
        }

        // --- BUSCAR POR TÉRMINO
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return BadRequest(new { error = "Debe enviar searchTerm" });

            var lista = _db.ObtenerGPUs();
            var resultados = lista
                .Where(gpu => !string.IsNullOrEmpty(gpu.Modelo) &&
                              gpu.Modelo.ToLower().Contains(searchTerm.ToLower()))
                .ToList();

            if (resultados.Count == 0)
                return NotFound(new { error = $"No se encontraron GPUs con '{searchTerm}'." });

            return Ok(resultados);
        }

        // --- OBTENER GPU POR ID
        [HttpGet("{id}")]
        public IActionResult GetGPU(int id)
        {
            var gpu = _db.ObtenerGPUs().FirstOrDefault(g => g.IdGPU == id);
            if (gpu == null) return NotFound(new { error = "GPU no encontrada" });
            return Ok(gpu);
        }

        // --- CREAR GPU
        [HttpPost]
        [AuthorizeSession("ADMIN", "ENCARGADO")]
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

            return Ok(gpu);
        }

        // --- EDITAR GPU
        [HttpPut("{id}")]
        [AuthorizeSession("ADMIN", "ENCARGADO")]
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

            return Ok(gpu);
        }

        // --- ELIMINAR GPU
        [HttpDelete("{id}")]
        [AuthorizeSession("ADMIN")]
        public IActionResult Delete(int id)
        {
            bool eliminado = _db.EliminarGPU(id);
            if (!eliminado)
                return StatusCode(500, new { error = "No se pudo eliminar la GPU" });

            return Ok(new { message = "GPU eliminada" });
        }
    }
}
