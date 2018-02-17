var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
var params = 'rt_data=' + encodeURIComponent(JSON.stringify(rt_data));
var domain=location.hostname.split('.').slice(-2).join('.');
xhr.open("POST", (document.location.protocol == "https:" ? "https:" : "http:") + "//rt." + domain + "/rt.js.php", true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send(params);