import { createStore } from 'utilities/reredux';
import reducers from 'reducers';

export default () => {
	return createStore(reducers);
}