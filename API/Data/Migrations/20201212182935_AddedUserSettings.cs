using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace API.Data.Migrations
{
    public partial class AddedUserSettings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserSettingsId",
                table: "AspNetUsers",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MinAge = table.Column<int>(type: "integer", nullable: false),
                    MaxAge = table.Column<int>(type: "integer", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSettings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_UserSettingsId",
                table: "AspNetUsers",
                column: "UserSettingsId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_UserSettings_UserSettingsId",
                table: "AspNetUsers",
                column: "UserSettingsId",
                principalTable: "UserSettings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_UserSettings_UserSettingsId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "UserSettings");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_UserSettingsId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserSettingsId",
                table: "AspNetUsers");
        }
    }
}
