const createFragmentNode = (function() {
	"use strict";

	function createFragmentNode() {
        // we can either use a comment or a text node?
        // we just need something that is not an element (affects styling and has issues with tables)
        // we cannot use docFrags as they do not actually get inserted into the DOM tree
		const base = document.createTextNode('');
		const childNodes = [];
		let lastParent;

		// as TextNodes do not have appendChild (as they don't have children), we make one
		base.appendChild = node => {
			childNodes.push(node);
			const parentNode = base.parentNode;

			if (parentNode) {
				parentNode.appendChild(node);
			}
		};

		// as TextNodes do not have removeChild (as they don't have children), we make one
		base.removeChild = node => {
			childMap.delete(node);
			for (let i = 0; i < childNodes.length; i++) {
				const childNode = childNodes[i];

				if (childNode === node) {
					childNodes.splice(i, 1);
					break;
				}
			}
			const parentNode = base.parentNode;

			if (parentNode) {
				parentNode.removeChild(node);
			}
		};

		// as TextNodes do not have insertBefore (as they don't have children), we make one
		base.insertBefore = node => {
			// TODO
		};

		// we need to know if our base node gets mutated around the DOM, if it does, we need to
		// then move our children
		const observer = new MutationObserver(() => {
			const parentNode = base.parentNode;

			if (parentNode !== lastParent) {
				if (!parentNode) {
					// when our fragment has been detached, we need to also detatch our children
					for (let i = 0; i < childNodes.length; i++) {
						lastParent.removeChild(childNodes[i]);
					}
				} else {
					// when our fragment has been moved/attached, we need to also attach our children
					for (let i = 0; i < childNodes.length; i++) {
						parentNode.appendChild(childNodes[i]);
					}
				}
				lastParent = parentNode;
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
			get() {
				return childNodes[0];
			},
			write: false
		});

		Object.defineProperty(base, 'lastChild', {
			get() {
				return childNodes[childNodes.length - 1];
			},
			write: false
		});

		Object.defineProperty(base, 'childNodes', {
			get() {
				return childNodes;
			},
			write: false
		});

		// TODO
		Object.defineProperty(base, 'children', {
			get() {
				return childNodes;
			},
			write: false
		});		

		return base;
	}

	return createFragmentNode;
})();