

//بستن کلیک راست 
//و F12
CanNotClikInDocument();
function CanNotClikInDocument() {
    var AdressUrl = String(String(String(window.location).split('/')[2]).split(":")[0]).trim();

    if (AdressUrl != "localhost") {
        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        $(document).keydown(function (event) {

            if (event.keyCode == 123 || event.which == 123) {
                return false;
            }
            else if (event.ctrlKey && event.shiftKey && (event.keyCode == 73 || event.which == 73)) {

                return false;  //Prevent from ctrl+shift+i
            }
        });

    }

}
//ساختن منوی اصلی 
LoadMenu();
function LoadMenu() {
    $.ajax({
        url: '/Home/LoadMenu',
        async: false,
        type: "post",
        datatype: "json",
        success: function (resp) {
            if (resp != 0) {
                $('#navbar-main').html(resp);
                //SelectedMenu();
            }
            else {
                window.location = "/Home/login";
            }

        }
    });
}
///ساخت منو های هر صفحه
//IDMenu عددی منوی اصلی است که قرار است منوهای آن صفحه را ایجاد کند
function TreeMenu(IDMenu) {
    $.ajax({
        url: '/Home/TreeMenu',
        data: { MenuID: IDMenu },
        type: "post",
        datatype: "json",
        success: function (resp) {
            if (resp !== 0) {
                $('#TreeMenu').html("");
                $('#TreeMenu').html(resp);



            }
            else {
                window.location = "/Home/login";
            }
        }
    });
}



///برای باز شدن صفحات
function fnOpenForms(e) {

    $("#ShowForm").html("");
    $("#LoadShowForm").show();
    var GetFormId = $(e).attr('id');
    $.ajax({
        url: GetFormId,
        cache: false,
        async: true,
        type: 'Post',
        success: function (msg) {
            $("#ShowForm").html(msg);
            $("#LoadShowForm").hide();
            FuncOnAuthorizationClient(GetFormId);
        }
    });

}



///چک کردن دسترسی به اجزای صفحه
function FuncOnAuthorizationClient(StrUrl) {
    $.ajax({
        url: "/Home/FuncOnAuthorizationClient",
        data: { Url: StrUrl },
        type: "post",
        datatype: "json",
        success: function (data) {
            var QueryShowHide = data.QueryShowHide;




            for (var i = 0; i < QueryShowHide.length; i++) {
                var ValueType = QueryShowHide[i].Type;
                var ValueHideShow = QueryShowHide[i].HideShow;
                if (ValueType == 1) {
                    if (ValueHideShow == true) {
                        $(QueryShowHide[i].PartDivID).find("." + QueryShowHide[i].ClassName).show();
                    }
                    else {
                        $(QueryShowHide[i].PartDivID).find("." + QueryShowHide[i].ClassName).hide();
                    }

                }
                if (ValueType == 2) {
                    if (ValueHideShow == true) {
                        $(QueryShowHide[i].PartDivID).find("." + QueryShowHide[i].ClassName).prop('disabled', false);//نمایش
                        $(QueryShowHide[i].PartDivID).find("." + QueryShowHide[i].ClassName).css('opacity', 1);//نمایش                           
                    }
                    else {
                        $(QueryShowHide[i].PartDivID).find("." + QueryShowHide[i].ClassName).prop('disabled', true);//غیر نمایش
                        $(QueryShowHide[i].PartDivID).find("." + QueryShowHide[i].ClassName).css('opacity', 0.5);//غیر نمایش
                    }
                }

            }

        }

    });
}


