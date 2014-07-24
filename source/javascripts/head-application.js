//= require platform
//= require vendor/modernizr/modernizr.min.js
// Redirect if IE 8
var v=-1;if("Microsoft Internet Explorer"==navigator.appName){var r=/MSIE ([0-9]{1,}[.0-9]{0,})/;null!=r.exec(navigator.userAgent)&&(v=parseFloat(RegExp.$1))}-1<v&&8>=v&&(window.location.href="ie8.html");