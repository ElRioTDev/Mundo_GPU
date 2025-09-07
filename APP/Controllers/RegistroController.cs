using Microsoft.AspNetCore.Mvc;
using APP.Data;

namespace APP.Controllers
{
    public class RegistroController : Controller
    {
        private readonly ConexionMySql db = new ConexionMySql();

        [HttpGet]
        public IActionResult Index()
        {

            return View();
        }

        [HttpPost]
        public IActionResult ComprobarRegistro(string usuario, string password, string confirmarPassword)
        {
            // 1. Validar que las contraseñas coincidan
            if (password != confirmarPassword)
            {
                TempData["Error"] = "Las contraseñas no coinciden";
                return RedirectToAction("Index"); // vuelve al formulario de registro
            }

            // 2. Llamar al método para registrar el usuario
            bool exito = db.RegistrarUsuario(usuario, password);

            if (!exito)
            {
                TempData["Error"] = "Ocurrió un error al registrar el usuario";
                return RedirectToAction("Index"); // vuelve al formulario de registro
            }

            // 3. Redirigir al login después del registro
            return RedirectToAction("Index", "Login");
        }
    }
}
