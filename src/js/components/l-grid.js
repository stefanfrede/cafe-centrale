const styles = `
	:host {
	  display: flex;
	  flex-grow: 1;
	}

	div {
		--_min: var(--min, 15rem);
		--_space: var(--space, var(--grid-gutter));

		display: grid;
	  flex-grow: 1;
		gap: var(--_space);
		grid-template-columns: repeat(auto-fit, minmax(min(var(--_min), 100%), 1fr));
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	    <slot></slot>
	  </div>
	`;

class Grid extends HTMLElement {
	constructor() {
		super();

		if (!this.shadowRoot) {
			this.attachShadow({ mode: 'open' });
			this.shadowRoot.append(template.content.cloneNode(true));
		}
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

export const registerGrid = () => {
	customElements.define('l-grid', Grid);
};
