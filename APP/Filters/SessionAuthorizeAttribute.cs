using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace APP.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class SessionRoleAuthorizeAttribute : ActionFilterAttribute
    {
        private readonly string[] _rolesPermitidos;

        // Constructor opcional con roles permitidos
        public SessionRoleAuthorizeAttribute(params string[] rolesPermitidos)
        {
            _rolesPermitidos = rolesPermitidos ?? Array.Empty<string>();
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var session = context.HttpContext.Session;

            // Obtener ID y rol de la sesión
            var userId = session.GetInt32("UserId");
            var rol = session.GetString("Rol");

            // 1️⃣ Si no hay sesión activa → redirigir al login
            if (userId == null)
            {
                context.Result = new RedirectToActionResult("Index", "Login", null);
                return;
            }

            // 2️⃣ Validar rol si se especificaron roles permitidos
            if (_rolesPermitidos.Length > 0)
            {
                if (string.IsNullOrEmpty(rol) || !_rolesPermitidos.Contains(rol))
                {
                    context.Result = new RedirectToActionResult("AccessDenied", "Home", null);
                    return;
                }
            }

            base.OnActionExecuting(context);
        }
    }
}
