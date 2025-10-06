using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using APP.Filters;
using APP.Services;
using System.Collections.Generic;
using System.Linq;
using System;

namespace APP.Controllers
{
    [ApiController]
    [Route("api/export")]
    [AuthorizeSession("ADMIN", "ENCARGADO")] // Solo roles con permiso
    public class GPUExportController : ControllerBase
    {
        private readonly ConexionMySql _db;
        private readonly IExcelExportService _excelExportService;

        public GPUExportController(ConexionMySql db, IExcelExportService excelExportService)
        {
            _db = db;
            _excelExportService = excelExportService;
        }

        // --- Exportar todas las GPUs a Excel
        [HttpGet("gpus/excel")]
        public IActionResult ExportGPUsToExcel()
        {
            var gpus = _db.ObtenerGPUs();

            if (gpus == null || !gpus.Any())
                return NotFound(new { error = "No se encontraron GPUs para exportar." });

            var excelData = _excelExportService.ExportGPUsToExcel(gpus);

            return File(excelData,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"GPUs_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }

        // --- Exportar GPU individual a Excel
        [HttpGet("gpu/{id}/excel")]
        public IActionResult ExportSingleGpuToExcel(int id)
        {
            var gpu = _db.ObtenerGPUs().FirstOrDefault(g => g.IdGPU == id);

            if (gpu == null)
                return NotFound(new { error = "GPU no encontrada." });

            var excelData = _excelExportService.ExportGPUsToExcel(new List<Gpu> { gpu });

            return File(excelData,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"GPU_{gpu.Modelo}_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }
    }
}
