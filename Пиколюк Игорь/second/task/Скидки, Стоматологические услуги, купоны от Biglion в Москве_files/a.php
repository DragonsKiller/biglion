window.qt_i_ = {
   gq: function (e) {
        var t = window.location.search;return t = t.match(new RegExp(e + "=([^&=]+)")), t ? t[1] : "";
    },
    inr: function () {
        if (qt_i_.gq("utm_source") != "") {
            (new Image()).src="//xretag.ru/o/biglion/hit.php?u="+encodeURIComponent(location.href);
        }
    if(location.path == "///"){
      (new Image()).src="//xretag.ru/o/biglion/ord.php";
        }
    },
};
window.qt_i_.inr();
   