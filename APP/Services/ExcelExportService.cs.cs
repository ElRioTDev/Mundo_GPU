using ClosedXML.Excel;
using APP.Models;
using System.Collections.Generic;
using System.IO;
using System;

namespace APP.Services
{
    public interface IExcelExportService
    {
        byte[] ExportGPUsToExcel(List<Gpu> gpus);
    }

    public class ExcelExportService : IExcelExportService
    {
        public byte[] ExportGPUsToExcel(List<Gpu> gpus)
        {
            using (var workbook = new XLWorkbook())
            {
                var sheet = workbook.Worksheets.Add("Listado de GPUs");

                sheet.Cell(1, 1).Value = "ID";
                sheet.Cell(1, 2).Value = "Marca";
                sheet.Cell(1, 3).Value = "Modelo";
                sheet.Cell(1, 4).Value = "VRAM";
                sheet.Cell(1, 5).Value = "Núcleos CUDA";
                sheet.Cell(1, 6).Value = "RayTracing";
                sheet.Cell(1, 7).Value = "Precio";
                sheet.Cell(1, 8).Value = "Proveedor";

                var header = sheet.Range(1, 1, 1, 8);
                header.Style.Font.Bold = true;
                header.Style.Fill.BackgroundColor = XLColor.LightGray;

                int row = 2;
                foreach (var gpu in gpus)
                {
                    sheet.Cell(row, 1).Value = gpu.IdGPU;
                    sheet.Cell(row, 2).Value = gpu.Marca;
                    sheet.Cell(row, 3).Value = gpu.Modelo;
                    sheet.Cell(row, 4).Value = gpu.VRAM;
                    sheet.Cell(row, 5).Value = gpu.NucleosCuda;
                    sheet.Cell(row, 6).Value = gpu.RayTracing ? "Sí" : "No";
                    sheet.Cell(row, 7).Value = gpu.Precio;
                    sheet.Cell(row, 8).Value = gpu.Proveedor?.Nombre ?? "Sin proveedor";
                    row++;
                }

                sheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }


    }
}
