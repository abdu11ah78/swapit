using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwapIt.Application.Common.Interfaces;

namespace SwapIt.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class UploadController(IFileService fileService) : ControllerBase
{
    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file, [FromQuery] string folder = "items")
    {
        if (file == null) return BadRequest("No file uploaded.");
        
        using var stream = file.OpenReadStream();
        var url = await fileService.UploadImageAsync(stream, file.FileName, folder);
        return Ok(new { url });
    }

    [HttpPost("images")]
    public async Task<IActionResult> UploadImages(List<IFormFile> files, [FromQuery] string folder = "items")
    {
        if (files == null || files.Count == 0) return BadRequest("No files uploaded.");

        var urls = new List<string>();
        foreach (var file in files)
        {
            using var stream = file.OpenReadStream();
            var url = await fileService.UploadImageAsync(stream, file.FileName, folder);
            urls.Add(url);
        }

        return Ok(new { urls });
    }
}
