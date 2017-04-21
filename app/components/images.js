import LazyLoad from 'vanilla-lazyload'
import {imagesLoaded} from 'store'

export default function ImageManager(store, isotope) {
	this.store = store;
	this.isotope = isotope;
	this.imageState = false;
	this.store.subscribe(this.loadImages.bind(this));
}
ImageManager.prototype.loadImages = function() {
	if(this.imageState !== imagesLoaded(this.store)) {
		// Lazy Load
		const ll = new LazyLoad({
			skip_invisible: false,
			threshold: 1000000, // There's no way to make it load all images at once regardless of scroll
			callback_load: (el) => {
				el.style.width = '';
				el.style.height = '';
				if(this.imageState === true) {
					this.isotope.layout()
				}
			},
			callback_processed: (elementsLeft) => {
				if(elementsLeft === 0) {
					this.imageState = true;
				}
			}
		})
	}
}
ImageManager.prototype.onReady = function() {
	// Prep images for lazyLoading:
	document.querySelectorAll('img.lazy').forEach((el) => {
		el.style.width = `${parseInt(el.getAttribute('data-image-width'))}px`;
		el.style.height = `${parseInt(el.getAttribute('data-image-height'))}px`;
	});
}