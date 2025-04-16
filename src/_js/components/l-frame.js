const styles = `
	:host {
	  display: inline-flex;
	  flex-grow: 1;
	}

	div {
		--_n: var(--n, 16);
		--_d: var(--d, 9);

		align-items: center;
		aspect-ratio: var(--_n) / var(--_d);
		display: flex;
	  flex-grow: 1;
	  justify-content: center;
	  overflow: crop;

		& > ::slotted(img),
		& > ::slotted(video) {
			block-size: 100% !important;
			inline-size: 100% !important;
			object-fit: cover;
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	    <slot></slot>
	  </div>
	`;

class Frame extends HTMLElement {
	static get observedAttributes() {
		return ['data-ratio'];
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

	#setRatio(ratio) {
		const [n, d] = ratio.split(':');

		if (!Number.isNaN(Number(n)) && !Number.isNaN(Number(d))) {
			this.style.setProperty('--n', Number(n));
			this.style.setProperty('--d', Number(d));
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-ratio' && oldValue !== newValue) {
			this.#setRatio(newValue);
		}
	}
}

export const registerFrame = () => {
	customElements.define('l-frame', Frame);
};
