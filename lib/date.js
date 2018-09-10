// Get current date
// TODO: May need to set timezone as Australia/Sydney
export const getDate = (offset = 0) => {
	const timezoneOffset = new Date().getTimezoneOffset() * 60000;

	// Workout timeOffset in seconds
	const timeOffset = 1000 * offset;
	const date = new Date(Date.now() - timezoneOffset + timeOffset)
		.toISOString()
		.slice(0, -1);

	return date;
};
