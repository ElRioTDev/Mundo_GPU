using APP.Data;

var builder = WebApplication.CreateBuilder(args);

// ================== Agregar servicios ==================
// MVC con vistas
builder.Services.AddControllersWithViews();

// Registrar ConexionMySql como servicio Scoped
builder.Services.AddScoped<ConexionMySql>();

// Configurar sesiones en memoria
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Duración de la sesión
    options.Cookie.HttpOnly = true;                  // Seguridad
    options.Cookie.IsEssential = true;              // Necesaria para la app
});

var app = builder.Build();

// ================== Pipeline HTTP ==================
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Debe ir antes de UseAuthorization para que las sesiones funcionen
app.UseSession();

app.UseAuthorization();

// ================== Rutas MVC ==================
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
);

app.Run();
