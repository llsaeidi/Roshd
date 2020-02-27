using fsf.Security;
using Roshd.Classes;
using Roshd.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Roshd.Controllers
{
     [Authorize]
    public class HomeController : Controller
    {


        RoshdEntities Context = new RoshdEntities();
        PermitActionSecuirty PS = new PermitActionSecuirty();

        //
        // GET: /Home/


        #region Home
        /// <summary>
        /// صفحه اصلی
        /// </summary>
        /// <returns></returns>
        public ActionResult HomePage()
        {
            return View();
        }

        #endregion Home

        #region Login
         /// <summary>
         /// صفحه ورود به نرم افزار
         /// </summary>
         /// <returns></returns>
        [AllowAnonymous]
        public ActionResult Login()
        {
            var Message = Session["Message"];
            Session.RemoveAll();
            Session.Clear();
            Session.Abandon();
            Session["Message"] = Message;           
            System.Web.Security.FormsAuthentication.SignOut();
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Login(Login.PLogin model)
      {
            try
            {
                Session["Message"] = null;
                
                var result = fsf.Security.Security.Login(model.UserName, model.Password);
                if (result == null)
                {
                    return RedirectToAction("Login");
                }
                string MembershipID = Convert.ToString(result.ID);
                System.Web.Security.FormsAuthentication.SetAuthCookie(MembershipID, false);
                //
                Session["MembershipID"] = result.ID;
                //
                return RedirectToAction("HomePage", "Home");

            }
            catch 
            {
                Session["Message"] = "ارتباط با سرور قطع است";
                return RedirectToAction("Login");
            }             
        }



         /// <summary>
         /// صغحه خروج از نرم افزار
         /// </summary>
         /// <returns></returns>
        public ActionResult LogOut()
        {
            return View();
        }
        #endregion login

        #region Menu

        public ActionResult LoadMenu()
        {
            var membershipID = Security.GetMembereID();
            var RoleID = Context.MemberShips.FirstOrDefault(a => a.ID == membershipID).RoleID;
            if (RoleID != null)
            {

                var str = "";                               
                var _Roles = Context.MemberResponsibilities.Where(a => a.MemberShipID == membershipID && a.IsDelete == false).Select(a => a.RoleID).ToList();
                _Roles.Add(RoleID);
                var ApplicationMenuIDList = Context.Authorizations.Where(a => _Roles.Contains(a.RoleID) && a.Type == "1").Select(a => a.AccessTo).ToList().Distinct();
                List<ApplicationMenu> _query = new List<ApplicationMenu>();
                _query = Context.ApplicationMenus.OrderBy(c => c.MenuOrder).Where(c => ApplicationMenuIDList.Contains(c.ID)).ToList();

                Context.ApplicationMenus.OrderBy(c => c.MenuOrder).Where(c => ApplicationMenuIDList.Contains(c.ID)).ToList().ForEach(s =>
                {
                    var id = Convert.ToInt32(s.ID);



                    var menuHeader = Context.ApplicationMenus.ToList().FirstOrDefault(c => c.ID == id).MenuName;
                    str = str + "<ul id='" + id + "' class='nav navbar-nav Menu' style='border: solid 2px #979596;margin: 2px;background-color: #ffffff;' onclick='fnSelectMenu(this)'><li><a href='" + s.MenuURL + "'>" + s.MenuName + "</a> </li></ul>";




                });


                return Json(str, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(0);
            }
        }
        public class Test
        {
            public int Type { get; set; }
            public string result { get; set; }
        }



        public Test CreateMenuTest(int? ID)
        {

            Test _test = new Test();

            var _query = Context.ApplicationPages.FirstOrDefault(a => a.ID == ID);
            if (_query.PID != null)
            {
                if (_query.PageAddres != null)
                {
                    var Parent = Context.ApplicationPages.FirstOrDefault(a => a.ID == _query.PID);
                    _test.result += "<tr><td>";
                    _test.result += "<div id=\"" + _query.PageAddres + "\" class=\"tt\" data-tt-id=\"Parent" + _query.ID + "\" data-tt-parent=\"Parent" + Parent.ID + "\" style=\"width: 270px; background-color:" + _query.Color + "  !important; min-height: 40px;padding: 5px !important;color: black !important;cursor: pointer;width: 270px;right: 0 !important;\" onclick=\"fnOpenForms(this)\">";
                    _test.result += "<p class=\"subject\">" + _query.PageName + " </p></div></td></tr>";
                    _test.Type = 0;
                }
                else
                {
                    var Parent = Context.ApplicationPages.FirstOrDefault(a => a.ID == _query.PID);
                    _test.result += "<tr><td>";
                    _test.result += "<div id=\"" + _query.PageAddres + "\" class=\"tt\" data-tt-id=\"Parent" + _query.ID + "\" data-tt-parent=\"Parent" + Parent.ID + "\" style=\"width: 270px; background-color:" + _query.Color + "  !important; min-height: 40px;padding: 5px !important;color: black !important;cursor: cell;width: 270px;right: 0 !important;\" >";
                    _test.result += "<img id='ParentImg" + _query.ID + "' src='../../Images/Tr.png' width='10' style='float: left;margin-top: 20px;' /><p class=\"subject\">" + _query.PageName + " </p></div></td></tr>";
                    _test.Type = 0;
                }

            }
            else
            {

                _test.result += "<tr><td>";
                _test.result += "<div id=\"" + _query.PageAddres + "\" class=\"tt\" data-tt-id=\"Parent" + _query.ID + "\" data-tt-parent=\"\" style=\"width: 270px; background-color:" + _query.Color + "  !important; min-height: 40px;padding: 5px !important;color: black !important;width: 270px;cursor: cell;right: 0 !important;\" >";
                _test.result += "<img id='ParentImg" + _query.ID + "' src='../../Images/Tr.png' width='10' style='float: left;margin-top: 20px;' /><p class=\"subject\">" + _query.PageName + " </p></div></td></tr>";
                _test.Type = 1;

            }


            return _test;
        }
        public ActionResult TreeMenu(int MenuID = 0)
        {
            var membershipID = Security.GetMembereID();
            var RoleID = Context.MemberShips.FirstOrDefault(a => a.ID == membershipID).RoleID;
            if (RoleID != null)
            {
                List<Int32> MenuIdList = new List<Int32>();
                List<int?> PageIdList = new List<int?>();
                PageIdList = Context.ApplicationPages.Where(a => a.PID == null && a.MenuID == MenuID).Select(a =>(int?) a.ID).ToList();

                var str = "";               
                var _Roles = Context.MemberResponsibilities.Where(a => a.MemberShipID == membershipID && a.IsDelete == false).Select(a => a.RoleID).ToList();
                _Roles.Add(RoleID);
                
                var MenuList = Context.Authorizations.Where(a =>  _Roles.Contains(a.RoleID) && a.Type =="2" && PageIdList.Contains(a.AccessTo))
                                                         .Select(a => a.AccessTo).Distinct().ToList();
                 
                List<ApplicationPage> _query = new List<ApplicationPage>();

 

                foreach (var item in MenuList)
                {
                    var _str = "";
                    var tsr = "<table class=\"table-bordered\" style=\"margin:0px !important\">";
                    List<int?> _Flist = new List<int?>();
                    List<int?> _Plist = new List<int?>();
                    _Plist = Context.ApplicationPages.Where(a => a.PID == item).Select(a=>(int?)a.ID).ToList();
                    var _PList = Context.Authorizations.Where(a => _Roles.Contains(a.RoleID) && _Plist.Contains(a.AccessTo))
                                                              .Select(a => a.AccessTo).Distinct().ToList();

                    if (_PList.Count != 0)

                        _Flist.Add((int?)item);
                    _Flist.AddRange(_PList);
                    foreach (var PageID in _Flist)
                    {


                        Test _test = new Test();
                        _test = CreateMenuTest(PageID);
                        _str = _str + _test.result;


                    }
                    _str = tsr + _str + "</table>";

                    str = str + _str;



                }
                return Json(str, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(0);
            }
        }

        #endregion Menu
    }
}
