namespace APP.Models
{
    public class Proveedor
    {
        public int IdProveedor { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }

        // Relación uno a muchos con GPUs
        public ICollection<Gpu> GPUs { get; set; } = new List<Gpu>();
    }

    public class Gpu
    {
        public int IdGPU { get; set; }
        public string Marca { get; set; }
        public string Modelo { get; set; }
        public string VRAM { get; set; }
        public int NucleosCuda { get; set; }
        public bool RayTracing { get; set; }
        public string Imagen { get; set; }
        public decimal Precio { get; set; }

        // Clave foránea
        public int ProveedoresIdProveedor { get; set; }

        // Propiedad de navegación
        public Proveedor Proveedor { get; set; }
    }
}
