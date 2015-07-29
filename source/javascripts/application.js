//=	require platform
//= require ../../vendor/components/labjs/LAB.js
//= require jquery
//= require ../../vendor/components/imagesloaded/imagesloaded.pkgd.min.js
//= require ../../vendor/components/isotope/dist/isotope.pkgd.min.js
//= require plugins.js
//= require_tree ./libraries

if(platform.name == 'IE' && parseInt(platform.version) < 9) { window.location.href='ie8.html'; }

// Load polyfills and init isotope. All file paths are generated at build by Middleman:
$(document).ready(function() {

	if (platform.os.family != "OS X") {
		$('<link rel="stylesheet" type="text/css" href="' + window.assets.cssBaseUrl + 'fonts/liberation-sans/liberation-sans.css" >') .appendTo("head");
	}
	if(window.matchMedia && window.matchMedia("all and (min-width: 33.236em)").matches) {
		$LAB.queueScript(window.assets.baseUrl + 'site.js');
	} else {
		$LAB.queueScript(window.assets.baseUrl + 'mobile.js');
	}

	$LAB.queueWait(function() {
		start_isotope();
	});
	$LAB.runQueue();
});