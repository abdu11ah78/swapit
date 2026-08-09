using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SwapIt.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsLocationPublic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsLocationPublic",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLocationPublic",
                table: "Users");
        }
    }
}
