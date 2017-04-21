import configureIsotope from 'isotope'
import addOns from 'add-ons'

class Mobile {
	constructor(isotope) {
		this.isotope = isotope;
		this.filterState = null;
		this.imageState = false;
	}
	changeFilter(ev) {
		ev.preventDefault();
	
		let filterTarget = ev.target.getAttribute('data-filter');
		if(filterTarget === '') {
			filterTarget = null;
		}
		if(this.filterState !== filterTarget){
			this.isotope.arrange({
				filter: filterTarget
			});
			this.filterState = filterTarget;
			document.querySelector('#filters a.selected').classList.remove('selected');
			document.querySelector(`#filters a[data-filter="${filterTarget === null ? "" : filterTarget}"]`).classList.add('selected');
		}
	}
}
let isotope = configureIsotope(true);

let mobile = new Mobile(isotope);

export default () => {
	document.querySelector('html').classList.add('js');
	document.querySelector('html').classList.remove('no-js');
	
	document.querySelector('#filters a[data-filter=""]').classList.add('selected');
	
	// Attach filter click events:
	document.querySelectorAll('#filters a').forEach((el) => el.addEventListener('click', mobile.changeFilter.bind(mobile)));
	
	// Run Add-Ons when layout is finished:
	isotope.once('layoutComplete', () => addOns())
	isotope.layout();
}