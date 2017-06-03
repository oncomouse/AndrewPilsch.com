/*!
 * modernizr v3.5.0
 * Build https://modernizr.com/download?-csstransforms3d-csstransitions-setclasses-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */
!function(e,t,n){function r(e,t){return typeof e===t}function s(){var e,t,n,s,o,i,a;for(var l in C)if(C.hasOwnProperty(l)){if(e=[],t=C[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(s=r(t.fn,"function")?t.fn():t.fn,o=0;o<e.length;o++)i=e[o],a=i.split("."),1===a.length?w[a[0]]=s:(!w[a[0]]||w[a[0]]instanceof Boolean||(w[a[0]]=new Boolean(w[a[0]])),w[a[0]][a[1]]=s),x.push((s?"":"no-")+a.join("-"))}}function o(e){var t=b.className,n=w._config.classPrefix||"";if(_&&(t=t.baseVal),w._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}w._config.enableClasses&&(t+=" "+n+e.join(" "+n),_?b.className.baseVal=t:b.className=t)}function i(e,t){return!!~(""+e).indexOf(t)}function a(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):_?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function l(){var e=t.body;return e||(e=a(_?"svg":"body"),e.fake=!0),e}function f(e,n,r,s){var o,i,f,u,p="modernizr",d=a("div"),c=l();if(parseInt(r,10))for(;r--;)f=a("div"),f.id=s?s[r]:p+(r+1),d.appendChild(f);return o=a("style"),o.type="text/css",o.id="s"+p,(c.fake?c:d).appendChild(o),c.appendChild(d),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(t.createTextNode(e)),d.id=p,c.fake&&(c.style.background="",c.style.overflow="hidden",u=b.style.overflow,b.style.overflow="hidden",b.appendChild(c)),i=n(d,e),c.fake?(c.parentNode.removeChild(c),b.style.overflow=u,b.offsetHeight):d.parentNode.removeChild(d),!!i}function u(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function p(t,n,r){var s;if("getComputedStyle"in e){s=getComputedStyle.call(e,t,n);var o=e.console;if(null!==s)r&&(s=s.getPropertyValue(r));else if(o){var i=o.error?"error":"log";o[i].call(o,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else s=!n&&t.currentStyle&&t.currentStyle[r];return s}function d(t,r){var s=t.length;if("CSS"in e&&"supports"in e.CSS){for(;s--;)if(e.CSS.supports(u(t[s]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var o=[];s--;)o.push("("+u(t[s])+":"+r+")");return o=o.join(" or "),f("@supports ("+o+") { #modernizr { position: absolute; } }",function(e){return"absolute"==p(e,null,"position")})}return n}function c(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function m(e,t,s,o){function l(){u&&(delete E.style,delete E.modElem)}if(o=!r(o,"undefined")&&o,!r(s,"undefined")){var f=d(e,s);if(!r(f,"undefined"))return f}for(var u,p,m,h,v,y=["modernizr","tspan","samp"];!E.style&&y.length;)u=!0,E.modElem=a(y.shift()),E.style=E.modElem.style;for(m=e.length,p=0;p<m;p++)if(h=e[p],v=E.style[h],i(h,"-")&&(h=c(h)),E.style[h]!==n){if(o||r(s,"undefined"))return l(),"pfx"!=t||h;try{E.style[h]=s}catch(e){}if(E.style[h]!=v)return l(),"pfx"!=t||h}return l(),!1}function h(e,t){return function(){return e.apply(t,arguments)}}function v(e,t,n){var s;for(var o in e)if(e[o]in t)return!1===n?e[o]:(s=t[e[o]],r(s,"function")?h(s,n||t):s);return!1}function y(e,t,n,s,o){var i=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+z.join(i+" ")+i).split(" ");return r(t,"string")||r(t,"undefined")?m(a,t,s,o):(a=(e+" "+k.join(i+" ")+i).split(" "),v(a,t,n))}function g(e,t,r){return y(e,n,n,t,r)}var C=[],S={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){C.push({name:e,fn:t,options:n})},addAsyncTest:function(e){C.push({name:null,fn:e})}},w=function(){};w.prototype=S,w=new w;var x=[],b=t.documentElement,_="svg"===b.nodeName.toLowerCase(),P="Moz O ms Webkit",z=S._config.usePrefixes?P.split(" "):[];S._cssomPrefixes=z;var T={elem:a("modernizr")};w._q.push(function(){delete T.elem});var E={style:T.elem.style};w._q.unshift(function(){delete E.style});var k=S._config.usePrefixes?P.toLowerCase().split(" "):[];S._domPrefixes=k,S.testAllProps=y,S.testAllProps=g;var N=S.testStyles=f,j="CSS"in e&&"supports"in e.CSS,A="supportsCSS"in e;w.addTest("supports",j||A),/*!
{
  "name": "CSS Transforms 3D",
  "property": "csstransforms3d",
  "caniuse": "transforms3d",
  "tags": ["css"],
  "warnings": [
    "Chrome may occassionally fail this test on some systems; more info: https://code.google.com/p/chromium/issues/detail?id=129004"
  ]
}
!*/
w.addTest("csstransforms3d",function(){var e=!!g("perspective","1px",!0),t=w._config.usePrefixes;if(e&&(!t||"webkitPerspective"in b.style)){var n;w.supports?n="@supports (perspective: 1px)":(n="@media (transform-3d)",t&&(n+=",(-webkit-transform-3d)")),n+="{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}",N("#modernizr{width:0;height:0}"+n,function(t){e=7===t.offsetWidth&&18===t.offsetHeight})}return e}),/*!
{
  "name": "CSS Transitions",
  "property": "csstransitions",
  "caniuse": "css-transitions",
  "tags": ["css"]
}
!*/
w.addTest("csstransitions",g("transition","all",!0)),s(),o(x),delete S.addTest,delete S.addAsyncTest;for(var q=0;q<w._q.length;q++)w._q[q]();e.Modernizr=w}(window,document);