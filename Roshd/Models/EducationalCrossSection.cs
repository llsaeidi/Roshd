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
    
    public partial class EducationalCrossSection
    {
        public EducationalCrossSection()
        {
            this.MemberEducations = new HashSet<MemberEducation>();
            this.Theses = new HashSet<Thesis>();
        }
    
        public int ID { get; set; }
        public string Title { get; set; }
        public Nullable<int> Score { get; set; }
        public Nullable<bool> IsDelete { get; set; }
        public Nullable<int> MemberID { get; set; }
    
        public virtual ICollection<MemberEducation> MemberEducations { get; set; }
        public virtual ICollection<Thesis> Theses { get; set; }
    }
}
