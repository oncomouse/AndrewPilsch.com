import {FILTER_ACTION} from 'constants/ActionTypes'

export const changeFilter = (target) => ({
	type: FILTER_ACTION,
	filter: target
})