using AlRaneem.Website.DataAccess.Constants;
using AlRaneem.Website.DataAccess.Contexts;
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
                AddLookups(context);
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
        static void AddLookups(ApplicationDbContext context)
        {
            if(!context.Lookups.Any())
            context.Lookups.AddRange(
                new Lookup { Id = 1, Type = LookupType.TicketPriority, Name = "Low" },
                new Lookup { Id = 2, Type = LookupType.TicketPriority, Name = "Medium" },
                new Lookup { Id = 3, Type = LookupType.TicketPriority, Name = "High" },

                new Lookup { Id = 4, Type = LookupType.TicketStatus, Name = "Open" },
                new Lookup { Id = 5, Type = LookupType.TicketStatus, Name = "Assigned" },
                new Lookup { Id = 6, Type = LookupType.TicketStatus, Name = "In Progress" },
                new Lookup { Id = 7, Type = LookupType.TicketStatus, Name = "Completed" },

                new Lookup { Id = 8, Type = LookupType.SupportOption, Name = "Technical Support" },
                new Lookup { Id = 9, Type = LookupType.SupportOption, Name = "Billing Support" },
                new Lookup { Id = 10, Type = LookupType.SupportOption, Name = "General Inquiry" },

                new Lookup { Id = 11, Type = LookupType.Category, Name = "Microsoft Dynamics F&O" },

                    new Lookup { Id = 12, Type = LookupType.Subcategory, Name = "Finance", ParentId = 11 },
                    new Lookup { Id = 13, Type = LookupType.Subcategory, Name = "Supply Chain Management", ParentId = 11 },
                    new Lookup { Id = 14, Type = LookupType.Subcategory, Name = "Human Resources", ParentId = 11 },
                    new Lookup { Id = 15, Type = LookupType.Subcategory, Name = "Manufacturing", ParentId = 11 },
                    new Lookup { Id = 16, Type = LookupType.Subcategory, Name = "Retail and Commerce", ParentId = 11 },
                    new Lookup { Id = 17, Type = LookupType.Subcategory, Name = "Project Management and Accounting", ParentId = 11 },
                    new Lookup { Id = 18, Type = LookupType.Subcategory, Name = "Business Intelligence and Analytics", ParentId = 11 },
                    new Lookup { Id = 19, Type = LookupType.Subcategory, Name = "Customer Relationship Management (CRM)", ParentId = 11 },
                    new Lookup { Id = 20, Type = LookupType.Subcategory, Name = "Governance, Risk, and Compliance", ParentId = 11 },
                    new Lookup { Id = 21, Type = LookupType.Subcategory, Name = "Data Management", ParentId = 11 },
                    new Lookup { Id = 22, Type = LookupType.Subcategory, Name = "Service Management", ParentId = 11 },

                new Lookup { Id = 23, Type = LookupType.Category, Name = "Business Central" },

                    new Lookup { Id = 24, Type = LookupType.Subcategory, Name = "Finance Management", ParentId = 23 },
                    new Lookup { Id = 25, Type = LookupType.Subcategory, Name = "Sales & Service Management", ParentId = 23 },
                    new Lookup { Id = 26, Type = LookupType.Subcategory, Name = "Project Management", ParentId = 23 },
                    new Lookup { Id = 27, Type = LookupType.Subcategory, Name = "Supply Chain Management", ParentId = 23 },
                    new Lookup { Id = 28, Type = LookupType.Subcategory, Name = "Operations Management", ParentId = 23 },
                    new Lookup { Id = 29, Type = LookupType.Subcategory, Name = "Reporting & Analytics", ParentId = 23 },

                new Lookup { Id = 30, Type = LookupType.Category, Name = "Azure" },
                new Lookup { Id = 31, Type = LookupType.Category, Name = "We Care" },
                new Lookup { Id = 32, Type = LookupType.Category, Name = "Elite Real Estate" },
                new Lookup { Id = 33, Type = LookupType.Category, Name = "LCS" }
            );
        }
        #endregion
    }
}
