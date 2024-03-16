using EFCore;
using Microsoft.AspNetCore.Mvc;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace bike_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly RentContext _context;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, RentContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var getTest = await _context.Test.ToListAsync();
            return Ok(getTest);
        }

        [HttpPost]
        public async Task<IActionResult> SetTest([FromBody] Test test)
        {
            await _context.Test.AddAsync(test);
            await _context.SaveChangesAsync();
            return Ok("Успешно создано");
        }


    }
}
