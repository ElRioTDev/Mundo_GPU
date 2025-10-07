using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace APP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "ADMIN")] // Solo ADMIN puede acceder
    public class UserApiController : ControllerBase
    {
        private readonly ConexionMySql _db;

        public UserApiController(ConexionMySql db)
        {
            _db = db;
        }

        // --- LISTAR USUARIOS ---
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var lista = _db.ObtenerUsuarios() ?? new List<Usuario>();
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al cargar los usuarios: " + ex.Message });
            }
        }

        // --- OBTENER USUARIO POR ID ---
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var usuario = _db.ObtenerUsuarioPorId(id);
            if (usuario == null)
                return NotFound(new { error = "Usuario no encontrado" });

            return Ok(usuario);
        }

        // --- BUSCAR USUARIOS ---
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string searchTerm)
        {
            var lista = _db.ObtenerUsuarios() ?? new List<Usuario>();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                lista = lista.FindAll(u =>
                    (!string.IsNullOrEmpty(u.Nombre) && u.Nombre.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)) ||
                    (!string.IsNullOrEmpty(u.Apellido) && u.Apellido.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)) ||
                    (!string.IsNullOrEmpty(u.Username) && u.Username.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)) ||
                    u.Id.ToString() == searchTerm
                );
            }

            return Ok(lista);
        }

        // --- CREAR USUARIO ---
        [HttpPost]
        public IActionResult Create([FromBody] Usuario usuario)
        {
            if (usuario == null)
                return BadRequest(new { error = "Datos del usuario requeridos" });

            try
            {
                string mensajeError;
                bool exito = _db.RegistrarUsuario(
                    usuario.Username,
                    usuario.Password,
                    usuario.Nombre,
                    usuario.Apellido,
                    usuario.Sexo,
                    usuario.NivelAcademico,
                    usuario.Institucion,
                    usuario.Rol,
                    out mensajeError
                );

                if (!exito)
                    return BadRequest(new { error = mensajeError });

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al crear usuario: " + ex.Message });
            }
        }

        // --- EDITAR USUARIO ---
        [HttpPut("{id}")]
        public IActionResult Edit(int id, [FromBody] Usuario usuario)
        {
            if (usuario == null)
                return BadRequest(new { error = "Datos del usuario requeridos" });

            usuario.Id = id;

            try
            {
                string mensajeError;
                bool exito = _db.ActualizarUsuario(usuario, out mensajeError);

                if (!exito)
                    return BadRequest(new { error = mensajeError });

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al actualizar usuario: " + ex.Message });
            }
        }

        // --- ELIMINAR USUARIO ---
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                bool exito = _db.EliminarUsuario(id);
                if (!exito)
                    return StatusCode(500, new { error = "No se pudo eliminar el usuario" });

                return Ok(new { message = "Usuario eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al eliminar usuario: " + ex.Message });
            }
        }
    }
}