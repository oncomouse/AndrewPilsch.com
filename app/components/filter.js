import {getCurrentFilter} from 'store';
import {changeFilter} from 'actions/filterActions';

export default class FilterManager {
	constructor(store, isotope) {
		this.store = store;
		this.isotope = isotope;
		this.filterState = getCurrentFilter(this.store);
		this.store.subscribe(this.updateFilter.bind(this));
	}
	updateFilter() {
		let currentFilter = getCurrentFilter(this.store);
		if(this.filterState !== currentFilter){
			this.isotope.arrange({
				filter: currentFilter
			});
			this.filterState = currentFilter;
			document.querySelector('#filters a.selected').classList.remove('selected');
			document.querySelector(`#filters a[data-filter="${currentFilter === null ? "" : currentFilter}"]`).classList.add('selected');
		}
	}
	changeFilter(ev) {
		ev.preventDefault();
	
		let filterTarget = ev.target.getAttribute('data-filter');
		if(filterTarget === '') {
			filterTarget = null;
		}
		this.store.dispatch(changeFilter(filterTarget))
	}
	onReady() {
		// All is the default filter state:
		document.querySelector('#filters a[data-filter=""]').classList.add('selected');
	
		// Attach filter click events:
		document.querySelectorAll('#filters a').forEach((el) => el.addEventListener('click', this.changeFilter.bind(this)));
	}
}