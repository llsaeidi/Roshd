using System;
using System.Linq;
using Roshd.Models;
using System.Web.Http.ModelBinding;
using System.ComponentModel.DataAnnotations;
using System.Web;
using System.Web.Services.Description;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
 

namespace fsf.Security
{     
    public static class Security
    {
        const int FaieldCountLimitation = 5;
        private static RoshdEntities context = new RoshdEntities();

        public static Int32 GetMembereID()
        {
            int MemberShipID = Convert.ToInt32(HttpContext.Current.User.Identity.Name);
            return MemberShipID;
        }
     
        //public static bool AddSystemUser(int userId, int roleId, string userName, string password, int? questionId, string answer)
        //{
        //    if (userId <= 0)
        //    {
        //        HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(6);              
        //    }
        //    if (roleId <= 0)
        //    {
        //        HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(7);
        //        return false;
        //    }
        //    if ((userName == null) || (userName == ""))
        //    {
        //        HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(8);
        //        return false;
        //    }
        //    if ((password == null) || (password == ""))
        //    {
        //         HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(9);
        //        return false;
        //    }
          
        //    var  member = context.MemberShips.FirstOrDefault(m => m.UserName == userName);
        //    if (member != null)
        //    {
        //        HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(10);
        //        return false;
        //    }
        //    var membership = new MemberShip
        //    {
        //        UserID = userId,
        //        RoleID = roleId,
        //        UserName = userName,
        //        Password = Cryptography.Encrypt(password),
        //        CreateDate = DateTime.Today,                
        //        FailedPasswordCount = 0
        //    };
        //    context.MemberShips.Add(membership);
        //    context.SaveChanges();
        //    return true;
        //}

        //public static bool RemoveSystemUser(int id, MemberShip currentMember)
        //{
        //    var member = context.MemberShips.FirstOrDefault(m => m.ID == id);
        //    if (member == null) return false;
        //    if (member != currentMember)
        //    {
        //        context.MemberShips.Remove(member);
        //        context.SaveChanges();
        //        return true;
        //    }
        //    HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(11);
        //    return false;
        //}

        public static bool ChangePassword(int currentMemberId, string oldPassword, string newPassword)
        {
            var currentMember = context.MemberShips.FirstOrDefault(m => m.ID == currentMemberId);
            if ((newPassword == "") || (newPassword == null))
            {
                HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(12);
                return false;
            }
            if (Cryptography.Decrypt(currentMember.Password) != oldPassword)
            {
                HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(3);
                return false;
            }
            currentMember.Password =  Cryptography.Encrypt(newPassword);
            context.SaveChanges();
            return true;
        }

        public static bool ResetPassword(string userName, string nationalCode)
        {
            var member = context.MemberShips.FirstOrDefault(m => m.UserName == userName && m.NationalCode == nationalCode);
            if (member == null) return false;

            if (member!= null)
                {
                    member.Password = Cryptography.Encrypt("123");
                    member.FailedPasswordCount = 0;
                  
                    context.SaveChanges();
                    HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(13);
                    return true;
                }
                else
                {
                    
                    context.SaveChanges();
                    return false;
                }
            
            return false;
        }

        public static bool AdminResetPassword(int memberId)
        {
            var member = context.MemberShips.FirstOrDefault(m => m.ID == memberId);
            if (member == null) return false;
            member.Password = Cryptography.Encrypt("123");
            member.FailedPasswordCount = 0;
           
            context.SaveChanges();
              HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(15);
            return true;
        }

        public static bool UnlockUser(int memberId)
        {
            try
            {
                var member = context.MemberShips.FirstOrDefault(m => m.ID == memberId);
                if (member == null) return false;
                member.FailedPasswordCount = 0;
               
                context.SaveChanges();
                HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(16);
                return true;
            }
            catch
            { return false; }
        }

        public static MemberShip Login(string userName, string password)
        {

            RoshdEntities context = new RoshdEntities();
            var member = context.MemberShips.FirstOrDefault(m => m.UserName == userName);
            if (member == null)
            {
                 HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(1);
                return null;
            }
            if (member.AdminLockDate != null)
            {
                HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(2);
                return null;
            }
           
          
                if (member.FailedPasswordCount <= FaieldCountLimitation)
                {
                string pass = Cryptography.Decrypt(member.Password);
                if (password != pass)
                {
                    HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(3);
                    member.FailedPasswordCount += 1;
                    context.Configuration.ValidateOnSaveEnabled = false;
                    context.SaveChanges();
                    return null;
                }
                member.FailedPasswordCount = 0;
                  
                    context.Configuration.ValidateOnSaveEnabled = false;
                    context.SaveChanges();
                    return member;
                }


           if (member.Role.RoleLevelID == 1)
                 HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(4);
            else
                HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(5);
             
            return null;
        }

        //public static Authorization Authorization(int roleId, int pageId)
        //{
        //    var authorization = context.Authorizations.FirstOrDefault(a => a.RoleID == roleId && a.AccessTo == pageId);
        //    return authorization;
        //}


        //public static MemberShip LoginRegistration( string nationalCode,string securityCode)
        //{
        //    RoshdEntities context = new RoshdEntities();
        //    var member = context.MemberShips.FirstOrDefault(m => m.NationalCode == nationalCode);
        //    if (member == null)
        //    {
        //        HttpContext.Current.Session["Message"] = ErrorMessage.ErrorMessage.GetMessage(16);
        //        return null;
        //    }
        //    return member;
        //}





    }    
}
