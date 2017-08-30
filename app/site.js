import configureStore from 'store'
import configureIsotope from 'isotope'
import FilterManager from 'components/filter'
import HashManager from 'components/hash'
import BoxManager from 'components/box'
import ImageManager from 'components/images'
import CourseManager from 'components/courses'
import HelpManager from 'components/help'
import addOns from 'add-ons'

const store = configureStore();
const isotope = configureIsotope(false);

const filters = new FilterManager(store, isotope);
const boxes = new BoxManager(store, isotope);
const images = new ImageManager(store, isotope);
const courses = new CourseManager(store, isotope);
const hash = new HashManager(store);
const help = new HelpManager(store);

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