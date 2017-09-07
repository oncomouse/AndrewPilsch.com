import {addClass} from 'mobile/dom'
import 'mobile/polyfill/closest'

let position = null;

export function manageHash(target) {
	position = document.body.scrollTop;
	window.location.hash = target.classList.contains('open') ? target.querySelector('.box').getAttribute('id') : ''
}

window.addEventListener('hashchange', function(ev) {
	if(position !== null) {
		document.body.scrollTop = position;
	}
	position = null;
});
window.addEventListener('htmlsetup', function(ev) {
	if(window.location.hash !== '' && window.location.hash !== '#') {
		const target = document.querySelector(window.location.hash);
		if(target !== null) {
			addClass(target.parentNode, 'open');
			addClass(target.parentNode, 'read-more');
			addClass(target.parentNode.parentNode.closest('li'), 'open');
		}
	}
})