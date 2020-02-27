; (function ($) {
    /**
     * jqGrid English Translation
     * Tony Tomov tony@trirand.com
     * http://trirand.com/blog/ 
     * Dual licensed under the MIT and GPL licenses:
     * http://www.opensource.org/licenses/mit-license.php
     * http://www.gnu.org/licenses/gpl.html
    **/
    $.jgrid = {
        defaults: {
            recordtext: "View  {0} - {1} of {2}",
            emptyrecords: "رکوردی برای نمایش وجود ندارد",
            loadtext: "در حال بارگذاری اطلاعات ....",
            pgtext: "صفحه {0} از {1}"
        },
        search: {
            caption: "جستجو...",
            Find: "جستجو",
            Reset: "بازگشت",
            odata: ['برابر', 'نابرابر', 'کمتر', 'کمتر مساوی', 'بزرگتر', 'بزرگتر مساوی', 'شروع شود با', 'does not begin with', 'is in', 'is not in', 'ends with', 'does not end with', 'شامل', 'does not contain'],
            groupOps: [{ op: "AND", text: "all" }, { op: "OR", text: "any" }],
            matchText: " match",
            rulesText: " rules"
        },
        edit: {
            addCaption: "اطلاعات جدید",
            editCaption: "ویرایش اطلاعات",
            bSubmit: "ذخیره",
            bCancel: "انصراف",
            bClose: "Close",
            saveData: "اطلاعات تغییر پیدا کرده ! از ذخیره اطمینان دارید?",
            bYes: "بله",
            bNo: "خیر",
            bExit: "انصراف",
            msg: {
                required: "فیلد اجباری است",
                number: "Please, enter valid number",
                minValue: "value must be greater than or equal to ",
                maxValue: "value must be less than or equal to",
                email: "is not a valid e-mail",
                integer: "Please, enter valid integer value",
                date: "Please, enter valid date value",
                url: "is not a valid URL. Prefix required ('http://' or 'https://')",
                nodefined: " is not defined!",
                novalue: " return value is required!",
                customarray: "Custom function should return array!",
                customfcheck: "Custom function should be present in case of custom checking!"

            }
        },
        view: {
            caption: "View Record",
            bClose: "Close"
        },
        del: {
            caption: "حذف اطلاعات",
            msg: "آیا از حذف اطلاعات اطمینان دارید ؟",
            bSubmit: "حذف",
            bCancel: "انصراف"
        },
        nav: {
            edittext: "",
            edittitle: "ویرایش اطلاعات انتخابی",
            addtext: "",
            addtitle: "اضافه",
            deltext: "",
            deltitle: "حذف اطلاعات انتخابی",
            searchtext: "",
            searchtitle: "جستجو",
            refreshtext: "",
            refreshtitle: "بارگذاری مجدد",
            alertcap: "اخطار",
            alerttext: "اطلاعاتی انتخاب نشده است",
            viewtext: "",
            viewtitle: "View selected row"
        },
        col: {
            caption: "Select columns",
            bSubmit: "Ok",
            bCancel: "Cancel"
        },
        errors: {
            errcap: "Error",
            nourl: "No url is set",
            norecords: "No records to process",
            model: "Length of colNames <> colModel!"
        },
        formatter: {
            integer: { thousandsSeparator: " ", defaultValue: '0' },
            number: { decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 2, defaultValue: '0.00' },
            currency: { decimalSeparator: ".", thousandsSeparator: " ", decimalPlaces: 2, prefix: "", suffix: "", defaultValue: '0.00' },
            date: {
                dayNames: [
                    "يک", "دو", "سه", "چهار", "پنج", "جمع", "شنب",
                    "يکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"
                ],
                monthNames: [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                    "ژانويه", "فوريه", "مارس", "آوريل", "مه", "ژوئن", "ژوئيه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "December"
                ],
                AmPm: ["ب.ظ", "ب.ظ", "ق.ظ", "ق.ظ"],
                S: function (j) { return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th' },
                srcformat: 'Y-m-d',
                newformat: 'd/m/Y',
                masks: {
                    ISO8601Long: "Y-m-d H:i:s",
                    ISO8601Short: "Y-m-d",
                    ShortDate: "n/j/Y",
                    LongDate: "l, F d, Y",
                    FullDateTime: "l, F d, Y g:i:s A",
                    MonthDay: "F d",
                    ShortTime: "g:i A",
                    LongTime: "g:i:s A",
                    SortableDateTime: "Y-m-d\\TH:i:s",
                    UniversalSortableDateTime: "Y-m-d H:i:sO",
                    YearMonth: "F, Y"
                },
                reformatAfterEdit: false
            },
            baseLinkUrl: '',
            showAction: '',
            target: '',
            checkbox: { disabled: true },
            idName: 'id'
        }
    };
})(jQuery);
