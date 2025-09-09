using Microsoft.AspNetCore.Mvc;
using APP.Data;
using Microsoft.AspNetCore.Http;
using APP.Filters;

namespace APP.Controllers
{
    [RedirectIfAuthenticated] // Evita acceso si ya hay sesión
    public class LoginController : Controller
    {
        private readonly ConexionMySql _db;

        public LoginController(ConexionMySql db)
        {
            _db = db;
        }

        // GET: Login
        public IActionResult Index()
        {
            return View();
        }

        // POST: Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Index(string username, string password)
        {
            var usuario = _db.ObtenerUsuario(username, password);

            if (usuario == null)
            {
                ViewBag.Error = "Usuario o contraseña incorrectos";
                return View();
            }

            // Guardar en sesión
            HttpContext.Session.SetInt32("UserId", usuario.Id);
            HttpContext.Session.SetString("Username", usuario.Username);
            HttpContext.Session.SetString("Rol", usuario.Rol);

            return RedirectToAction("Index", "Gpu");
        }

        // POST: Logout
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Logout()
        {
            Console.WriteLine(">>> CERRANDO SESIÓN...");
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Login");
        }

    }
}
