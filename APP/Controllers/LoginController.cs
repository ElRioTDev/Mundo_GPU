using Microsoft.AspNetCore.Mvc;
using APP.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;

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

        // --- LOGIN ---
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { error = "Username y password son requeridos" });

            var usuario = _db.ObtenerUsuario(request.Username, request.Password);

            if (usuario == null)
                return Unauthorized(new { error = "Usuario o contraseña incorrectos" });

            // --- Generar JWT ---
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Username),
                new Claim("rol", usuario.Rol)
            };
         

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("r8P2y!dK9xQf#v7Lz3Tn&u6BmH5jW1Ys"
)); // Usa la misma clave que en Program.cs
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                token = tokenString,
                user = new { username = usuario.Username, rol = usuario.Rol }
            });
        }

        // --- VALIDAR TOKEN ---
        [HttpGet("validate")]
        [Authorize]
        public IActionResult Validate()
        {
            return Ok(new { valid = true });
        }

        // --- LOGOUT (opcional, solo para limpiar sesión si usas cookies) ---
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