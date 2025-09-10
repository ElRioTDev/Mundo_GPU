// DTOs/GPUExportDTO.cs
using System;

namespace APP.DTOs
{
    public class GPUExportDTO
    {
        public int IdGPU { get; set; }
        public string Marca { get; set; } = string.Empty;
        public string Modelo { get; set; } = string.Empty;
        public string VRAM { get; set; } = string.Empty;
        public int NucleosCuda { get; set; }
        public bool RayTracing { get; set; }
        public string Imagen { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public ProveedorDTO Proveedor { get; set; } = new ProveedorDTO();
    }

    public class ProveedorDTO
    {
        public int IdProveedor { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
