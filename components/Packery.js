/* eslint-disable */

var isBrowser = typeof window !== 'undefined';
var Packery = isBrowser ? window.Packery || require('packery') : null;
var Draggabilly = isBrowser
	? window.Draggabilly || require('draggabilly')
	: null;
var imagesloaded = isBrowser ? require('imagesloaded') : null;
var assign = require('lodash.assign');
var debounce = require('lodash.debounce');
var omit = require('lodash.omit');
var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var refName = 'packeryContainer';

var propTypes = {
	disableImagesLoaded: PropTypes.bool,
	options: PropTypes.object,
	enableDragging: PropTypes.bool,
	updateOnEachImageLoad: PropTypes.bool,
	onImagesLoaded: PropTypes.func,
	elementType: PropTypes.string,
};

PackeryComponent = createReactClass({
	packery: false,
	domChildren: [],
	displayName: 'PackeryComponent',
	propTypes: propTypes,
	canRefresh: true,

	getDefaultProps: function() {
		return {
			disableImagesLoaded: false,
			options: {},
			className: '',
			elementType: 'div',
			enableDragging: false,
			updateOnEachImageLoad: false,
		};
	},

	makeDraggable: function(itemElem) {
		// make element draggable with Draggabilly
		var draggie = new Draggabilly(itemElem);
		// bind Draggabilly events to Packery
		this.packery.bindDraggabillyEvents(draggie);
	},

	initializePackery: function(force) {
		if (!this.packery || force) {
			this.packery = new Packery(this.refs[refName], this.props.options);

			if (this.props.enableDragging) {
				this.packery.getItemElements().forEach(this.makeDraggable);
			}

			if (typeof this.props.onLayoutComplete === 'function') {
				this.packery.on('layoutComplete', this.props.onLayoutComplete);
				// this.packery.on('removeComplete', this.props.onLayoutComplete);
				// this.packery.on('fitComplete', this.props.onLayoutComplete);
			}

			this.domChildren = this.getNewDomChildren();
		}
	},

	getNewDomChildren: function() {
		var node = this.refs[refName];
		var children = this.props.options.itemSelector
			? node.querySelectorAll(this.props.options.itemSelector)
			: node.children;
		return Array.prototype.slice.call(children);
	},

	diffDomChildren: function(prevProps) {
		var oldChildren = this.domChildren.filter(function(element) {
			/*
			 * take only elements attached to DOM
			 * (aka the parent is the packery container, not null)
			 */
			return !!element.parentNode;
		});

		var newChildren = this.getNewDomChildren();

		var removed = oldChildren.filter(function(oldChild) {
			return !~newChildren.indexOf(oldChild);
		});

		var domDiff = newChildren.filter(function(newChild) {
			return !~oldChildren.indexOf(newChild);
		});

		var beginningIndex = 0;

		// get everything added to the beginning of the DOMNode list
		var prepended = domDiff.filter(function(newChild, i) {
			var prepend = beginningIndex === newChildren.indexOf(newChild);

			if (prepend) {
				// increase the index
				beginningIndex++;
			}

			return prepend;
		});

		// we assume that everything else is appended
		var appended = domDiff.filter(function(el) {
			return prepended.indexOf(el) === -1;
		});

		/*
		* otherwise we reverse it because so we're going through the list picking off the items that
		* have been added at the end of the list. this complex logic is preserved in case it needs to be
		* invoked
		*
		* var endingIndex = newChildren.length - 1;
		*
		* domDiff.reverse().filter(function(newChild, i){
		*     var append = endingIndex == newChildren.indexOf(newChild);
		*
		*     if (append) {
		*         endingIndex--;
		*     }
		*
		*     return append;
		* });
		*/

		// get everything added to the end of the DOMNode list
		var moved = [];

		if (removed.length === 0) {
			moved = oldChildren.filter(function(child, index) {
				return index !== newChildren.indexOf(child);
			});
		}

		this.domChildren = newChildren;

		return {
			old: oldChildren,
			new: newChildren,
			removed: removed,
			appended: appended,
			prepended: prepended,
			moved: moved,
		};
	},

	performLayout: function(prevProps) {
		var diff = this.diffDomChildren(prevProps);

		if (diff.removed.length > 0) {
			console.log('diff removed');

			this.packery.remove(diff.removed);
		}

		if (diff.appended.length > 0) {
			this.packery.appended(diff.appended);
		}

		if (diff.prepended.length > 0) {
			this.packery.prepended(diff.prepended);
		}

		this.packery.reloadItems();

		if (this.props.enableDragging) {
			this.packery.getItemElements().forEach(this.makeDraggable);
		}
		this.packery.layout();
	},

	imagesLoaded: function() {
		if (this.props.disableImagesLoaded) return;

		imagesloaded(this.refs[refName]).on(
			this.props.updateOnEachImageLoad ? 'progress' : 'always',
			debounce(
				function(instance) {
					if (this.props.onImagesLoaded) {
						this.props.onImagesLoaded(instance);
					}

					// const itemsToLayout = Array.from(this.refs[refName].children).filter(
					// 	(element) => {
					// 		return element.getBoundingClientRect().right > 0;
					// 	},
					// );

					// console.log(itemsToLayout);

					// this.packery.layoutItems(itemsToLayout);
					this.packery.layout();
				}.bind(this),
				100,
			),
		);
	},

	componentDidMount: function() {
		this.initializePackery();
		this.imagesLoaded();
	},

	componentDidUpdate: function(prevProps) {
		this.performLayout(prevProps);
		this.imagesLoaded();
	},

	componentWillReceiveProps: function() {
		this._timer = setTimeout(
			function() {
				if (!this.canRefresh) return;

				this.packery.reloadItems();
				this.forceUpdate();
			}.bind(this),
			1000,
		);
	},

	componentWillUnmount: function() {
		clearTimeout(this._timer);
		this.canRefresh = false;
		this.packery.destroy();
	},

	render: function() {
		var props = omit(this.props, Object.keys(propTypes));

		return React.createElement(
			this.props.elementType,
			assign({}, props, { ref: refName }),
			this.props.children,
		);
	},
});

PackeryComponent.Packery = Packery;
module.exports = PackeryComponent;
