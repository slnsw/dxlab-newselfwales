// Get current date
// DONE: May need to set timezone as Australia/Sydney
export const getDate = (offset = 0) => {
	// get current date in Sydney as string
	const AUDate = new Date().toLocaleString('en-US', {
		timeZone: 'Australia/Sydney',
	});
console.log(AUDate);
	// convert that into a date object
	const da = new Date(AUDate);
	// find the seconds
	const sec = da.getSeconds();
	// create a new date object that is 'offset' seconds after (or before if offset negative)
	const dat = new Date(da.setSeconds(sec + offset));
	// The next 14 lines construct a string of this format: 2018-09-11T12:59:53.564
	// because js is too stupid to have any decent date manipulation functions...
	const y = dat.getFullYear();
	let m = `0${dat.getMonth() + 1}`;
	m = m.slice(-2);
	let d = `0${dat.getDate()}`;
	d = d.slice(-2);
	let h = `0${dat.getHours()}`;
	h = h.slice(-2);
	let mi = `0${dat.getMinutes()}`;
	mi = mi.slice(-2);
	let s = `0${dat.getSeconds()}`;
	s = s.slice(-2);
	let ms = `00${dat.getMilliseconds()}`;
	ms = ms.slice(-3);
	const date = `${y}-${m}-${d}T${h}:${mi}:${s}.${ms}`;
console.log(date);
	return date;
};
