using Roshd.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Roshd.Classes
{
    public class PermitActionSecuirty
    {
        //ok
        public bool OnAuthorizationServer(string ControllerName, string ActionName, string TableName, int OperationButtonID)
        {
            try
            {
                bool Result = false;
                using (RoshdEntities Context = new RoshdEntities())
                {
                    int MemberShipID = Convert.ToInt32(HttpContext.Current.User.Identity.Name);

                    List<int> LstRoles = LstRolesByMemberShip(MemberShipID).Select(x => x.ID).ToList();
                    string FullAction = "../../" + ControllerName + "/" + ActionName;

                  
                    var QueryMemberships = Context.MemberShips.FirstOrDefault(x => x.ID == MemberShipID && x.IsDelete == false);
                    if (QueryMemberships != null)
                    {
                        int RoleID = Convert.ToInt32(QueryMemberships.RoleID);

                        if (RoleID == 1)
                        {
                            return true;//مدیر سیستم باشد
                        }

                        var QueryApplicationPages = Context.ApplicationPages.FirstOrDefault(x => x.PageName == FullAction);
                        if (QueryApplicationPages != null)
                        {
                            int ApplicationPageID = QueryApplicationPages.ID;
                            var QueryPageAuthorizations = Context.Authorizations .FirstOrDefault(x =>x.Type == "2" && x.AccessTo == ApplicationPageID && LstRoles.Contains((int) x.RoleID));
                            Result = QueryPageAuthorizations == null ? false : true;
                        }
                        else
                        {
                            var QueryPagePartElements = Context.PagePartElements.FirstOrDefault(x =>  x.FullMethod == FullAction && x.OperationButtonID == OperationButtonID);
                            if (QueryPagePartElements != null)
                            {
                                int ApplicationPageID = Convert.ToInt32(QueryPagePartElements.PagePatr.ApplicationPageID);
                                int PagePartID = Convert.ToInt32(QueryPagePartElements.PagePatrID);
                                int PagePartElementID = QueryPagePartElements.ID;
                                var QueryPagePartElementAuthorizations = Context.Authorizations.FirstOrDefault(x =>x.Type == "4" &&  LstRoles.Contains((int)x.RoleID));
                                Result = QueryPagePartElementAuthorizations == null ? false : true;

                            }
                            else
                            {
                                Result = false;
                            }


                        }

                    }

                }

                return Result;

            }
            catch
            {
                return false;
            }


        }  //برای دسترسی به قسمت های مختلف یک صفحه از جمله ذخیره یا حذف 



        //ok
        public bool OnAuthorizePageApplication(string ControllerName, string ActionName)
        {
            try
            {
                int MemberShipID = Convert.ToInt32(HttpContext.Current.User.Identity.Name);
                if (MemberShipID != 0)
                {
                    using (RoshdEntities Context = new RoshdEntities())
                    {
                        List<int> LstRoles = LstRolesByMemberShip(MemberShipID).Select(x => x.ID).ToList();
                        var QueryMemberships = Context.MemberShips.FirstOrDefault(x => x.IsDelete == false && x.ID == MemberShipID);
                        if (QueryMemberships != null)
                        {
                            int RoleID = Convert.ToInt32(QueryMemberships.RoleID);
                            if (RoleID == 1)
                            {
                                return true;
                            }

                            string FullAction = "../../" + ControllerName + "/" + ActionName;
                            var QueryApplicationPages = Context.ApplicationPages.FirstOrDefault(x => x.PageName == FullAction);
                            if (QueryApplicationPages != null)
                            {
                                int ApplicationPagesID = QueryApplicationPages.ID;
                                var QueryPageAuthorizations = Context.Authorizations.FirstOrDefault(x =>x.Type == "1" && LstRoles.Contains((int)x.RoleID) );
                                if (QueryPageAuthorizations != null)
                                {
                                    return true;
                                }
                                else
                                {
                                    return false;
                                }
                            }
                        }
                    }
                }
                return false;
            }
            catch
            {
                return false;
            }
        } //برای دسترسی به خود صفحه


        public List<HideShowElement> LstHideShow(int ApplicationPageID, List<int> LstRoleID = null)
        {
            using (RoshdEntities Context = new RoshdEntities())
            {
                List<HideShowElement> Lst = new List<HideShowElement>();
                List<Authorization> LstPagePartElementAuthorizations = Context.Authorizations.Where(x => x.Type == "4" && LstRoleID.Contains((int)x.RoleID)).ToList();
                List<PagePatr> LstPagePatrs = Context.PagePatrs.Where(x => x.ApplicationPageID == ApplicationPageID).ToList();
                foreach (var item in LstPagePatrs)
                {
                    List<PagePartElement> LstPagePartElements = item.PagePartElements.ToList();

                    foreach (var item1 in LstPagePartElements)
                    {
                        Lst.Add(new HideShowElement()
                        {
                            ID = item.ID,
                            PartDivID = item.PartDivID,
                            ClassName = item1.ClassName,
                            Type = item1.Type,
                            //عدد یک در پایین نشانه نقش مدیر سیستم می باشد
                            HideShow = LstRoleID.Contains(1) ? true : LstPagePartElementAuthorizations.Any(x =>x.AccessTo == item1.ID)
                        });
                    }

                }

                return Lst;
            }
        }
        public class HideShowElement
        {
            public int ID { get; set; }
            public string PartDivID { get; set; }
            public string ClassName { get; set; }
            public string Type { get; set; }
            public bool HideShow { get; set; }
        }

        public List<HideShowElement> OnAuthorizationClient(string ControllerName, string ActionName)
        {
            try
            {
                using (RoshdEntities Context = new RoshdEntities())
                {
                    List<HideShowElement> LstElement = new List<HideShowElement>();
                    int MemberShipID = Convert.ToInt32(HttpContext.Current.User.Identity.Name);
                    string FullAction = "../../" + ControllerName + "/" + ActionName;
                    var QueryMemberships = Context.MemberShips.FirstOrDefault(x => x.IsDelete == false && x.ID == MemberShipID);
                    if (QueryMemberships != null)
                    {
                        List<int> LstRoles = LstRolesByMemberShip(MemberShipID).Select(x => x.ID).ToList();
                        var QueryApplicationPages = Context.ApplicationPages.FirstOrDefault(x => x.PageName == FullAction);
                        if (QueryApplicationPages != null)
                        {
                            int ApplicationPageID = QueryApplicationPages.ID;
                            LstElement = LstHideShow(ApplicationPageID, LstRoles);
                        }
                        else
                        {
                            var QueryPagePartElements = Context.PagePartElements.FirstOrDefault(x =>x.FullMethod == FullAction);
                            if (QueryPagePartElements != null)
                            {
                                int ApplicationPageID = Convert.ToInt32(QueryPagePartElements.PagePatr.ApplicationPageID);
                                LstElement = LstHideShow(ApplicationPageID, LstRoles);
                            }
                        }
                    }

                    return LstElement;
                }
            }
            catch
            {
                return null;
            }

        }


        public class ItemIDViewModel
        {
            public int ID { get; set; }
        }
        public List<ItemIDViewModel> LstRolesByMemberShip(int MemberShipID)
        {
            using (RoshdEntities Context = new RoshdEntities())
            {
                List<ItemIDViewModel> Lst = new List<ItemIDViewModel>();
                var QueryMemberships= Context.MemberShips.FirstOrDefault(x=>x.IsDelete==false && x.ID==MemberShipID);
                Lst=Context.MemberResponsibilities.Where(x => x.IsDelete == false && x.MemberShipID == MemberShipID).Select(x => new ItemIDViewModel { ID = (int)x.RoleID }).ToList();
               if(QueryMemberships!=null)
               {
                   Lst.Add(new ItemIDViewModel()
                   {
                       ID = Convert.ToInt32(QueryMemberships.RoleID)
                   });
               }

               return Lst;

            }
        }


    }
}