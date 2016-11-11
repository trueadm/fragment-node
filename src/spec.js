import { createFragmentNode } from './index';

function createDiv(text) {
	const div = document.createElement('div');

	div.textContent = text;
	return div;
}

describe('FragmentNode', () => {
	let container;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
	});
	afterEach(() => {
		document.body.removeChild(container);
		container = null;
	});

	it('before attached: appendChild, removeChild, insertBefore', done => {
		const frag = createFragmentNode();

		frag.appendChild(createDiv('Example works!'));

		container.appendChild(frag);

		// as we use MutationObserver, this is async
		setTimeout(() => {
			expect(container.childNodes.length).to.equal(2);
			expect(container.innerHTML).to.equal(
				`<div>Example works!</div><!---->`
			);
			done();
		}, 10);
	});
});