const styles = `
	:host {
		--_margin: var(--margin, 0);

	  display: block;
	  inset: 0;
	}

	:host(:not([data-fixed])) {
	  position: absolute;
	}

	:host([data-fixed]) {
	  position: fixed;
	}

	div {
	  inset-block-start: 50%;
	  inset-inline-start: 50%;
	  transform: translate(-50%, -50%);

		&.is-fixed {
		  position: fixed;
		}

		&:not(.is-fixed) {
		  position: absolute;
		}

	  &:not(.no-restrictions) > ::slotted(*) {
		  max-block-size: calc(100% - (var(--_margin) * 2));
		  max-inline-size: calc(100% - (var(--_margin) * 2));
		  overflow: auto;
	  }
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	    <slot></slot>
	  </div>
	`;

class Imposter extends HTMLElement {
	static get observedAttributes() {
		return ['data-breakout', 'data-fixed'];
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
		if (name === 'data-breakout' && oldValue !== newValue) {
			this.#addClass('no-restrictions');
		}

		if (name === 'data-fixed' && oldValue !== newValue) {
			this.#addClass('is-fixed');
		}
	}
}

export const registerImposter = () => {
	customElements.define('l-imposter', Imposter);
};
