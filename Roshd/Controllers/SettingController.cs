using fsf.Security;
using Roshd.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Roshd.Controllers
{
    public class SettingController : Controller
    {
        RoshdEntities context = new RoshdEntities();
        //
        // GET: /Setting/

        public ActionResult Setting()
        {
            return View();
        }

        public ActionResult ChangePasswordNew()
        {
            return View();
        }

        public ActionResult CheckChangePassword(string OldPassword = "", string NewPassword = "")
        {
            try
            {
                if (OldPassword.Trim() == "")
                {
                    return Json(2);
                }
                if (NewPassword.Trim() == "")
                {
                    return Json(3);
                }
                int membershipID = Convert.ToInt32(Session["MembershipID"]);
                var membership = context.MemberShips.FirstOrDefault(x => x.ID == membershipID && x.IsDelete == false);

                var Password = membership != null ? membership.Password : "";
                var result = (Cryptography.Decrypt(Password) == OldPassword) ? true : false;

                if (result == false)
                {
                    return Json(1);
                }
                if (result == true)
                {
                    if (membership != null)
                    {
                        var StrPass = Cryptography.Encrypt(NewPassword);
                        membership.Password = StrPass;
                        membership.MemberID = membershipID;
                        context.Configuration.ValidateOnSaveEnabled = false;
                        context.SaveChanges();
                        return Json(6);
                    }
                }
                return Json(9);
            }
            catch (Exception)
            {
                return Json(8);
            }


        }
    }
}
