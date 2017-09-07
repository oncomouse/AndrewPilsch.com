import LazyLoad from 'vanilla-lazyload'

let ll = undefined

export const updateImages = function() {
	ll.update();
}

export const prepImages = function() {
	document.querySelectorAll('img').forEach(img => {
		img.style.width = `${parseInt(img.getAttribute('data-image-width'))}px`;
		img.style.height = `${parseInt(img.getAttribute('data-image-height'))}px`;
	})
	ll = new LazyLoad({
		skip_invisible: true,
		threshold: 1000000,
		data_src: 'original'
	});
}