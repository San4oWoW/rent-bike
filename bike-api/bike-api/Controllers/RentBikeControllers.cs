using bike_api.Models;
using Domain.Entities;
using EFCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace bike_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class RentBikeControllers : ControllerBase
    {
        private readonly RentContext _context;
        public RentBikeControllers(RentContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetRentBikes()
        {
            var bicycles = await _context.Bikes.Where(x => x.IsReserved == false && x.IsDeleted == false).ToListAsync();
            return Ok(bicycles);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SetBike([FromForm] BikeModel model, IFormFile image)
        {
            if (model == null || image == null)
            {
                return BadRequest("Invalid input");
            }

            byte[] imageBytes;
            using (var memoryStream = new MemoryStream())
            {
                await image.CopyToAsync(memoryStream);
                imageBytes = memoryStream.ToArray();
            }

            var bicycle = new Bike
            {
                Name = model.Name,
                Description = model.Description,
                Price = model.Price,
                IsReserved = false,
                Image = imageBytes
            };

            _context.Bikes.Add(bicycle);
            await _context.SaveChangesAsync();

            return Ok("Model uploaded successfully");
        }

        [HttpPost(nameof(RentBike))]
        public async Task<IActionResult> RentBike()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return NotFound("Пользователь не найден");
            var bikes = _context.Bikes.Where(x => x.UserId == userId);
            foreach (var bike in bikes)
            {
                bike.IsReserved = true;
                _context.Bikes.Update(bike);
            }
            await _context.SaveChangesAsync();
            return Ok("Успешно арендованы");
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var bike = await _context.Bikes.FirstOrDefaultAsync(x => x.Id == id);
            if (bike == null) return NotFound("Такой велик не найден");
            bike.IsDeleted = true;
            _context.Update(bike);
            await _context.SaveChangesAsync();
            return Ok("Велик был удален");
        }

        [HttpGet("check")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CheckAdmin()
        {
            return Ok();
        }
    }
}
