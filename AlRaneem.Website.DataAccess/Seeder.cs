using AlRaneem.Website.DataAccess.Constants;
using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Enums;
using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AlRaneem.Website.DataAccess
{
    public static class Seeder
    {
        public static async Task Seed(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                AddEmployees(context);
                AddUserRoles(context);
                context.SaveChanges();
            }
        }
        #region methods
        static void AddEmployees(ApplicationDbContext context)
        {

            if (!context.Employees.Any(i => i.Title == "Mr"))
            {
                List<Employee> employees = new List<Employee>() {
                        new Employee()
                    {
                        Title = "Mr",
                        Name = "Fadi Karajeh",
                        Role = "Managing Director",
                        Description = "I'm the company founder, built the team, supervised the organization strategic direction, and insure qualitative delivery.",
                        ProfileImage =ConvertImageToBytes("fadi1.png")
                    },
                        new Employee()
                    {
                        Title = "Mr",
                        Name = "Haitham Hannoun",
                        Role = "Administrative Manager",
                        Description = "Responsible for overseeing the smooth operation of the office and ensuring that all administrative tasks are completed efficiently.",
                        ProfileImage =ConvertImageToBytes("HAITHAM.jpg")
                        },
                        new Employee()
                        {
                            Title = "Ms",
                        Name = "Lujayn AL Dmour",
                        Role = "Projects Coordinator",
                        Description = "handles administrative tasks for the project manager and team members to keep the project running smoothly.",
                        ProfileImage =ConvertImageToBytes("female.jpg")
                    },
                        new Employee()
                    {
                        Title = "Mr",
                        Name = "Moath Qutaish",
                        Role = "Senior Technical Consultant",
                        Description = "Business understating, Solution architect, and quality assurance.",
                        ProfileImage =ConvertImageToBytes("MOATH.jpg")
                    },
                        new Employee()
                    {
                        Title = "Ms",
                        Name = "Rana Adwan",
                        Role = "Accountant",
                        Description = "",
                        ProfileImage =ConvertImageToBytes("female.jpg")
                        },

                        new Employee()
                    {
                        Title = "Mr",
                        Name = "Saleem Abu Elayyan",
                        Role = "Technical Consultant",
                        Description = "Expertise in software design, development, and testing to create innovative and effective solutions for our clients.",
                        ProfileImage =ConvertImageToBytes("male.jpg")
                    },
                        new Employee()
                    {
                        Title = "Mr",
                        Name = "Mohammad Mheidat",
                        Role = "Senior Web Developer",
                        Description = "Identifying user and system requirements for new websites and applications.Prioritizing software development projects, setting timelines and assigning tasks to team members.",
                        ProfileImage =ConvertImageToBytes("male.jpg")
                    },
                        new Employee()
                    {
                        Title = "Ms",
                        Name = "Rogina Irshidat Technical",
                        Role = "Technical Consultant",
                        Description = "Expertise in software design, development, and testing to create innovative and effective solutions for our clients.",
                            ProfileImage =ConvertImageToBytes("female.jpg")
                        },
                        new Employee()
                        {
                            Title = "Mr",
                            Name = "Mohannad Salameh",
                            Role = "Senior Functional Consultant",
                            Description = "Working with Functional Consultants to understand and review the feasibility of business requirements. Gathering business requirements for enhancements, customizations and developing technical requirement documents.",
                            ProfileImage =ConvertImageToBytes("male.jpg")
                        },
                        new Employee()
                        {
                            Title = "Mr",
                            Name = "Mohammad Karajeh",
                            Role = "Functional Consultant",
                            Description = "Collaborate with clients to understand their financial processes and configure ERP systems to meet their needs.",
                            ProfileImage =ConvertImageToBytes("male.jpg")
                        },
                        new Employee()
                        {
                            Title = "Mr",
                            Name = "Marwan Higazeen",
                            Role = "Functional Consultant",
                            Description = "Collaborate with clients to understand their financial processes and configure ERP systems to meet their needs.",
                            ProfileImage =ConvertImageToBytes("male.jpg")
                        },
                        new Employee()
                        {
                            Title = "Ms",
                            Name = "Lama Dmaidat",
                            Role = "Functional Consultant",
                            Description = "Collaborate with clients to understand their financial processes and configure ERP systems to meet their needs.",
                            ProfileImage =ConvertImageToBytes("female.jpg")
                        },
                        new Employee()
                        {
                            Title = "Ms",
                            Name = " Najwa Badawi- KSA",
                            Role = "Functional Consultant",
                            Description = "Collaborate with clients to understand their financial processes and configure ERP systems to meet their needs.",
                            ProfileImage =ConvertImageToBytes("female.jpg")
                        }
                    };
                context.Employees.AddRange(employees);
            }
            static byte[] ConvertImageToBytes(string imageName)
            {               
                string projectRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", ".."));
                string imagePath = Path.Combine(projectRoot, "alraneem.website.client", "src", "assets", "img", "team", imageName);

                return File.ReadAllBytes(imagePath);
            }
        }
        
        static void AddUserRoles(ApplicationDbContext context)
        {
            if (!context.userRoles.Any())
                context.userRoles.Add(new UserRole
                {
                    UserEmail = "L.alawneh@pioneersconsult.com",
                    UserName = "Laith Al alawneh",
                    UserRoleId = (int)UserRoles.Admin
                });
        }
        #endregion
    }
}
