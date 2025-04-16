const styles = `
	:host {
	  display: block;
	}

	div {
		--_gutters: var(--gutters, var(--grid-gutter));
		--_measure: var(--measure, var(--grid-max-width));

	  margin-inline: auto;
	  max-inline-size: var(--_measure);

		&.has-gutters {
		  padding-inline: var(--_gutters);
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	    <slot></slot>
	  </div>
	`;

class Container extends HTMLElement {
	static get observedAttributes() {
		return ['data-gutters'];
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

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-gutters' && oldValue !== newValue) {
			this.#addClass('has-gutters');
		}
	}
}

export const registerContainer = () => {
	customElements.define('l-container', Container);
};
