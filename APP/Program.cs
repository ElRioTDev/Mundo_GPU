using APP.Data;
using APP.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;

var builder = WebApplication.CreateBuilder(args);

// ================== Servicios ==================

// MVC con vistas
builder.Services.AddControllersWithViews();

// Servicio de exportación a Excel
builder.Services.AddScoped<IExcelExportService, ExcelExportService>();

// Servicio de acceso a base de datos personalizado
builder.Services.AddScoped<ConexionMySql>();

// Acceso al contexto HTTP
builder.Services.AddHttpContextAccessor();

// Configuración de sesiones en memoria (puedes eliminar si solo usas JWT)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// ================== JWT Authentication ==================
// Lee la clave desde configuración si existe, si no usa el valor por defecto
var jwtKey = builder.Configuration["Jwt:Key"] ?? "r8P2y!dK9xQf#v7Lz3Tn&u6BmH5jW1s1";
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = signingKey,
        ClockSkew = TimeSpan.Zero,
        RoleClaimType = "rol" // usar el claim "rol" del JWT como rol para [Authorize(Roles=...)]
    };

    // Logs útiles en desarrollo
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = ctx =>
        {
            Console.WriteLine("[JWT] Authentication failed: " + ctx.Exception?.Message);
            return System.Threading.Tasks.Task.CompletedTask;
        },
        OnTokenValidated = ctx =>
        {
            Console.WriteLine("[JWT] Token validated for: " + (ctx.Principal?.Identity?.Name ?? "<no-name>"));
            return System.Threading.Tasks.Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            Console.WriteLine("[JWT] OnChallenge error: " + context.Error + " desc: " + context.ErrorDescription);
            return System.Threading.Tasks.Task.CompletedTask;
        }
    };
});

// ================== CORS ==================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// ================== Middleware ==================

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession();

// CORS debe aplicarse antes de la autenticación para que los headers estén presentes en todas las respuestas
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Mapear controllers y rutas MVC
app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
);

app.Run();