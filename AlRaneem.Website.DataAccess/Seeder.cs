using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AlRaneem.Website.DataAccess
{
    public static class Seeder
    {
        public static async Task Seed(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var config = serviceProvider.GetRequiredService<IConfiguration>();
            using (var context = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                await AddRoles(serviceProvider);
                await AddAdminUser(userManager, config, context);
                await AddSupportManagerUser(userManager, config, context);
                await AddEmployeeUser(userManager, config, context);
                await AddClientUser(userManager, config, context);
                AddEmployees(context);
                AddCategories(context);
                context.SaveChanges();
            }


        }
        #region methods
        static async Task AddRoles(IServiceProvider serviceProvider)
        {
            string[] roles = new string[] { "client", "employee", "support_manager", "admin" };
            var rolesManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            foreach (string role in roles)
            {
                var dbRole = rolesManager.Roles.FirstOrDefault(x => x.Name == role);
                if (dbRole == null) await rolesManager.CreateAsync(new IdentityRole { Name = role });
            }
        }
        static async Task AddAdminUser(UserManager<ApplicationUser> userManager, IConfiguration config, ApplicationDbContext context)
        {
            string adminEmail = config["Seeder:adminEmail"] ?? throw new Exception("Default admin email not configured.");
            if (!context.Users.Any(x => adminEmail.Equals(x.Email)))
            {
                var userResult = await userManager.CreateAsync(new ApplicationUser() { Email = adminEmail, UserName = adminEmail }, "Test123!");
                if (!userResult.Succeeded) throw new Exception("Failed to create default admin user.");
            }

            var defaultAdmin = await userManager.FindByEmailAsync(adminEmail) ?? throw new Exception("Error seeding admin user");
            if (!await userManager.IsInRoleAsync(defaultAdmin, "admin"))
            {
                var roleResult = await userManager.AddToRoleAsync(defaultAdmin, "admin");
                if (!roleResult.Succeeded) throw new Exception("Failed to add admin role to default admin user in seeder.");
            }
        }
        static async Task AddSupportManagerUser(UserManager<ApplicationUser> userManager, IConfiguration config, ApplicationDbContext context)
        {
            string supportManagerEmail = config["Seeder:supportManagerEmail"] ?? throw new Exception("supportManagerEmail not configured.");
            if (!context.Users.Any(x => supportManagerEmail.Equals(x.Email)))
            {
                var userResult = await userManager.CreateAsync(new ApplicationUser() { Email = supportManagerEmail, UserName = supportManagerEmail }, "Test123!");
                if (!userResult.Succeeded) throw new Exception("Failed to create default supportManager user.");
            }

            var defaultSupportManager = await userManager.FindByEmailAsync(supportManagerEmail) ?? throw new Exception("Error seeding support_manager user");
            if (!await userManager.IsInRoleAsync(defaultSupportManager, "support_manager"))
            {
                var roleResult = await userManager.AddToRoleAsync(defaultSupportManager, "support_manager");
                if (!roleResult.Succeeded) throw new Exception("Failed to add support_manager role to default support manager user in seeder.");
            }
        }
        static async Task AddEmployeeUser(UserManager<ApplicationUser> userManager, IConfiguration config, ApplicationDbContext context)
        {
            string employeeEmail = config["Seeder:employeeEmail"] ?? throw new Exception("Default employeeEmail email not configured.");
            if (!context.Users.Any(x => employeeEmail.Equals(x.Email)))
            {
                var userResult = await userManager.CreateAsync(new ApplicationUser() { Email = employeeEmail, UserName = employeeEmail }, "Test123!");
                if (!userResult.Succeeded) throw new Exception("Failed to create default employeeEmail user.");
            }

            var defaultEmployeeEmail = await userManager.FindByEmailAsync(employeeEmail) ?? throw new Exception("Error seeding employeeEmail user");
            if (!await userManager.IsInRoleAsync(defaultEmployeeEmail, "employee"))
            {
                var roleResult = await userManager.AddToRoleAsync(defaultEmployeeEmail, "employee");
                if (!roleResult.Succeeded) throw new Exception("Failed to add employee role to default employee user in seeder.");
            }
        }
        static async Task AddClientUser(UserManager<ApplicationUser> userManager, IConfiguration config, ApplicationDbContext context)
        {
            string clientEmail = config["Seeder:clientEmail"] ?? throw new Exception("Default clientEmail email not configured.");
            if (!context.Users.Any(x => clientEmail.Equals(x.Email)))
            {
                var userResult = await userManager.CreateAsync(new ApplicationUser() { Email = clientEmail, UserName = clientEmail }, "Test123!");
                if (!userResult.Succeeded) throw new Exception("Failed to create default clientEmail user.");
            }

            var defaultClientEmail = await userManager.FindByEmailAsync(clientEmail) ?? throw new Exception("Error seeding clientEmail user");
            if (!await userManager.IsInRoleAsync(defaultClientEmail, "client"))
            {
                var roleResult = await userManager.AddToRoleAsync(defaultClientEmail, "client");
                if (!roleResult.Succeeded) throw new Exception("Failed to add client role to default client user in seeder.");
            }
        }
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
                string imagePath = "C:\\Users\\Dell\\source\\repos\\MMheidt\\AlRaneem.Website\\alraneem.website.client\\src\\assets\\img\\team\\" + imageName;
                return File.ReadAllBytes(imagePath);
            }
        }
        static void AddCategories(ApplicationDbContext context)
        {
            Add_Microsoft_Dynamics_Finance_Operations(context);
            Add_Business_Central(context);
            Add_Azure(context);
            Add_We_Care(context);
            Add_Elite_Real_Estate(context);
            Add_LCS(context);
            static void Add_Microsoft_Dynamics_Finance_Operations(ApplicationDbContext context)
            {
                if (!context.Categories.Any(i => i.Code == "microsoft_dynamics_finance_operations"))
                {
                    var childs = new List<Category>
                        {
                            new Category() { Name = "Finance", Code = "finance" },
                            new Category() { Name = "Supply Chain Management", Code = "supply_chain_management" },
                            new Category() { Name = "Human Resources", Code = "human_resources" },
                            new Category() { Name = "Manufacturing", Code = "manufacturing" },
                            new Category() { Name = "Retail and Commerce", Code = "retail_and_commerce" },
                            new Category() { Name = "Project Management and Accounting", Code = "project_management_and_accounting" },
                            new Category() { Name = "Business Intelligence and Analytics", Code = "business_intelligence_and_analytics" },
                            new Category() { Name = "Customer Relationship Management (CRM)", Code = "crm" },
                            new Category() { Name = "Governance, Risk, and Compliance", Code = "governance_risk_compliance" },
                            new Category() { Name = "Data Management", Code = "data_management" },
                            new Category() { Name = "Service Management", Code = "service_management" }
                        };

                    var category = new Category()
                    {
                        Name = "Microsoft Dynamics Finance & Operations",
                        Code = "microsoft_dynamics_finance_operations",
                        ChildCategories = childs
                    };
                    context.Categories.Add(category);
                }
            }
            static void Add_Business_Central(ApplicationDbContext context)
            {
                if (!context.Categories.Any(i => i.Code == "business_central"))
                {
                    var childs = new List<Category>
                        {
                            new Category() { Name = "Finance Management", Code = "finance_management" },
                            new Category() { Name = "Sales & Service Management", Code = "sales_service_management" },
                            new Category() { Name = "Project Management", Code = "project_management" },
                            new Category() { Name = "Supply Chain Management", Code = "supply_chain_management" },
                            new Category() { Name = "Operations Management", Code = "operations_management" },
                            new Category() { Name = "Reporting & Analytics", Code = "reporting_analytics" }
                        };

                    var category = new Category()
                    {
                        Name = "Business Central",
                        Code = "business_central",
                        ChildCategories = childs
                    };
                    context.Categories.Add(category);
                }
            }
            static void Add_Azure(ApplicationDbContext context)
            {
                if (!context.Categories.Any(i => i.Code == "azure"))
                {
                    var category = new Category()
                    {
                        Name = "Azure",
                        Code = "azure"
                    };
                    context.Categories.Add(category);
                }
            }
            static void Add_We_Care(ApplicationDbContext context)
            {
                if (!context.Categories.Any(i => i.Code == "we_care"))
                {
                    var category = new Category()
                    {
                        Name = "We Care",
                        Code = "we_care"
                    };
                    context.Categories.Add(category);
                }
            }
            static void Add_Elite_Real_Estate(ApplicationDbContext context)
            {
                if (!context.Categories.Any(i => i.Code == "elite_real_estate"))
                {
                    var category = new Category()
                    {
                        Name = "Elite Real Estate",
                        Code = "elite_real_estate"
                    };
                    context.Categories.Add(category);
                }
            }
            static void Add_LCS(ApplicationDbContext context)
            {
                if (!context.Categories.Any(i => i.Code == "lcs"))
                {
                    var category = new Category()
                    {
                        Name = "LCS",
                        Code = "lcs"
                    };
                    context.Categories.Add(category);
                }
            }
        }
        #endregion
    }
}
