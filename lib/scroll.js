/* eslint-disable */
export default function scrollToTop(laidOutItems) {
	var cosParameter = window.scrollY / 2,
		scrollCount = 0,
		oldTimestamp = performance.now();

	const { maxY } = laidOutItems;
	let direction = 'down';
	const increment = 1;

	function step() {
		window.scrollTo(0, scrollCount);

		if (direction === 'down') {
			if (scrollCount > maxY) {
				scrollCount -= increment;
				direction = 'up';
			} else {
				scrollCount += increment;
			}
		} else if (direction === 'up') {
			if (scrollCount < 0) {
				scrollCount += increment;
				direction = 'down';
			} else {
				scrollCount -= increment;
			}
		}

		console.log(scrollCount, maxY);
		// scrollCount += 10;

		window.requestAnimationFrame(step);
	}

	// window.scrollTo(0, 1500);
	window.requestAnimationFrame(step);
}

// export default function scrollToTop(scrollDuration) {
// 	const scrollHeight = window.scrollY;
// 	const scrollStep = Math.PI / (scrollDuration / 15);
// 	const cosParameter = scrollHeight / 2;
//
// 	let scrollCount = 0;
// 	let scrollMargin;
// 	const scrollInterval = setInterval(function() {
// 		console.log(window.scrollY);
// 		if (window.scrollY >= 0) {
// 			scrollCount = scrollCount + 1;
// 			scrollMargin =
// 				cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
//
// 			console.log(scrollMargin, scrollCount);
// 			// window.scrollTo(0, scrollHeight - scrollMargin);
// 			// window.scrollTo(0, )
// 		} else clearInterval(scrollInterval);
// 	}, 15);
// }
