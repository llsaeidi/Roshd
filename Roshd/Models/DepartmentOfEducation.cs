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
    
    public partial class DepartmentOfEducation
    {
        public DepartmentOfEducation()
        {
            this.EducationalFields = new HashSet<EducationalField>();
        }
    
        public int ID { get; set; }
        public string Title { get; set; }
        public Nullable<bool> IsDelete { get; set; }
        public Nullable<int> MemberID { get; set; }
    
        public virtual ICollection<EducationalField> EducationalFields { get; set; }
    }
}
