import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducers from '../reducers';

let reduxStore = null;

// Get the Redux DevTools extension and fallback to a no-op function
let devtools = (f) => f;
/* eslint-disable no-underscore-dangle */
if (process.browser && window.__REDUX_DEVTOOLS_EXTENSION__) {
	devtools = window.__REDUX_DEVTOOLS_EXTENSION__();
}

export function initStore(initialState = {}) {
	return createStore(
		reducers,
		initialState, // Hydrate the store with server-side data
		compose(
			applyMiddleware(thunkMiddleware), // Add additional middleware here
			devtools,
		),
	);
}

export default function initRedux(initialState) {
	// Make sure to create a new store for every server-side request so that data
	// isn't shared between connections (which would be bad)
	if (!process.browser) {
		return initStore(initialState);
	}

	// Reuse store on the client-side
	if (!reduxStore) {
		reduxStore = initStore(initialState);
	}

	return reduxStore;
}
