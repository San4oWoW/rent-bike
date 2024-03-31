using Domain.Entities;
using EFCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
           {
               new OpenApiSecurityScheme
               {
                   Reference = new OpenApiReference
                   {
                       Type = ReferenceType.SecurityScheme,
                       Id = "Bearer"
                   }
               },
               Array.Empty<string>()
           }
        });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

AddServices(builder);
AddDatabaseContext(builder);

var app = builder.Build();

MigrateDbToLatest(app);
await SeedUsersAndRoles(app);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseRouting();
app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
app.UseDefaultFiles();
app.MapControllers();

app.Run();

void MigrateDbToLatest(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var licenseContext = scope.ServiceProvider.GetRequiredService<RentContext>();
    var identityContext = scope.ServiceProvider.GetRequiredService<IdentityContext>();

    void ApplyMigrations(DbContext context)
    {
        var needApplyMigrations = context?.Database.GetPendingMigrations();
        if (needApplyMigrations?.Any() ?? false)
            context?.Database.Migrate();
    }

    
    ApplyMigrations(licenseContext);
    ApplyMigrations(identityContext);
}


void AddDatabaseContext(WebApplicationBuilder builder)
{
    builder.Services.AddDbContext<RentContext>(options =>
    {
        var connection = builder.Configuration.GetConnectionString("RentContext");
        options.UseNpgsql(connection);
    });

    builder.Services.AddDbContext<IdentityContext>(options =>
    {
        var connection = builder.Configuration.GetConnectionString("IdentityContext");
        options.UseNpgsql(connection);
    });
}

void AddServices(WebApplicationBuilder builder)
{
    builder.Services
        .AddIdentityCore<User>(options =>
        {
            options.User.RequireUniqueEmail = false;
            options.SignIn.RequireConfirmedEmail = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequiredLength = 5;
        })
        .AddRoles<IdentityRole>()
        .AddSignInManager<SignInManager<User>>()
        .AddRoleManager<RoleManager<IdentityRole>>()
        .AddEntityFrameworkStores<IdentityContext>();


    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("здесь_должен_быть_длинный_секретный_ключ")),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        })
        .AddApplicationCookie();

    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
        options.AddPolicy("RequireUserRole", policy => policy.RequireRole("User"));
    });
}


async Task SeedUsersAndRoles(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;

    try
    {
        var userManager = services.GetRequiredService<UserManager<User>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        string[] roleNames = { "Admin", "Editor", "Viewer" };
        foreach (var roleName in roleNames)
        {
            if (await roleManager.FindByNameAsync(roleName) == null)
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        string adminUsername = "admin";
        string login = "admin";
        string adminEmail = "admin@example.com";
        string adminPassword = "admin123";
        if (await userManager.FindByNameAsync(adminUsername) == null)
        {
            var admin = new User { UserName = adminUsername, Login= adminUsername, Email = adminEmail, TwoFactorEnabled = true };
            var result = await userManager.CreateAsync(admin, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }

    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}


