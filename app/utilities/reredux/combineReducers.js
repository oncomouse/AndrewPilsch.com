export default (reducers) => {
	return (state, action) => {
		const updatedState = Object.assign({}, state);
		Object.keys(reducers).forEach((key) => {
			updatedState[key] = reducers[key](state[key], action);
		});
		return updatedState;
	}
}