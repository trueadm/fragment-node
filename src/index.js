function createFragmentNode() {
	// we can either use a comment or a text node?
	// we just need something that is not an element (affects styling and has issues with tables)
	// we cannot use docFrags as they do not actually get inserted into the DOM tree
	const base = document.createComment('');
	const childNodes = [];
	let lastParent;
	let lastNextSibling;

	// as TextNodes do not have appendChild (as they don't have children), we make one
	base.appendChild = node => {
		childNodes.push(node);
		const parentNode = base.parentNode;

		if (parentNode) {
			parentNode.insertBefore(node, base);
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
		const nextSibling = base.nextSibling;
		let hasMoved = false;

		if (parentNode !== lastParent) {
			if (!parentNode) {
				// when our fragment has been detached, we need to also detatch our children
				for (let i = 0; i < childNodes.length; i++) {
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
			for (let i = 0; i < childNodes.length; i++) {
				parentNode.insertBefore(childNodes[i], base);
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

export default {
	createFragmentNode
};