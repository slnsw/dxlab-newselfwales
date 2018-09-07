const initialState = {
	currentImages: [],
	upcomingImage: [],
	spareImages: [],
};

// REDUCERS
export default (state = initialState, action) => {
	switch (action.type) {
		case 'EXAMPLE_ACTION':
			console.log('EXAMPLE_ACTION');
			return state;
		case 'ADD':
			return {
				...state,
				count: state.count + 1,
			};
		default:
			return state;
	}
};
