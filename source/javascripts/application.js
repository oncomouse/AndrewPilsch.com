//=	require platform
//= require ../../vendor/components/labjs/LAB.js
//= require jquery
//= require ../../vendor/components/imagesloaded/imagesloaded.pkgd.min.js
//= require ../../vendor/components/isotope/dist/isotope.pkgd.min.js
//= require plugins.js
//= require_tree ./libraries

if(platform.name == 'IE' && parseInt(platform.version) < 9) { window.location.href='ie8.html'; }