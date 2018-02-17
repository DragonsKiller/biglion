(function () {
    function gc(name){var matches=document.cookie.match(new RegExp("(?:^|; )"+name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return matches?decodeURIComponent(matches[1]):false};
    function sc(name,value){var date=new Date((new Date).getTime()+2592E6);value=encodeURIComponent(value);document.cookie=name+"="+value+";path=/; domain=.am15.net; expires="+date.toUTCString()};
    function ls(){try{window.localStorage.setItem("ls","ls");window.localStorage.removeItem("ls")}catch(e){return false}return true};
    function rm(element_id){var element=document.getElementById(element_id);element&&element.parentNode&&element.parentNode.removeChild(element)};
    function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min};

    var uid = "";
    var iframe_id = "advmrt";
    if(ls()){uid=localStorage.getItem("uid");if(uid===null || !uid.match(/^(CID_)?[a-f0-9]{32}$|^(CID_)?[a-z0-9]{7}$/i)){var cuid=gc("uid");if(cuid)localStorage.setItem("uid",cuid);uid=cuid}else sc("uid",uid)};
    uid = uid === null || uid === '' || uid === false ? '' : '&uid=' + encodeURIComponent(uid);

    if (window.advm_ret[0].code && window.advm_product.id) {
        var amu = document.createElement("iframe");
        amu.setAttribute("id",iframe_id);amu.width=0;amu.height=0;amu.frameborder=0;amu.marginwidth=0;amu.marginheight=0;amu.scrolling="no";
        amu.src = "//rt.am15.net/retag/push_v2.php?code=" + encodeURIComponent(window.advm_ret[0].code) + "&offer=" + encodeURIComponent(window.advm_product.id) + uid + "&rand=" + rand(0,20000000);
        document.body.appendChild(amu);
        amu.onload = function () {
            setTimeout(rm(iframe_id), 100);
        };
    }
})();