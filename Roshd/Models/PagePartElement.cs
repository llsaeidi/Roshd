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
    
    public partial class PagePartElement
    {
        public int ID { get; set; }
        public Nullable<int> PagePatrID { get; set; }
        public string Title { get; set; }
        public string ClassName { get; set; }
        public string Type { get; set; }
        public string FullMethod { get; set; }
        public Nullable<int> OperationButtonID { get; set; }
    
        public virtual PagePatr PagePatr { get; set; }
    }
}
