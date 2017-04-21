import {changeFilter} from 'actions/filterActions'

export default function CourseManager(store, isotope) {
	this.store = store;
	this.isotope = isotope;
	this.courses_loaded = false;
}
CourseManager.prototype.loadCourses = function(term=false) {
	let url = undefined;
	if (window.location.href.match(/localhost/)) {
		return;
	}
	if (term === false || term === undefined) {
		term = false;
		url = '/courses/?blank';
	} else {
		url = '/courses/?blank&term=' + encodeURIComponent(term);
	}
	fetch(url)
		.then((response) => response.text())
		.then((html) => { 
			let div = document.createElement('div');
			div.innerHTML = html;
			this.isotope.insert(div.childNodes);
			div = null;
			if(!term) {
				const seen = []
				document.querySelectorAll('.box.class').forEach((class_box) => {
					if(seen.includes(class_box.id)) {
						class_box.parentNode.removeChild(class_box);
					} else {
						seen.push(class_box.id);
					}
				})
				this.store.dispatch(changeFilter('.teaching'))
			}
		})
		.catch((error) => console.log(`There was an error fetching: ${error}`));
}
CourseManager.prototype.loadAllCourses = function(ev) {
	ev.preventDefault();
	
	if (!this.courses_loaded) {
		this.courses_loaded = true;
		this.loadCourses();
	}
}
CourseManager.prototype.onReady = function() {
	// Set up Load All Courses button:
	document.querySelector('#teaching_button').addEventListener('click', this.loadAllCourses.bind(this))
}