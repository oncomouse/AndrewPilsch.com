//import MobileDetect from 'mobile-detect'
//const md = new MobileDetect(window.navigator.userAgent);
//
if(window.matchMedia && window.matchMedia("all and (min-width: 33.236em)").matches) {
	System.import('site').then(module => module.default())
} else {
	System.import('mobile').then(module => module.default())
}