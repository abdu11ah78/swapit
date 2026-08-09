namespace SwapIt.Application.Common.Interfaces;

public interface IFileService
{
    Task<string> UploadImageAsync(Stream fileStream, string fileName, string folder);
}

