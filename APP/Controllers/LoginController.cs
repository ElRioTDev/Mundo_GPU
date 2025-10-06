using Microsoft.AspNetCore.Mvc;
using APP.Data;
using Microsoft.AspNetCore.Http;

namespace APP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginApiController : ControllerBase
    {
        private readonly ConexionMySql _db;

        public LoginApiController(ConexionMySql db)
        {
            _db = db;
        }

        // --- LOGIN
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { error = "Username y password son requeridos" });

            var usuario = _db.ObtenerUsuario(request.Username, request.Password);

            if (usuario == null)
                return Unauthorized(new { error = "Usuario o contraseña incorrectos" });

            // Guardar datos en sesión (opcional, puedes usar JWT más adelante)
            HttpContext.Session.SetString("Username", usuario.Username);
            HttpContext.Session.SetString("Rol", usuario.Rol);

            return Ok(new
            {
                message = "Login exitoso",
                username = usuario.Username,
                rol = usuario.Rol
            });
        }

        // --- LOGOUT
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok(new { message = "Logout exitoso" });
        }
    }

    // DTO para login
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
