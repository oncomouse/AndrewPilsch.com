import Isotope from 'isotope-layout';

export default (mobile=false) => new Isotope(document.querySelector('#box_container'), {
	itemSelector: '.box',
	isInitLayout: false,
	layoutMode : 'masonry',
	masonry: {
		columnWidth: parseInt(window.getComputedStyle(document.querySelector('#column_width')).width)
	},
	cornerStampSelector: '.corner_stamp'
});