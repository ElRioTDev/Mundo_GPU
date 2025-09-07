using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using APP.Filters;
using System;
using System.Collections.Generic;
using APP.Helpers;

namespace APP.Controllers
{
    // Solo usuarios logeados con rol ADMIN
    [SessionRoleAuthorize(Roles.Admin)]
    public class UserController : Controller
    {
        private readonly ConexionMySql _db;

        public UserController(ConexionMySql db)
        {
            _db = db;
        }

        // =================== Listar todos los usuarios ===================
        public IActionResult Index()
        {
            List<Usuario> lista = new List<Usuario>();

            try
            {
                lista = _db.ObtenerUsuarios() ?? new List<Usuario>();
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error al cargar los usuarios: " + ex.Message;
            }

            return View(lista);
        }

        // =================== Crear nuevo usuario ===================
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Usuario usuario)
        {
            if (!ModelState.IsValid)
                return View(usuario);

            try
            {
                string mensajeError;
                bool exito = _db.RegistrarUsuario(
                    usuario.Username,
                    usuario.Password,
                    usuario.Nombre,
                    usuario.Apellido,
                    usuario.Sexo,
                    out mensajeError // Captura el error exacto
                );

                if (!exito)
                {
                    // Mostrar el error exacto en la vista
                    ModelState.AddModelError("", mensajeError);
                    return View(usuario);
                }

                TempData["Success"] = "Usuario creado correctamente.";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Error al crear usuario: " + ex.Message);
                return View(usuario);
            }
        }

        // =================== Editar usuario ===================
        public IActionResult Edit(int id)
        {
            var usuario = _db.ObtenerUsuarioPorId(id);
            if (usuario == null)
            {
                TempData["Error"] = "Usuario no encontrado.";
                return RedirectToAction(nameof(Index));
            }

            return View(usuario);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Usuario usuario)
        {
            if (!ModelState.IsValid)
                return View(usuario);

            try
            {
                string mensajeError;
                bool exito = _db.ActualizarUsuario(usuario, out mensajeError); // Usar el método corregido

                if (!exito)
                {
                    // Mostrar mensaje de error exacto en la vista
                    ModelState.AddModelError("", mensajeError);
                    return View(usuario);
                }

                TempData["Success"] = "Usuario actualizado correctamente.";
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Error al actualizar usuario: " + ex.Message);
                return View(usuario);
            }
        }

       // ======================= ELIMINAR USUARIO =======================
public bool EliminarUsuario(int id)
{
    try
    {
        using (var conn = GetConnection())
        {
            conn.Open();
            using (var tran = conn.BeginTransaction())
            {
                try
                {
                    // 1️⃣ Eliminar registros asociados en Nivel_Academico
                    string deleteNivel = @"DELETE FROM Nivel_Academico WHERE Usuario_id=@id";
                    using (var cmdNivel = new MySqlCommand(deleteNivel, conn, tran))
                    {
                        cmdNivel.Parameters.AddWithValue("@id", id);
                        cmdNivel.ExecuteNonQuery();
                    }

                    // 2️⃣ Eliminar el usuario
                    string deleteUser = "DELETE FROM user WHERE idUSER=@id";
                    using (var cmdUser = new MySqlCommand(deleteUser, conn, tran))
                    {
                        cmdUser.Parameters.AddWithValue("@id", id);
                        cmdUser.ExecuteNonQuery();
                    }

                    // 3️⃣ Eliminar el registro en Generales asociado al usuario
                    string deleteGenerales = @"DELETE FROM Generales 
                                               WHERE idGeneral NOT IN (SELECT Generales_idGeneral FROM user)";
                    using (var cmdGen = new MySqlCommand(deleteGenerales, conn, tran))
                    {
                        cmdGen.ExecuteNonQuery();
                    }

                    tran.Commit();
                    return true;
                }
                catch (Exception exTran)
                {
                    tran.Rollback();
                    Console.WriteLine("Error al eliminar usuario: " + exTran.Message);
                    return false;
                }
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error al eliminar usuario: " + ex.Message);
        return false;
    }
}


        // =================== Detalles de usuario ===================
        public IActionResult Details(int id)
        {
            var usuario = _db.ObtenerUsuarioPorId(id);
            if (usuario == null)
            {
                TempData["Error"] = "Usuario no encontrado.";
                return RedirectToAction(nameof(Index));
            }

            return View(usuario);
        }

        public IActionResult Main()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Search(string searchTerm)
        {
            List<Usuario> lista = _db.ObtenerUsuarios() ?? new List<Usuario>();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                lista = lista.FindAll(u =>
                    u.Nombre.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                    u.Id.ToString() == searchTerm
                );
            }

            return View("Index", lista);
        }
    }
}
