/* eslint-disable */
export default function scrollToTop(laidOutItems, axis = 'y') {
	const { maxX, maxY } = laidOutItems;
	const increment = 1;

	let scrollCount = 0;
	let direction = 'down';
	let max;

	if (axis === 'y') {
		max = maxY - window.innerHeight;
	} else {
		max = maxX - window.innerWidth;
	}

	function step() {
		if (axis === 'y') {
			window.scrollTo(0, scrollCount);
		} else if (axis === 'x') {
			window.scrollTo(scrollCount, 0);
		}

		if (direction === 'down') {
			if (scrollCount >= max) {
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

		// console.log(scrollCount, max);

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