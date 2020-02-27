using fsf.Security;
using Roshd.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;

namespace Roshd.Controllers
{
    public class LookUpController : Controller
    {
        RoshdEntities Context = new RoshdEntities();
        //
        // GET: /LookUp/


        public ActionResult Lookup()
        {
            return View();
        }
        public ActionResult Organizatons()
        {
            return View();
        }

        public ActionResult LoadGrid(string sidx, string sord, int page, int rows,
              bool _search, string searchField, string searchOper, string searchString)
        {
            var query = Context.Organizations.Where(a => a.IsDelete == false).ToList();
            var _List = (query.Cast<Organization>().ToList()).AsQueryable();
            var filteredList = _List;
            if (_search)
            {
                if (searchOper == "cn")
                    filteredList = _List.Where(s =>
                        (typeof(Organization).GetProperty(searchField).GetValue(s, null) == null) ? false :
                            typeof(Organization).GetProperty(searchField).GetValue(s, null)
                            .ToString().Contains(searchString));

                if (searchOper == "eq")
                    filteredList = _List.Where(s =>
                        (typeof(Organization).GetProperty(searchField).GetValue(s, null) == null) ? false :
                            typeof(Organization).GetProperty(searchField).GetValue(s, null)
                            .ToString().Equals(searchString));
            }

            var _sortedList = SortIQueryable<Organization>(filteredList, sidx, sord);

            var totalRecords = filteredList.Count();
            var totalPages = (int)Math.Ceiling((double)totalRecords / (double)rows);
            var _sortedList2 = _sortedList.Cast<Organization>().ToList();
            var data = (from s in _sortedList2
                        select new
                        {
                            id = (int)s.ID,
                            cell = new object[]
                            { s.ID,
                              s.Title,
                             }
                        }).ToArray();

            var jsonData = new
            {
                total = totalPages,
                page = page,
                records = totalRecords,
                rows = data.Skip((page - 1) * rows).Take(rows)
            };
            return Json(jsonData);
        }



        #region Add And Edit Grid
        public ActionResult InsertGridTest(Organization model)
        {    //گرفتن آی دی شخصی که در حال انجام کار میباشد(یک کار کلی هست و ربطی به گرید نداره)
            var membershipID = Security.GetMembereID();

            // چک کردن تکراری بودن
            var qu = Context.Organizations.Where(a => a.Title == model.Title).ToList();
            if (qu.Count == 1)
            {
                return Json(1);//اطلاعات تكراري مي باشد
            }

            model.MemberID = membershipID;
            model.IsDelete = false;

            //ویرایش اطلاعات
            if (model.ID != 0)
                Context.Entry(model).State = System.Data.EntityState.Modified;
            else
                //افزودن اطلاعات
                Context.Organizations.Add(model);
            Context.SaveChanges();
            return Json(true);
        }
        #endregion Add And Edit Grid

        #region Delete Grid
        public ActionResult DeleteGridTest(string PTable, string PField, string PCode)
        {
            var membershipID = Security.GetMembereID();

            var query = Context.spLookupsControlForDelete(PTable, PField, PCode, membershipID.ToString()).ToString();
            // گزینه موردنظر حذف شد
            if (query == "-1")
            {
                return Json("1", JsonRequestBehavior.AllowGet);

            }
            // گزینه مورد نظر قابل حذف نیست  
            else
            {
                return Json("2", JsonRequestBehavior.AllowGet);
            }

        }
        #endregion Delete Grid


        /// <summary>
        /// برای جستجو و مرتب سازی گرید
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="fieldName"></param>
        /// <param name="sortOrder"></param>
        /// <returns></returns>
        public IQueryable<T> SortIQueryable<T>(IQueryable<T> data, string fieldName, string sortOrder)
        {
            if (string.IsNullOrWhiteSpace(fieldName)) return data;
            if (string.IsNullOrWhiteSpace(sortOrder)) return data;

            var param = Expression.Parameter(typeof(T), "i");
            Expression conversion = Expression.Convert(Expression.Property(param, fieldName), typeof(object));
            var mySortExpression = Expression.Lambda<Func<T, object>>(conversion, param);

            return (sortOrder == "desc") ? data.OrderByDescending(mySortExpression) : data.OrderBy(mySortExpression);
        }

        #region تغییر رمز عبور
        public ActionResult ChangePasswordNew()
        {
            return View();
        }
        #endregion تغییر رمز عبور

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
                var membership = Context.MemberShips.FirstOrDefault(x => x.ID == membershipID && x.IsDelete == false);

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
                        Context.Configuration.ValidateOnSaveEnabled = false;
                        Context.SaveChanges();
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
