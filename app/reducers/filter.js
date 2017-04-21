import createReducer from 'utilities/createReducer';
import { FILTER_ACTION } from 'constants/ActionTypes';

const initialState = null;
const actionMaps = {
	[FILTER_ACTION]: (state, action) => {
		return action.filter;
	}
}

export default createReducer(initialState, actionMaps);