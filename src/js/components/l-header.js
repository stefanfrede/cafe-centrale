const styles = `
	:host {
		border-block-start: 1px solid var(--surface-1) !important;
	  display: block;
		inset-block-start: -1px;
		position: sticky;
	}

	*,
	::before,
	::after {
	  box-sizing: border-box;
	}

	header {
		background-color: var(--surface-1);
		display: flex;
		flex-direction: column;
		gap: var(--grid-gutter);
		padding-block: var(--grid-gutter);

		& > a {
			display: block;
		}

		&.is-stuck {
			& > a {
				block-size: var(--space-2xl);
			}
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <header>
	  	<a href="/">
		    <slot></slot>
	  	</a>
	    <slot name="utilities"></slot>
	  </header>
	`;

class Header extends HTMLElement {
	constructor() {
		super();

		if (!this.shadowRoot) {
			this.attachShadow({ mode: 'open' });
			this.shadowRoot.append(template.content.cloneNode(true));
		}

		const options = {
		  root: null,
		  rootMargin: "0px",
		  threshold: 1.0,
		};

    const header = this.shadowRoot.querySelector('header');

		const callback = (entries) => {
		  entries.forEach((entry) => {
		    if (entry.isIntersecting) {
		      header.classList.remove('is-stuck');
		    } else {
		      header.classList.add('is-stuck');
		    }
		  });
		};

		const observer = new IntersectionObserver(callback, options);
		observer.observe(this);

	}

	#adoptStyles(styles) {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(styles);

		this.shadowRoot.adoptedStyleSheets.push(sheet);
	}

	connectedCallback() {
		this.#adoptStyles(styles);
	}
}

export const registerHeader = () => {
	customElements.define('l-header', Header);
};
