namespace SwapIt.Application.Common.Interfaces;

public interface IPasswordService
{
    string HashPassword(string plainTextPassword);
    bool VerifyPassword(string hashedPassword, string plainTextPassword);
}
