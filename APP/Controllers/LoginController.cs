using Microsoft.AspNetCore.Mvc;
using APP.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration; // <-- añadido

namespace APP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginApiController : ControllerBase
    {
        private readonly ConexionMySql _db;
        private readonly IConfiguration _config; // <-- añadido

        public LoginApiController(ConexionMySql db, IConfiguration config) // <-- constructor actualizado
        {
            _db = db;
            _config = config;
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
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Username ?? string.Empty),
                new Claim(ClaimTypes.Name, usuario.Username ?? string.Empty),
                new Claim("rol", usuario.Rol ?? string.Empty)
            };

            // Obtener la clave desde configuración (coincide con el valor por defecto en Program.cs)
            var jwtKey = _config["Jwt:Key"] ?? "r8P2y!dK9xQf#v7Lz3Tn&u6BmH5jxy1";

            // Derivar bytes de 32 bytes (SHA256) para que la firma con HS256 reciba la longitud mínima requerida
            var keyBytes = SHA256.HashData(Encoding.UTF8.GetBytes(jwtKey));
            var key = new SymmetricSecurityKey(keyBytes);
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var now = DateTime.UtcNow;
            var token = new JwtSecurityToken(
                claims: claims,
                notBefore: now,
                expires: now.AddHours(2),
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