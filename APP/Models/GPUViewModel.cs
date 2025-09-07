namespace APP.Models
{
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
    }
}
