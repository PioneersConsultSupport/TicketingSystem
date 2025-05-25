using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlRaneem.Website.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addRelationBetweenUserTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedToEmail",
                table: "Tickets");

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "userRoles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "AssignedToId",
                table: "Tickets",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_AssignedToId",
                table: "Tickets",
                column: "AssignedToId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_userRoles_AssignedToId",
                table: "Tickets",
                column: "AssignedToId",
                principalTable: "userRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_userRoles_AssignedToId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_AssignedToId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "UserName",
                table: "userRoles");

            migrationBuilder.DropColumn(
                name: "AssignedToId",
                table: "Tickets");

            migrationBuilder.AddColumn<string>(
                name: "AssignedToEmail",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
