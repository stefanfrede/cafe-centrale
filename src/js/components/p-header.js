const styles = `
	:host {
	  container: header / inline-size;
	  display: block;
	}

	*,
	::before,
	::after {
	  box-sizing: border-box;
	}

	header {
		backdrop-filter: blur(8px);
		background-color: color-mix(in oklab, var(--surface-1) 75%, transparent);
		display: flex;
		flex-direction: column;
		gap: var(--grid-gutter);
		padding-block: var(--grid-gutter);

		& > a {
			display: block;
		}
	}

	@container header (width >= 768px) {
		:host(.is-stuck) a {
			block-size: var(--space-2xl);
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <header>
	  	<a href="/">
		    <slot></slot>
	  	</a>
	    <slot name="navigation"></slot>
	  </header>
	`;

class Header extends HTMLElement {
	constructor() {
		super();

		if (!this.shadowRoot) {
			this.attachShadow({ mode: 'open' });
			this.shadowRoot.append(template.content.cloneNode(true));
			this.#createScrollToTop();
			this.#createSentinel();
		}
	}

	#adoptStyles(styles) {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(styles);

		this.shadowRoot.adoptedStyleSheets.push(sheet);
	}

	#createScrollToTop() {
		const a = this.shadowRoot.querySelector('a');

		a.addEventListener('click', (e) => {
			e.preventDefault();

			globalThis.scrollTo({
				top: 0,
			});
		});
	}

	#createSentinel() {
		const body = globalThis.document.body;
		const div = globalThis.document.createElement('div');

		div.style.blockSize = '1px';
		div.style.insetBlockStart = '0';
		div.style.insetInline = '0';
		div.style.position = 'absolute';

		body.prepend(div);

		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 1.0,
		};

		const callback = (entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					this.classList.remove('is-stuck');
				} else {
					this.classList.add('is-stuck');
				}
			}
		};

		const observer = new IntersectionObserver(callback, options);
		observer.observe(div);
	}

	connectedCallback() {
		this.#adoptStyles(styles);
	}
}

export const registerHeader = () => {
	customElements.define('p-header', Header);
};
