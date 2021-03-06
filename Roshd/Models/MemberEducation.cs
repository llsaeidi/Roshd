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
    
    public partial class MemberEducation
    {
        public int ID { get; set; }
        public Nullable<int> MemberShipID { get; set; }
        public Nullable<int> EducationalFieldID { get; set; }
        public Nullable<int> EducationalCrossSectionID { get; set; }
        public Nullable<bool> CanDelete { get; set; }
        public string UniversityName { get; set; }
        public Nullable<int> CountyID { get; set; }
        public Nullable<double> FinalScore { get; set; }
        public byte[] FileContent { get; set; }
        public Nullable<int> ExtensionID { get; set; }
        public Nullable<bool> IsDelete { get; set; }
        public Nullable<int> MemberID { get; set; }
    
        public virtual County County { get; set; }
        public virtual EducationalCrossSection EducationalCrossSection { get; set; }
        public virtual EducationalField EducationalField { get; set; }
        public virtual FileExtension FileExtension { get; set; }
        public virtual MemberShip MemberShip { get; set; }
    }
}
