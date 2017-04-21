import createReducer from 'utilities/createReducer';
import { IMAGE_ACTION } from 'constants/ActionTypes';

const initialState = false;
const actionMaps = {
	[IMAGE_ACTION]: (state, action) => {
		return true;
	}
}

export default createReducer(initialState, actionMaps);