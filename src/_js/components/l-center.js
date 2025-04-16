const styles = `
	:host {
	  display: block;
	}

	div {
		--_gutters: var(--gutters, var(--grid-gutters));
		--_measure: var(--measure, var(--measure-3));

	  margin-inline: auto;
	  max-inline-size: var(--_measure);

		&.center-elements {
		  align-items: center;
			display: flex;
		  flex-direction: column;
		}

		&.center-text {
			text-align: center;
		}

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

class Center extends HTMLElement {
	static get observedAttributes() {
		return ['data-and-text', 'data-gutters', 'data-intrinsic'];
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
		if (name === 'data-and-text' && oldValue !== newValue) {
			this.#addClass('center-text');
		}

		if (name === 'data-gutters' && oldValue !== newValue) {
			this.#addClass('has-gutters');
		}

		if (name === 'data-intrinsic' && oldValue !== newValue) {
			this.#addClass('center-elements');
		}
	}
}

export const registerCenter = () => {
	customElements.define('l-center', Center);
};
