import configureStore from 'store'
import configureIsotope from 'isotope'
import FilterManager from 'components/filter'
import HashManager from 'components/hash'
import BoxManager from 'components/box'
import ImageManager from 'components/images'
import CourseManager from 'components/courses'
import HelpManager from 'components/help'
import addOns from 'add-ons'

let store = configureStore();
let isotope = configureIsotope(false);

let filters = new FilterManager(store, isotope);
let boxes = new BoxManager(store, isotope);
let images = new ImageManager(store, isotope);
let courses = new CourseManager(store, isotope);
let hash = new HashManager(store);
let help = new HelpManager(store);

export default () => {
	document.querySelector('html').classList.add('js');
	document.querySelector('html').classList.remove('no-js');
	isotope.once('layoutComplete', () => addOns())
	help.onReady();
	images.onReady();
	filters.onReady();
	boxes.onReady();
	hash.onReady();
	courses.onReady();
	
}