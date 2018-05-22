/* eslint-disable */
export default function scrollToTop(laidOutItems, axis = 'y') {
	const { maxX, maxY } = laidOutItems;
	const increment = 0.2;

	// TODO: Pass this through as parameter!
	const images = document.getElementsByClassName('images')[0];

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
			images.style.transform = `translate(0, ${scrollCount * -1}px)`;
		} else if (axis === 'x') {
			// console.log(scrollCount, max);
			// console.log(images);
			images.style.transform = `translate(${scrollCount * -1}px)`;
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

		// console.log(scrollCount, max, axis);
		// Only allow animation if max width/height of images is larger than screen width/height
		if (max > 0) {
			window.requestAnimationFrame(step);
		}
	}

	window.requestAnimationFrame(step);
}

// Scroller object
export const scroller = {
	increment: 0.4,
	direction: 'down',
	scrollCount: 0,
	element: undefined,
	max: undefined,
	requestId: undefined,
	axis: undefined,
	init(element, laidOutItems, axis = 'y') {
		const { maxX, maxY } = laidOutItems;
		this.axis = axis;
		this.element = element;

		if (this.axis === 'y') {
			this.max = maxY - window.innerHeight;
		} else {
			this.max = maxX - window.innerWidth;
		}
	},
	step() {
		this.requestId = undefined;

		if (this.axis === 'y') {
			window.scrollTo(0, this.scrollCount);
		} else if (this.axis === 'x') {
			this.element.style.transform = `translate(${this.scrollCount * -1}px)`;
		}

		if (this.direction === 'down') {
			if (this.scrollCount >= this.max) {
				this.scrollCount -= this.increment;
				this.direction = 'up';
			} else {
				this.scrollCount += this.increment;
			}
		} else if (this.direction === 'up') {
			if (this.scrollCount < 0) {
				this.scrollCount += this.increment;
				this.direction = 'down';
			} else {
				this.scrollCount -= this.increment;
			}
		}

		// Only allow animation if max width/height of element is larger than screen width/height
		if (this.max > 0) {
			this.start();
		}
	},
	start() {
		if (!this.requestId) {
			this.requestId = window.requestAnimationFrame(this.step.bind(this));
		}
	},
	stop() {
		if (this.requestId) {
			window.cancelAnimationFrame(this.requestId);
			this.requestId = undefined;
		}
	},
};

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
