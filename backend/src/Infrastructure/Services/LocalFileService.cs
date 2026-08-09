using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.Infrastructure.Services;

public class LocalFileService(IWebHostEnvironment environment) : IFileService
{
    public async Task<string> UploadImageAsync(Stream fileStream, string fileName, string folder)
    {
        if (fileStream == null || fileStream.Length == 0)
            return string.Empty;

        var uploadsFolder = Path.Combine(environment.ContentRootPath, "wwwroot", "uploads", folder);
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }

        return $"/uploads/{folder}/{uniqueFileName}";
    }
}

