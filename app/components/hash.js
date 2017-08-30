import {getOpenBox} from 'store';
import {openBox} from 'actions/openActions';

export default class HashManager {
		constructor(store) {
		this.store = store;
		this.openBox = getOpenBox(this.store);
		this.store.subscribe(this.updateHash.bind(this));
	}
	updateHash() {
		let currentOpenBox = getOpenBox(this.store);
		if(this.openBox !== currentOpenBox){
			window.location.hash = currentOpenBox === null ? '' : currentOpenBox;
			this.openBox = currentOpenBox;
		}
	}
	onReady() {
		//Open a box if there is one in the hash:
		if(window.location.hash !== '' && window.location.hash !== '#') {
			this.store.dispatch(openBox(window.location.hash));
		}
		// This code tells all box links that have a hash that is also a box ID (internal hyperlinking to other boxes) to dispatch the proper Redux event when clicked. This can also be handled (with less scripting) by a hashchange event, but that feels like it decenters the Redux-y-ness of the project. I think this is the right way to do this because it only involves changing the hash manager. If I were to trigger off a hashchange event, the way boxes get opened would not use Redux. It would instead just change the hash. This feels like the kind of event chaining that this project was designed to prevent:
		document.querySelectorAll('.box a[href^="#"]').forEach((el) => {
			if(el.hash !== '' && document.querySelector(el.hash) !== null) {
				el.addEventListener('click', (ev) => {
					ev.preventDefault();
					this.store.dispatch(openBox(el.hash));
				});
			}
		});
	}
}