// import IScroll from 'iscroll';

// Scroller Factory

export const scroller = {
	increment: undefined,
	direction: 'forward',
	scrollCount: 0,
	element: undefined,
	max: undefined,
	requestId: undefined,
	axis: undefined,
	firstStart: true,
	scrollTimer: false,
	disableOnScroll: false,
	init(element, laidOutItems, { axis = 'x', increment = 0.4 }) {
		this.axis = axis;
		this.element = element;
		this.increment = increment;

		this.updateLaidOutItems(laidOutItems);
		this.element.parentElement.addEventListener(
			'scroll',
			this.handleUserScroll.bind(this),
		);

		// if (typeof window !== 'undefined') {
		// 	const IScroll = require('iscroll');
		// 	this.iscroll = new IScroll('.image-feed-container', {
		// 		mouseWheel: true,
		// 		scrollbars: true,
		// 	});
		// 	console.log(this.iscroll);
		// }
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
			// const { scrollLeft } = document.getElementsByClassName('image-feed')[0];
			const { scrollLeft } = this.element.parentElement;

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
			// This works, but is very jittery on HiDef screens
			// this.element.parentElement.scrollLeft = this.scrollCount;
			this.element.style.transform = `translate(${this.scrollCount * -1}px)`;
		}

		// Only allow animation if max width/height of element is larger than screen width/height
		if (this.max > 0) {
			this.start();
		}
	},
	start() {
		if (!this.requestId) {
			// console.log(this.scrollCount);

			if (this.firstStart) {
				console.log('start');
				this.disableOnScroll = true;
				this.element.style.transform = `translate(${this.scrollCount * -1}px)`;
				this.element.parentElement.scrollLeft = 0;

				this.firstStart = false;
			}

			this.requestId = window.requestAnimationFrame(this.step.bind(this));
		}
	},
	stop() {
		// if (this.requestId) {
		window.cancelAnimationFrame(this.requestId);
		this.firstStart = true;
		this.requestId = undefined;

		console.log('stop');
		console.log('scrollLeft', this.element.parentElement.scrollLeft);

		this.element.style.transform = `translate(0)`;
		this.element.parentElement.scrollLeft =
			this.scrollCount + this.element.parentElement.scrollLeft;
		this.disableOnScroll = false;
		// console.log(this.scrollCount);
		// }
	},
	handleUserScroll(e) {
		console.log(e.target.scrollLeft);

		if (this.disableOnScroll === false) {
			if (this.scrollTimer) {
				window.clearTimeout(this.scrollTimer);
			}

			this.scrollTimer = window.setTimeout(() => this.onTimeout(e), 200);
		}
	},
	onTimeout(e) {
		console.log('stopped');
		console.log(!this.requestId);

		// if (!this.requestId) {
		console.log(e.target.scrollLeft, this.scrollCount);
		this.scrollCount = e.target.scrollLeft;
		// }
	},
};

// function onTimeout() {
// 	console.log('hi', this.scrollCount);
// }

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
