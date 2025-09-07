using Microsoft.AspNetCore.Mvc;
using APP.Data;
using Microsoft.AspNetCore.Http;

namespace APP.Controllers
{
    public class LoginController : Controller
    {
        private readonly ConexionMySql _db;

        public LoginController(ConexionMySql db)
        {
            _db = db;
        }

        // GET: Login
        public IActionResult index()
        {
            // Limpiar sesión por seguridad
            HttpContext.Session.Clear();
            return View();
        }

        // POST: Login
        [HttpPost]
        public IActionResult index(string username, string password)
        {
            // Verificar credenciales directamente
            var usuario = _db.ObtenerUsuario(username, password);

            if (usuario == null)
            {
                ViewBag.Error = "Usuario o contraseña incorrectos";
                return View();
            }

            // Guardar en sesión
           // Guardar sesión
            HttpContext.Session.SetInt32("UserId", usuario.Id);
            HttpContext.Session.SetString("Username", usuario.Username);
            HttpContext.Session.SetString("Rol", usuario.Rol);

            return View();
       }

        // Cerrar sesión
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("index", "Login");
        }
    }
}
