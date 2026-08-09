using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SwapIt.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLtpBalance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LtpBalance",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LtpBalance",
                table: "Users");
        }
    }
}
