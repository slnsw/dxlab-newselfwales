import { combineReducers } from 'redux';

import example from './exampleReducer';
import imageFeed from './imageFeedReducer';

export default combineReducers({
	example,
	imageFeed,
});
