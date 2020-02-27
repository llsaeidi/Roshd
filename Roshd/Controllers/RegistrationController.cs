using fsf.Security;
using Roshd.Classes;
using Roshd.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Roshd.Controllers
{
    [Authorize]
    public class RegistrationController : Controller
    {
        RoshdEntities Context = new RoshdEntities();
        //
        // GET: /Registration/

        #region Registration

        [AllowAnonymous]
        public ActionResult Signup()
        {
            var Organizations = Context.Organizations.Where(a => a.IsDelete == false).Select(a => new { a.ID, a.Title }).Distinct().OrderBy(a => a.ID);  //Get Organization List
            ViewBag.Organizations = new SelectList(Organizations, "ID ", "Title");
            return View();
        }

        #region عملیات کد ملی
        [AllowAnonymous]
        public ActionResult txtNationalCoderepeat(string NationalCode1 = "")
        {
            var NotAllowRepeatForNationalCode = Context.MemberShips.Where(x => x.NationalCode == NationalCode1).ToList();
            if (NationalCode1.Length == 10)
            {
                if (NationalCode1 == "1111111111" ||
                    NationalCode1 == "0000000000" ||
                    NationalCode1 == "2222222222" ||
                    NationalCode1 == "3333333333" ||
                    NationalCode1 == "4444444444" ||
                    NationalCode1 == "5555555555" ||
                    NationalCode1 == "6666666666" ||
                    NationalCode1 == "7777777777" ||
                    NationalCode1 == "8888888888" ||
                    NationalCode1 == "9999999999" ||
                    NationalCode1 == "0123456789"
                    )
                {
                    //Response.Write("كد ملي صحيح نمي باشد");          
                    return Json("NotCorrect");
                }

                int c = Convert.ToInt16(NationalCode1.Substring(9, 1));

                int n = Convert.ToInt16(NationalCode1.Substring(0, 1)) * 10 +
                     Convert.ToInt16(NationalCode1.Substring(1, 1)) * 9 +
                     Convert.ToInt16(NationalCode1.Substring(2, 1)) * 8 +
                     Convert.ToInt16(NationalCode1.Substring(3, 1)) * 7 +
                     Convert.ToInt16(NationalCode1.Substring(4, 1)) * 6 +
                     Convert.ToInt16(NationalCode1.Substring(5, 1)) * 5 +
                     Convert.ToInt16(NationalCode1.Substring(6, 1)) * 4 +
                     Convert.ToInt16(NationalCode1.Substring(7, 1)) * 3 +
                     Convert.ToInt16(NationalCode1.Substring(8, 1)) * 2;
                int r = n - (n / 11) * 11;
                if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r))
                {
                    //Response.Write(" کد ملی صحیح است");                
                    //return Json("IsCorrect");
                    if (NotAllowRepeatForNationalCode != null)
                    {
                        var _Member = Context.MemberShips.FirstOrDefault(a => a.NationalCode == NationalCode1 && a.SubmitDate != null);
                        if (_Member != null)
                        {
                            return Json("RepeatNationalCode");
                        }
                        else
                        {
                            var _Users = Context.MemberShips.FirstOrDefault(a => a.NationalCode == NationalCode1);
                            if (_Users != null)
                            {
                                return Json("Edit");
                            }
                        }

                    }
                }
                else
                {
                    //Response.Write("كد ملي صحيح نمي باشد");         
                    return Json("NotCorrect");
                }
            }
            else
            {
                //Response.Write("طول کد ملی وارد شده باید 10 کاراکتر باشد");           
                return Json("TenDigits");
            }

            return Json(true);
        }
        #endregion عملیات کد ملی

        [AllowAnonymous]
        public ActionResult GetDataForm(string NationalCode1 = "")
        {
            var _List = Context.MemberShips.FirstOrDefault(a => a.NationalCode == NationalCode1);
            
            if (_List == null)
            {
                return Json(0);
            }
            else
            {
                var jsonData = new
                {
                    //txtname = _List.FirstName,
                    //txtfamily = _List.LastName,
                    //dateBirth = _List.DateOfBirth == null ? "" : PersianDate.ToPersian((DateTime)_List.DateOfBirth),
                    txtNationalCode = _List.NationalCode,
                    txtMobileNumber = _List.MobileNumber,

                    //province = _List.ProvinceID,
                    //txtPhoneNumber = _List.PhoneNumber,
                    //txtEmail = _List.Email,
                    //txtPostalCode = _List.PostalCode,
                    //txtAddress = _List.Address

                };
                return Json(jsonData);
            }
        }

        [AllowAnonymous]
        public ActionResult Save(string NationalCode = "", string MobileNumber = "", int OrganizationIDSabt = 0, string txtname = "", string txtfamily = "", string chkMss = "", string dateBirth = "", 
                                        string txtPhoneNumber = "", string txtEmail = "", string txtAddress = "")
        {
            try
            {
                var UserID = 0;
                MemberShip QueryUser = new MemberShip();
                MemberShip _List = new MemberShip();
                
                var NationalCodeRepet = Context.MemberShips.FirstOrDefault(a => a.NationalCode == NationalCode);
                if (NationalCodeRepet != null)
                {
                    UserID = Context.MemberShips.FirstOrDefault(a => a.NationalCode == NationalCode).ID;
                }
                
                var gender = Convert.ToBoolean(chkMss);
                if (gender == false)
                {
                    chkMss = "1";//مرد
                }
                if (gender == true)
                {
                    chkMss = "2";//زن
                }
                if (NationalCodeRepet != null)
                {
                    _List = Context.MemberShips.FirstOrDefault(a => a.NationalCode == NationalCode);
                    _List.FirstName = txtname;
                    
                    _List.LastName = txtfamily;
                    _List.OrganizationID = OrganizationIDSabt;
                    _List.BirthOfDate = dateBirth == "" ? null : (DateTime?)PersianDate.ToMiladi(dateBirth);
                    _List.NationalCode = NationalCode;
                    _List.MobileNumber = MobileNumber;
                    _List.PhoneNumber = txtPhoneNumber;
                    _List.Email = txtEmail;   
                    
                    _List.Address = txtAddress;
                    
                    _List.IsDelete = false;
                    _List.CreateDate = DateTime.Now;
                    Context.SaveChanges();
                }
                //General Form
                if (NationalCodeRepet == null)
                {
                    if (NationalCodeRepet == null)
                    {
                        QueryUser = Context.MemberShips.Add(new MemberShip()
                        {

                            OrganizationID = OrganizationIDSabt,
                            FirstName = txtname,
                            
                            LastName = txtfamily,
                            Gender = chkMss,
                            BirthOfDate = dateBirth == "" ? null : (DateTime?)PersianDate.ToMiladi(dateBirth),
                            NationalCode = NationalCode,
                            MobileNumber = MobileNumber,
                            PhoneNumber = txtPhoneNumber,
                            Email = txtEmail,
                            
                            Address = txtAddress,
                            
                            IsDelete = false,
                        });
                        Context.SaveChanges();
                    }
                    


                    var data = new
                    {
                        UserID = QueryUser.ID == 0 ? UserID : QueryUser.ID,
                        
                    };
                    return Json(data);
                }
                var _data = new
                {
                    UserID = _List.ID == 0 ? UserID : _List.ID,
                    
                };
                return Json(_data);
            }
            catch (DbEntityValidationException ex)
            {

                // Retrieve the error messages as a list of strings.
                var errorMessages = ex.EntityValidationErrors
                        .SelectMany(x => x.ValidationErrors)
                        .Select(x => x.ErrorMessage);

                // Join the list to a single string.
                var fullErrorMessage = string.Join("; ", errorMessages);

                // Combine the original exception message with the new one.
                var exceptionMessage = string.Concat(ex.Message, " The validation errors are: ", fullErrorMessage);

                // Throw a new DbEntityValidationException with the improved exception message.
                throw new DbEntityValidationException(exceptionMessage, ex.EntityValidationErrors);

            }
        }

        #region اضافه کردن  عکس پروفایل 
        [AllowAnonymous]
        public ActionResult AddImage(int ID = 0)
        {
            var model = Context.MemberShips.FirstOrDefault(a => a.ID == ID);
            try
            {
                var ImgEPro = Request.Files["UpImgGeneralPic"];
                if (ImgEPro != null)
                {
                    if (ImgEPro.ContentLength > 102400)
                    {
                        return Json("DataError");
                    }
                    model.ProfilePic = new byte[ImgEPro.ContentLength];
                    ImgEPro.InputStream.Read(model.ProfilePic, 0, model.ProfilePic.Length);
                }

                Context.SaveChanges();
                return Json(true);
            }
            catch (Exception)
            {

                return Json(false);
            }
        }
        #endregion اضافه کردن عکس  پروفایل 

        [AllowAnonymous]
        public ActionResult SavePassword(string NationalCode ="", string txtPassword = "")
        {
            try
            {
                var HashPass = Cryptography.Encrypt(txtPassword);
                var QueryMembership = Context.MemberShips.FirstOrDefault(a => a.NationalCode == NationalCode);
                if (QueryMembership != null)
                {

                    QueryMembership.RoleID = 2;

                    QueryMembership.UserName = QueryMembership.NationalCode;
                    QueryMembership.Password = HashPass;

                    QueryMembership.FailedPasswordCount = 0;
                    QueryMembership.IsDelete = false;
                    QueryMembership.SubmitDate = DateTime.Now;
                    

                    Context.SaveChanges();
                }
                else
                {
                    return Json("خطا!!");
                }
                return Json(true);
            }
            catch (Exception)
            {
                return Json(false);
                throw;
            }

        }

        #endregion Registration
    }
}