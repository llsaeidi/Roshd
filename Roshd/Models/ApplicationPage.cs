//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Roshd.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class ApplicationPage
    {
        public ApplicationPage()
        {
            this.PagePatrs = new HashSet<PagePatr>();
        }
    
        public int ID { get; set; }
        public Nullable<int> PID { get; set; }
        public string PageName { get; set; }
        public Nullable<int> MenuID { get; set; }
        public string PageAddres { get; set; }
        public Nullable<byte> SubMenuOrder { get; set; }
        public string Color { get; set; }
    
        public virtual ApplicationMenu ApplicationMenu { get; set; }
        public virtual ICollection<PagePatr> PagePatrs { get; set; }
    }
}
