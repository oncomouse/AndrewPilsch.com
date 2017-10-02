import updatePresentations from 'add-ons/updatePresentations'
import clickableBlogs from 'add-ons/clickableBlogs'
import emphasizer from 'add-ons/emphasizer'

export default () => {
	updatePresentations();
	clickableBlogs();
	emphasizer();
}