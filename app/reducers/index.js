import {combineReducers} from 'redux-immutable';
import filter from 'reducers/filter';
import open from 'reducers/open';
import images from 'reducers/images'

export default combineReducers({
	filter,
	open,
	images
});