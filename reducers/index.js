import { combineReducers } from 'redux';

import imageFeed from './imageFeedReducer';
import imageFader from './imageFaderReducer';

export default combineReducers({
	imageFeed,
	imageFader,
});
