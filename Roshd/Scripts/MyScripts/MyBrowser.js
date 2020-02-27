myBrowser();
function myBrowser() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        ExistSystem();
    }
    else if (navigator.userAgent.indexOf("Chrome") != -1) {
    }
    else if (navigator.userAgent.indexOf("Safari") != -1) {
        ExistSystem();
    }
    else if (navigator.userAgent.indexOf("Firefox") != -1) {
        ExistSystem();
    }
    else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
    {
        ExistSystem();
    }
}

function ExistSystem() {
    alert("لطفا از مرورگر کروم استفاده کنید");
    //$("#LoginForm").hide();
    //$("#Error").show();

}