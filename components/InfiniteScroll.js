import React, { Component } from 'react';
import PropTypes from 'prop-types';

// TODO: Test vertical scrolling

export default class InfiniteScroll extends Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		element: PropTypes.node,
		hasMore: PropTypes.bool,
		initialLoad: PropTypes.bool,
		isReverse: PropTypes.bool,
		isHorizontal: PropTypes.bool,
		loader: PropTypes.node,
		loadMore: PropTypes.func.isRequired,
		pageStart: PropTypes.number,
		ref: PropTypes.func,
		getScrollParent: PropTypes.func,
		threshold: PropTypes.number,
		useCapture: PropTypes.bool,
		useWindow: PropTypes.bool,
	};

	static defaultProps = {
		element: 'div',
		hasMore: false,
		initialLoad: true,
		pageStart: 0,
		ref: null,
		threshold: 250,
		useWindow: true,
		isReverse: false,
		isHorizontal: false,
		useCapture: false,
		loader: null,
		getScrollParent: null,
	};

	constructor(props) {
		super(props);

		this.scrollListener = this.scrollListener.bind(this);
	}

	componentDidMount() {
		this.pageLoaded = this.props.pageStart;
		this.attachScrollListener();
	}

	componentDidUpdate() {
		this.attachScrollListener();
	}

	componentWillUnmount() {
		this.detachScrollListener();
		this.detachMousewheelListener();
	}

	// Set a defaut loader for all your `InfiniteScroll` components
	setDefaultLoader(loader) {
		this.defaultLoader = loader;
	}

	detachMousewheelListener() {
		let scrollEl = window;
		if (this.props.useWindow === false) {
			scrollEl = this.scrollComponent.parentNode;
		}

		scrollEl.removeEventListener(
			'mousewheel',
			this.mousewheelListener,
			this.props.useCapture,
		);
	}

	detachScrollListener() {
		let scrollEl = window;
		if (this.props.useWindow === false) {
			scrollEl = this.getParentElement(this.scrollComponent);
		}

		scrollEl.removeEventListener(
			'scroll',
			this.scrollListener,
			this.props.useCapture,
		);
		scrollEl.removeEventListener(
			'resize',
			this.scrollListener,
			this.props.useCapture,
		);
	}

	getParentElement(el) {
		const scrollParent =
			this.props.getScrollParent && this.props.getScrollParent();
		if (scrollParent != null) {
			return scrollParent;
		}
		return el && el.parentNode;
	}

	filterProps(props) {
		return props;
	}

	attachScrollListener() {
		const parentElement = this.getParentElement(this.scrollComponent);

		if (!this.props.hasMore || !parentElement) {
			return;
		}

		let scrollEl = window;
		if (this.props.useWindow === false) {
			scrollEl = parentElement;
		}

		scrollEl.addEventListener(
			'mousewheel',
			this.mousewheelListener,
			this.props.useCapture,
		);
		scrollEl.addEventListener(
			'scroll',
			this.scrollListener,
			this.props.useCapture,
		);
		scrollEl.addEventListener(
			'resize',
			this.scrollListener,
			this.props.useCapture,
		);

		if (this.props.initialLoad) {
			this.scrollListener();
		}
	}

	mousewheelListener(e) {
		// Prevents Chrome hangups
		// See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
		if (e.deltaY === 1) {
			e.preventDefault();
		}
	}

	scrollListener() {
		const el = this.scrollComponent;
		const scrollEl = window;
		const parentNode = this.getParentElement(el);

		// Set up depending on vertical or horizontal scrolling
		const scrollLength = this.props.isHorizontal ? 'scrollLeft' : 'scrollTop';
		const scrollSize = this.props.isHorizontal ? 'scrollWidth' : 'scrollHeight';
		const clientSize = this.props.isHorizontal ? 'clientWidth' : 'clientHeight';
		const pageOffset = this.props.isHorizontal ? 'pageXOffset' : 'pageYOffset';

		let offset;

		if (this.props.useWindow) {
			const doc =
				document.documentElement || document.body.parentNode || document.body;
			const scrollStart =
				scrollEl[pageOffset] !== undefined
					? scrollEl[pageOffset]
					: doc[scrollLength];
			if (this.props.isReverse) {
				offset = scrollStart;
			} else {
				offset = this.calculateOffset(el, scrollStart);
			}
		} else if (this.props.isReverse) {
			offset = parentNode[scrollLength];
		} else {
			offset =
				el[scrollSize] - parentNode[scrollLength] - parentNode[clientSize];
		}

		// Here we make sure the element is visible as well as checking the offset
		if (
			offset < Number(this.props.threshold) &&
			el &&
			el.offsetParent !== null
		) {
			this.detachScrollListener();
			// Call loadMore after detachScrollListener to allow for non-async loadMore functions
			if (typeof this.props.loadMore === 'function') {
				this.props.loadMore((this.pageLoaded += 1));
			}
		}
	}

	calculateOffset(el, scrollStart) {
		const offsetSize = this.props.isHorizontal ? 'offsetWidth' : 'offsetHeight';
		const windowInnerSize = this.props.isHorizontal
			? 'innerWidth'
			: 'innerHeight';

		if (!el) {
			return 0;
		}

		return (
			this.calculateTopPosition(el) +
			(el[offsetSize] - scrollStart - window[windowInnerSize])
		);
	}

	calculateTopPosition(el) {
		if (!el) {
			return 0;
		}
		return el.offsetTop + this.calculateTopPosition(el.offsetParent);
	}

	render() {
		const renderProps = this.filterProps(this.props);
		const {
			children,
			element,
			hasMore,
			/* eslint-disable no-unused-vars */
			initialLoad,
			isReverse,
			loader,
			loadMore,
			pageStart,
			ref,
			threshold,
			useCapture,
			useWindow,
			getScrollParent,
			isHorizontal,
			/* eslint-enable no-unused-vars */
			...props
		} = renderProps;

		props.ref = (node) => {
			this.scrollComponent = node;
			if (ref) {
				ref(node);
			}
		};

		const childrenArray = [children];

		if (hasMore) {
			if (loader) {
				/* eslint-disable no-unused-expressions */
				isReverse ? childrenArray.unshift(loader) : childrenArray.push(loader);
			} else if (this.defaultLoader) {
				isReverse
					? childrenArray.unshift(this.defaultLoader)
					: childrenArray.push(this.defaultLoader);
				/* eslint-enable no-unused-expressions */
			}
		}

		return React.createElement(element, props, childrenArray);
	}
}
