using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Text.Json;

namespace APP.Controllers
{
    [Route("api/gpu")]
    [ApiController]
    [Authorize] // requiere JWT para todos los endpoints; métodos específicos siguen comprobando roles
    public class GpuApiController : ControllerBase
    {
        private readonly ConexionMySql _db;

        public GpuApiController(ConexionMySql db)
        {
            _db = db;
        }

        // DTO para recibir GPU + proveedor opcional
        public class GpuCreateEditDTO
        {
            public Gpu Gpu { get; set; }
            public Proveedor Proveedor { get; set; } // Opcional
        }

        // --- LISTAR TODAS LAS GPUs ---
        [HttpGet]
        public IActionResult GetGPUs()
        {
            try
            {
                var lista = _db.ObtenerGPUs() ?? new List<Gpu>();

                var result = lista.Select(g => new
                {
                    g.IdGPU,
                    g.Marca,
                    g.Modelo,
                    g.VRAM,
                    g.NucleosCuda,
                    g.Precio,
                    g.Imagen,
                    g.RayTracing,
                    Proveedor = g.Proveedor == null ? null : new
                    {
                        g.Proveedor.IdProveedor,
                        g.Proveedor.Nombre,
                        g.Proveedor.Direccion,
                        g.Proveedor.Telefono,
                        g.Proveedor.Email
                    }
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GpuApiController] Error en GetGPUs: {ex}");
                return StatusCode(500, new { error = "Error interno al listar GPUs" });
            }
        }

        // --- BUSCAR POR TÉRMINO ---
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return BadRequest(new { error = "Debe enviar searchTerm" });

            try
            {
                var lista = _db.ObtenerGPUs() ?? new List<Gpu>();
                var resultados = lista
                    .Where(gpu => !string.IsNullOrEmpty(gpu.Modelo) &&
                                  gpu.Modelo.IndexOf(searchTerm, StringComparison.OrdinalIgnoreCase) >= 0)
                    .Select(g => new
                    {
                        g.IdGPU,
                        g.Marca,
                        g.Modelo,
                        g.VRAM,
                        g.NucleosCuda,
                        g.Precio,
                        g.Imagen,
                        g.RayTracing,
                        Proveedor = g.Proveedor == null ? null : new
                        {
                            g.Proveedor.IdProveedor,
                            g.Proveedor.Nombre
                        }
                    })
                    .ToList();

                if (!resultados.Any())
                    return NotFound(new { error = $"No se encontraron GPUs con '{searchTerm}'." });

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GpuApiController] Error en Search('{searchTerm}'): {ex}");
                return StatusCode(500, new { error = "Error interno al buscar GPUs" });
            }
        }

        // --- OBTENER GPU POR ID ---
        [HttpGet("{id}")]
        public IActionResult GetGPU(int id)
        {
            try
            {
                var gpu = _db.ObtenerGPUs()?.FirstOrDefault(g => g.IdGPU == id);

                if (gpu == null) return NotFound(new { error = "GPU no encontrada" });

                var result = new
                {
                    gpu.IdGPU,
                    gpu.Marca,
                    gpu.Modelo,
                    gpu.VRAM,
                    gpu.NucleosCuda,
                    gpu.Precio,
                    gpu.Imagen,
                    gpu.RayTracing,
                    Proveedor = gpu.Proveedor == null ? null : new
                    {
                        IdProveedor = gpu.Proveedor.IdProveedor,
                        Nombre = gpu.Proveedor.Nombre,
                        Direccion = gpu.Proveedor.Direccion,
                        Telefono = gpu.Proveedor.Telefono,
                        Email = gpu.Proveedor.Email
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GpuApiController] Error en GetGPU id={id}: {ex}");
                return StatusCode(500, new { error = "Error interno al obtener GPU" });
            }
        }

        // --- UTIL: parsear body robustamente ---
        private bool TryParseDto(JsonElement body, out GpuCreateEditDTO dto, out string errorMessage)
        {
            dto = null;
            errorMessage = null;
            try
            {
                var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                // intentar deserializar a DTO (espera { Gpu: {...}, Proveedor: {...} })
                dto = JsonSerializer.Deserialize<GpuCreateEditDTO>(body.GetRawText(), opts);

                // si dto no trae Gpu, intentar deserializar body directamente como Gpu
                if (dto == null || dto.Gpu == null)
                {
                    try
                    {
                        var singleGpu = JsonSerializer.Deserialize<Gpu>(body.GetRawText(), opts);
                        if (singleGpu != null)
                        {
                            dto = new GpuCreateEditDTO { Gpu = singleGpu, Proveedor = null };
                        }
                    }
                    catch { /* ignore */ }
                }

                if (dto == null || dto.Gpu == null)
                {
                    errorMessage = "No se encontró un objeto Gpu válido en el body.";
                    return false;
                }

                return true;
            }
            catch (JsonException jex)
            {
                errorMessage = "JSON inválido: " + jex.Message;
                return false;
            }
            catch (Exception ex)
            {
                errorMessage = "Error al procesar body: " + ex.Message;
                return false;
            }
        }

        // --- CREAR GPU (solo ADMIN y ENCARGADO) ---
        [HttpPost]
        [Authorize(Roles = "ADMIN,ENCARGADO")]
        public IActionResult Create([FromBody] JsonElement body)
        {
            try
            {
                // log body corto para diagnóstico
                var raw = body.GetRawText();
                Console.WriteLine($"[GpuApiController] Create body: {raw}");

                if (!TryParseDto(body, out var dto, out var parseError))
                {
                    Console.WriteLine($"[GpuApiController] Create parse error: {parseError}");
                    return BadRequest(new { error = parseError ?? "Body inválido" });
                }

                var gpu = dto.Gpu;
                var proveedor = dto.Proveedor;

                // Validaciones básicas
                var errores = new List<string>();
                if (string.IsNullOrWhiteSpace(gpu.Marca)) errores.Add("Marca es obligatoria.");
                if (string.IsNullOrWhiteSpace(gpu.Modelo)) errores.Add("Modelo es obligatorio.");
                if (string.IsNullOrWhiteSpace(gpu.VRAM)) errores.Add("VRAM es obligatoria.");
                if (gpu.NucleosCuda <= 0) errores.Add("NucleosCuda debe ser mayor que 0.");
                if (gpu.Precio <= 0) errores.Add("Precio debe ser mayor que 0.");

                if (errores.Any())
                    return BadRequest(new { error = "Campos obligatorios incompletos", details = errores });

                gpu.Imagen = gpu.Imagen ?? string.Empty;

                bool resultado = _db.InsertarGPU(gpu, proveedor);

                if (!resultado)
                    return StatusCode(500, new { error = "No se pudo insertar la GPU" });

                var bodyResult = new
                {
                    gpu.IdGPU,
                    gpu.Marca,
                    gpu.Modelo,
                    gpu.VRAM,
                    gpu.NucleosCuda,
                    gpu.Precio,
                    gpu.Imagen,
                    gpu.RayTracing,
                    Proveedor = proveedor == null ? null : new
                    {
                        proveedor.IdProveedor,
                        proveedor.Nombre,
                        proveedor.Direccion,
                        proveedor.Telefono,
                        proveedor.Email
                    }
                };

                if (gpu.IdGPU > 0)
                    return CreatedAtAction(nameof(GetGPU), new { id = gpu.IdGPU }, bodyResult);

                return Ok(bodyResult);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GpuApiController] Error en Create: {ex}");
                return StatusCode(500, new { error = "Error interno al crear GPU" });
            }
        }

        // --- EDITAR GPU (solo ADMIN y ENCARGADO) ---
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN,ENCARGADO")]
        public IActionResult Edit(int id, [FromBody] JsonElement body)
        {
            try
            {
                Console.WriteLine($"[GpuApiController] Edit id={id} body: {body.GetRawText()}");

                if (!TryParseDto(body, out var dto, out var parseError))
                {
                    Console.WriteLine($"[GpuApiController] Edit parse error: {parseError}");
                    return BadRequest(new { error = parseError ?? "Body inválido" });
                }

                var gpu = dto.Gpu;
                var proveedor = dto.Proveedor;
                gpu.IdGPU = id;

                var errores = new List<string>();
                if (string.IsNullOrWhiteSpace(gpu.Marca)) errores.Add("Marca es obligatoria.");
                if (string.IsNullOrWhiteSpace(gpu.Modelo)) errores.Add("Modelo es obligatorio.");
                if (string.IsNullOrWhiteSpace(gpu.VRAM)) errores.Add("VRAM es obligatoria.");
                if (gpu.NucleosCuda <= 0) errores.Add("NucleosCuda debe ser mayor que 0.");
                if (gpu.Precio <= 0) errores.Add("Precio debe ser mayor que 0.");

                if (errores.Any())
                    return BadRequest(new { error = "Campos obligatorios incompletos", details = errores });

                bool actualizado = _db.EditarGPU(gpu, proveedor);

                if (!actualizado)
                    return StatusCode(500, new { error = "No se pudo actualizar la GPU" });

                var bodyResult = new
                {
                    gpu.IdGPU,
                    gpu.Marca,
                    gpu.Modelo,
                    gpu.VRAM,
                    gpu.NucleosCuda,
                    gpu.Precio,
                    gpu.Imagen,
                    gpu.RayTracing,
                    Proveedor = proveedor == null ? null : new
                    {
                        proveedor.IdProveedor,
                        proveedor.Nombre
                    }
                };

                return Ok(bodyResult);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GpuApiController] Error en Edit id={id}: {ex}");
                return StatusCode(500, new { error = "Error interno al editar GPU" });
            }
        }

        // --- ELIMINAR GPU (solo ADMIN) ---
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult Delete(int id)
        {
            try
            {
                bool eliminado = _db.EliminarGPU(id);
                if (!eliminado)
                    return StatusCode(500, new { error = "No se pudo eliminar la GPU" });

                return Ok(new { message = "GPU eliminada" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GpuApiController] Error en Delete id={id}: {ex}");
                return StatusCode(500, new { error = "Error interno al eliminar GPU" });
            }
        }
    }
}