import {getOpenBox} from 'store';
import {openBox} from 'actions/openActions';

export default function HashManager(store) {
	this.store = store;
	this.openBox = getOpenBox(this.store);
	this.store.subscribe(this.updateHash.bind(this));
}
HashManager.prototype.updateHash = function() {
	let currentOpenBox = getOpenBox(this.store);
	if(this.openBox !== currentOpenBox){
		window.location.hash = currentOpenBox === null ? '' : currentOpenBox;
		this.openBox = currentOpenBox;
	}
}
HashManager.prototype.onReady = function() {
	//Open a box if there is one in the hash:
	if(window.location.hash !== '' && window.location.hash !== '#') {
		this.store.dispatch(openBox(window.location.hash));
	}
}