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
            {
                ViewBag.Error = "No se encontraron GPUs.";
            }

            return View(lista);
        }

        // POST: /Gpu/Find
        [HttpPost]
        public IActionResult Find(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return RedirectToAction("Index");
            }

            var lista = _db.ObtenerGPUs();
            var resultados = lista
                .Where(gpu => !string.IsNullOrEmpty(gpu.Modelo) &&
                              gpu.Modelo.ToLower().Contains(searchTerm.ToLower()))
                .ToList();

            if (resultados.Count == 0)
            {
                ViewBag.Error = $"No se encontraron GPUs con '{searchTerm}'.";
            }

            return View("Index", resultados);
        }

        // GET: /Gpu/Details/5
        public IActionResult Details(int id)
        {
            var gpu = _db.ObtenerGPUs().FirstOrDefault(x => x.IdGPU == id);
            if (gpu == null)
            {
                return NotFound();
            }
            return View(gpu);
        }
    }
}
