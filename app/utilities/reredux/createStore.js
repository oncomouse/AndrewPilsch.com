import combineReducers from './combineReducers'
import EvEmitter from 'ev-emitter'
class Store {
	constructor(reducers, initialState) {
		this.emitter = new EvEmitter();
		if(typeof reducers === 'function') {
			this.reducers = reducers;
		} else {
			this.reducers = combineReducers(reducers);
		}
		this.state = this.reducers(initialState, {type: null});
	}
	dispatch(action) {
		this.state = this.reducers(this.state, action);
		this.emitter.emitEvent('dispatch');
	}
	getState() {
		return this.state;
	}
	subscribe(func) {
		this.emitter.on('dispatch', func);
	}
	unsubscribe(func) {
		this.emitter.off('dispatch', func);
	}
}

export default function(reducers, initialState={}) {
	return new Store(reducers, initialState);
}