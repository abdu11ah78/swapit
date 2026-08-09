using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SwapIt.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixCategorySeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM ItemAttributeValues");
            migrationBuilder.Sql("DELETE FROM Items");
            migrationBuilder.Sql("DELETE FROM CategoryAttributes");
            migrationBuilder.Sql("DELETE FROM Categories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
