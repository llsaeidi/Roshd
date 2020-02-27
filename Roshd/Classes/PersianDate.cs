using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace Roshd.Classes
{
    public class PersianDate
    {
        /// <summary>
		/// تبديل تاريخ ميلادي به خورشيدي
		/// </summary>
		/// <param name="date">تاريخ ميلادي</param>
		/// <returns></returns>
		public static string ToPersian(DateTime date)
        {
            PersianCalendar pc = new PersianCalendar();
            int y = pc.GetYear(date);
            int m = pc.GetMonth(date);
            int d = pc.GetDayOfMonth(date);
            return string.Format("{0:d4}/{1:d2}/{2:d2}", y, m, d);
        }
        /// <summary>
        /// تبديل تاريخ خورشيدي به ميلادي
        /// </summary>
        /// <param name="date">yyyy/mm/dd تاريخ خورشيدي</param>
        /// <returns></returns>
        public static DateTime ToMiladi(string date)
        {
            PersianCalendar pc = new PersianCalendar();
            int y = Convert.ToInt32(date.Substring(0, 4));
            int m = Convert.ToInt32(date.Substring(5, 2));
            int d = Convert.ToInt32(date.Substring(8, 2));
            pc.ToDateTime(y, m, d, 0, 0, 0, 0);
            return pc.ToDateTime(y, m, d, 0, 0, 0, 0);
        }


        public static string ToPersianYear(DateTime date)
        {
            PersianCalendar pc = new PersianCalendar();
            int y = pc.GetYear(date);
            return string.Format("{0:d4}", y);
        }

        public static string ToMiladiForCheck(string date)//در فرم بانک در صورتی که شخص تاریخ اشتباه بزند این تابع نوشته شده است
        {
            try
            {
                PersianCalendar pc = new PersianCalendar();
                int y = Convert.ToInt32(date.Substring(0, 4));
                int m = Convert.ToInt32(date.Substring(5, 2));
                int d = Convert.ToInt32(date.Substring(8, 2));
                pc.ToDateTime(y, m, d, 0, 0, 0, 0);
                return "1";
            }
            catch (Exception)
            {

                return "0";
            }

        }
    }
}