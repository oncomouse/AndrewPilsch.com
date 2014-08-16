//= require platform
//= require ../../vendor/components/labjs/LAB.js
//= require jquery
//= require eventEmitter
//= require eventie
//= require imagesloaded
//= require vendor/jquery/plugins/jquery.isotope.min.js
//= require plugins.js
//= require_tree ./libraries

if(platform.name == "IE" && parseInt(platform.version) < 9) { window.location.href="ie8.html"; }