const styles = `
	:host {
	  display: inline-flex;
	}

	div {
		--_size: var(--size, 1lh);
		--_space: var(--space, 0.5cap);

	  &.with-icon {
		  align-items: center;
	  	display: inline-flex;
		  gap: var(--_space);
	  }

		& > ::slotted(svg) {
			block-size: var(--_size) !important;
			inline-size: auto !important;
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	    <slot></slot>
	  </div>
	`;

class Icon extends HTMLElement {
	static get observedAttributes() {
		return ['data-label', 'data-with-icon'];
	}

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

	#addClass(name) {
		const div = this.shadowRoot.querySelector('div');
		div.classList.add(name);
	}

	#addLabel(label) {
		this.setAttribute('aria-label', label);
		this.setAttribute('role', 'img');
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-label' && oldValue !== newValue) {
			this.#addLabel(newValue);
		}

		if (name === 'data-with-icon' && oldValue !== newValue) {
			this.#addClass('with-icon');
		}
	}
}

export const registerIcon = () => {
	customElements.define('l-icon', Icon);
};
