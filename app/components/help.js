import {getOpenBox} from 'store';
export default class Help {
	constructor(store) {
		this.store = store;
		this.timer = false;
		this.delay = 5000;
		this.store.subscribe(this.checkFilterChange.bind(this));
		this.box = getOpenBox(this.store);
		this.done = false;
	}
	checkFilterChange() {
		if(!this.done){
			let currentBox = getOpenBox(this.store);
			if(currentBox !== this.box) {
				this.box = currentBox;
				this.done = true;
				if(document.querySelector('#help').classList.contains('displayed')) {
					document.querySelector('#help').classList.remove('displayed');
				} else {
					if(this.timer !== false){
						window.clearTimeout(this.timer);
						this.timer = false;
					}
				}
			}
		}
	}
	showHelp() {
		document.querySelector('#help').classList.add('displayed');
	}
	onReady() {
		this.timer = window.setTimeout(this.showHelp.bind(this), this.delay);
	}
}