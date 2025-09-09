using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Filters;

namespace APP.Controllers
{
    [RedirectIfAuthenticated] // Evita acceso si ya hay sesión
    public class RegistroController : Controller
    {
        private readonly ConexionMySql _db;

        public RegistroController(ConexionMySql db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult ComprobarRegistro(
    string usuario, string password, string confirmarPassword,
    string nombre, string apellido, string sexo,
    string nivelAcademico, string institucion)
        {
            if (password != confirmarPassword)
            {
                ModelState.AddModelError("", "Error: las contraseñas no coinciden.");
                return View("Index");
            }

            // Rol por defecto asignado aquí en el controller
            string rolPorDefecto = "EMPLEADO";

            string mensajeError;
            bool exito = _db.RegistrarUsuario(
                usuario,
                password,
                nombre,
                apellido,
                sexo,
                nivelAcademico,
                institucion,
                rolPorDefecto,
                out mensajeError
            );

            if (!exito)
            {
                ModelState.AddModelError("", mensajeError);
                return View("Index");
            }

            TempData["Success"] = "Usuario registrado correctamente";
            return RedirectToAction("Index", "Login");
        }






    }
}
