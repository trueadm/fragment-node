/*!
 * fragment-node v0.0.1
 * (c) 2016 undefined
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.FragmentNode = factory());
}(this, (function () { 'use strict';

function createFragmentNode() {
	// we can either use a comment or a text node?
	// we just need something that is not an element (affects styling and has issues with tables)
	// we cannot use docFrags as they do not actually get inserted into the DOM tree
	var base = document.createComment('');
	var childNodes = [];
	var lastParent;
	var lastNextSibling;

	// as TextNodes do not have appendChild (as they don't have children), we make one
	base.appendChild = function (node) {
		childNodes.push(node);
		var parentNode = base.parentNode;

		if (parentNode) {
			parentNode.insertBefore(node, base);
		}
	};

	// as TextNodes do not have removeChild (as they don't have children), we make one
	base.removeChild = function (node) {
		childMap.delete(node);
		for (var i = 0; i < childNodes.length; i++) {
			var childNode = childNodes[i];

			if (childNode === node) {
				childNodes.splice(i, 1);
				break;
			}
		}
		var parentNode = base.parentNode;

		if (parentNode) {
			parentNode.removeChild(node);
		}
	};

	// as TextNodes do not have insertBefore (as they don't have children), we make one
	base.insertBefore = function (node) {
		// TODO
	};

	// we need to know if our base node gets mutated around the DOM, if it does, we need to
	// then move our children
	var observer = new MutationObserver(function () {
		var parentNode = base.parentNode;
		var nextSibling = base.nextSibling;
		var hasMoved = false;

		if (parentNode !== lastParent) {
			if (!parentNode) {
				// when our fragment has been detached, we need to also detatch our children
				for (var i = 0; i < childNodes.length; i++) {
					lastParent.removeChild(childNodes[i]);
				}
				lastParent = parentNode;
				return;
			}
			lastParent = parentNode;
			lastNextSibling = nextSibling;
			hasMoved = true;
		} else if (lastNextSibling !== nextSibling) {
			lastNextSibling = nextSibling;
			hasMoved = true;
		}
		if (hasMoved) {
			// when our fragment has been moved/attached, we need to also attach our children
			for (var i$1 = 0; i$1 < childNodes.length; i$1++) {
				parentNode.insertBefore(childNodes[i$1], base);
			}
		}
	});

	observer.observe(document.body, { 
		attributes: false,
		childList: true,
		characterData: false,
		subtree: true
	});

	// we need to give our base object some properties that would normally appear on a fragment
	Object.defineProperty(base, 'firstChild', {
		get: function get() {
			return childNodes[0];
		},
		write: false
	});

	Object.defineProperty(base, 'lastChild', {
		get: function get$1() {
			return childNodes[childNodes.length - 1];
		},
		write: false
	});

	Object.defineProperty(base, 'childNodes', {
		get: function get$2() {
			return childNodes;
		},
		write: false
	});

	// TODO
	Object.defineProperty(base, 'children', {
		get: function get$3() {
			return childNodes;
		},
		write: false
	});

	return base;
}

var index = {
	createFragmentNode: createFragmentNode
};

return index;

})));
