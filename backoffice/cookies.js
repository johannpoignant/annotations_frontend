function setCookie(cname,cvalue)
{
    //var d = new Date();
    //d.setTime(d.getTime()+(exdays*24*60*60*1000));
    //var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue /*+ "; " + expires*/;
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

function deleteCookie(cname)
{
    document.cookie = cname + getCookie(cname) + ";expires=-1";
}

function clearSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
}
