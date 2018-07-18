// Scroller

export const scroller = {
	increment: undefined,
	direction: 'forward',
	scrollCount: 0,
	element: undefined,
	max: undefined,
	requestId: undefined,
	axis: undefined,
	init(element, laidOutItems, { axis = 'x', increment = 0.4 }) {
		this.axis = axis;
		this.element = element;
		this.increment = increment;

		console.log(element);

		this.updateLaidOutItems(laidOutItems);
	},
	updateLaidOutItems(laidOutItems) {
		const { maxX, maxY } = laidOutItems;

		if (this.axis === 'y') {
			this.max = maxY - window.innerHeight;
		} else if (this.axis === 'x') {
			this.max = maxX - window.innerWidth;
		}
	},
	updateIncrement(increment) {
		this.increment = increment;
	},
	step() {
		this.requestId = undefined;

		// Work out scroll amount
		// (Switch direction if needed)
		if (this.direction === 'forward') {
			const { scrollLeft } = document.getElementsByClassName('image-feed')[0];
			// const { scrollLeft } = this.element.parentElement;

			if (this.scrollCount >= this.max - scrollLeft) {
				this.scrollCount -= this.increment;
				this.direction = 'backward';
			} else {
				this.scrollCount += this.increment;
			}
		} else if (this.direction === 'backward') {
			if (this.scrollCount < 0) {
				this.scrollCount += this.increment;
				this.direction = 'forward';
			} else {
				this.scrollCount -= this.increment;
			}
		}

		// Increment element
		if (this.axis === 'y') {
			this.element.style.transform = `translate(${this.scrollCount * -1}px)`;
			// window.scrollTo(0, this.scrollCount);
		} else if (this.axis === 'x') {
			// this.element.scrollLeft = 100;
			this.element.style.transform = `translate(${this.scrollCount * -1}px)`;
			// window.scrollTo(this.scrollCount, 0);
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
