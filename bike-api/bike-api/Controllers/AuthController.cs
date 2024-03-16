using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Domain.Entities; // Убедитесь, что этот namespace соответствует вашим User и Role классам
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    
    public AuthController(UserManager<User> userManager)
    {
        _userManager = userManager;
        
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string login, string password)
    {
        var user = await _userManager.FindByNameAsync(login);
        var role = await _userManager.GetRolesAsync(user); 
        if (user != null && await _userManager.CheckPasswordAsync(user, password))
        {
            var token = "Bearer " +  GenerateJwtToken(user);
            return Ok(new { token, role });
        }

        return Unauthorized();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var user = new User { UserName = model.Login, Email = model.Email, Login = model.Username };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, "Viewer");
            return Ok(new { message = "Успешная регистрация" });
        }
        else
        {
            return BadRequest(result.Errors);
        }
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("здесь_должен_быть_длинный_секретный_ключ");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName),
            }),
            Expires = DateTime.UtcNow.AddDays(7), 
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
