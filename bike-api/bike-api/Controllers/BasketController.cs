using Domain.Entities;
using EFCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace bike_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class BasketController : ControllerBase
    {
        private readonly RentContext _context;
        private readonly UserManager<User> _userManager;

        public BasketController(RentContext context, UserManager<User> userManager) 
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetBasketListByUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                return Ok(await _context.Bikes.Where(x => x.UserId == userId && x.IsReserved == false && x.IsDeleted == false).ToListAsync());
            }
            return NotFound();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddToBasketByUser(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null) return NotFound("Пользователь не найден");
            
            var bike = _context.Bikes.FirstOrDefault(x => x.Id == id);

            if (bike == null) return NotFound("Товар не найден");
           
            bike.UserId = userId;
            _context.Bikes.Update(bike);
            await _context.SaveChangesAsync();
            return Ok("Добавлено");
            
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteFromBasketByUser(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null) return NotFound("Пользователь не найден");

            var bike = await _context.Bikes.FirstOrDefaultAsync(x => x.Id == id);
            if (bike == null) return NotFound("Велик не найден");

            bike.UserId = null;
            _context.Bikes.Update(bike);
            await _context.SaveChangesAsync();

            return Ok("Велик удален из корзины");
        }
    }
}
