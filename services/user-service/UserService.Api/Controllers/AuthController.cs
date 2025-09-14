using Microsoft.AspNetCore.Mvc;

namespace UserService.Api.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
