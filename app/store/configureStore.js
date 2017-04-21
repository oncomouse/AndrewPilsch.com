import { createStore } from 'redux';
import reducers from 'reducers';
import {Map} from 'immutable';

export default () => {
	return createStore(reducers, Map());
}