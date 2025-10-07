using Microsoft.AspNetCore.Mvc;
using APP.Data;

namespace APP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly ConexionMySql _db;

        public UsuarioController(ConexionMySql db)
        {
            _db = db;
        }

        // --- REGISTRAR USUARIO ---
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (request.Password != request.ConfirmarPassword)
                return BadRequest(new { error = "Las contraseñas no coinciden" });

            string rolPorDefecto = "EMPLEADO";

            string mensajeError;
            bool exito = _db.RegistrarUsuario(
                request.Usuario,
                request.Password,
                request.Nombre,
                request.Apellido,
                request.Sexo,
                request.NivelAcademico,
                request.Institucion,
                rolPorDefecto,
                out mensajeError
            );

            if (!exito)
                return BadRequest(new { error = mensajeError });

            return Ok(new { message = "Usuario registrado correctamente" });
        }
    }

    // DTO para registro
    public class RegisterRequest
    {
        public string Usuario { get; set; }
        public string Password { get; set; }
        public string ConfirmarPassword { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Sexo { get; set; }
        public string NivelAcademico { get; set; }
        public string Institucion { get; set; }
    }
}