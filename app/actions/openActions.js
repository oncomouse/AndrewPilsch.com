import { OPEN_ACTION, CLOSE_ACTION } from 'constants/ActionTypes';

export const openBox = (boxId) => ({
	type: OPEN_ACTION,
	boxId
});
export const closeBox = () => ({
	type: CLOSE_ACTION
});