using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using APP.Models;
using System.Diagnostics;

namespace APP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeApiController : ControllerBase
    {
        private readonly ILogger<HomeApiController> _logger;

        public HomeApiController(ILogger<HomeApiController> logger)
        {
            _logger = logger;
        }

        // --- Obtener rol actual del usuario desde sesión
        [HttpGet("rol")]
        public IActionResult GetRol()
        {
            var rol = HttpContext.Session.GetString("Rol");
            if (string.IsNullOrEmpty(rol))
                return Ok(new { rol = "Invitado" });

            return Ok(new { rol });
        }

        // --- Endpoint de prueba de error (opcional)
        [HttpGet("error")]
        public IActionResult GetError()
        {
            var error = new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            };
            return Ok(error);
        }
    }
}
