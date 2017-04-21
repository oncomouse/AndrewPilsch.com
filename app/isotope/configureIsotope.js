import Isotope from 'isotope-layout';

export default (mobile=false) => {
	return mobile ? 
		new Isotope(document.querySelector('#box_container'), {
			itemSelector: '.box',
			isInitLayout: false,
			layoutMode : 'vertical',
			animationOptions: {
				duration: 200,
				easing: 'linear',
				queue: false
			}
		}) :
		new Isotope(document.querySelector('#box_container'), {
			itemSelector: '.box',
			isInitLayout: false,
			layoutMode : 'masonry',
			masonry: {
				columnWidth: parseInt(window.getComputedStyle(document.querySelector('#column_width')).width)
			},
			cornerStampSelector: '.corner_stamp'
		});
}