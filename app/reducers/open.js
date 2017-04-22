import createReducer from 'utilities/createReducer';
import { OPEN_ACTION, CLOSE_ACTION } from 'constants/ActionTypes';

const initialState = null;
const actionMaps = {
	[OPEN_ACTION]: (state, action) => {
		return action.boxId;
	},
	[CLOSE_ACTION]: (state,action) => {
		return initialState;
	}
}

export default createReducer(initialState, actionMaps);