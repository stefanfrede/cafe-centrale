const styles = `
	:host {
	  display: flex;
	  flex-grow: 1;
	}

	div {
		--_space: var(--space, var(--grid-gutter));
		--_threshold: var(--threshold, 30rem);

		display: flex;
	  flex-grow: 1;
		flex-wrap: wrap;
		gap: var(--_space);

		& > ::slotted(*) {
			flex-grow: 1;
			flex-basis: calc((var(--_threshold) - 100%) * 999);
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	    <slot></slot>
	  </div>
	`;

class Switcher extends HTMLElement {
	#nodes = [];
	#limit = 4;

	static get observedAttributes() {
		return ['data-limit'];
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

		const slot = this.shadowRoot.querySelector('slot');

		slot.addEventListener('slotchange', (e) => {
			const slot = e.target;

			if (slot.assignedNodes().length) {
				this.#nodes = slot
					.assignedNodes()
					.filter((node) => node.nodeType === 1);

				this.#update();
			}
		});
	}

	#update() {
		if (this.#nodes.length) {
			for (const [index, node] of this.#nodes.entries()) {
				if (index >= this.#limit) {
					node.style.flexBasis = '100%';
				}
			}
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-limit' && oldValue !== newValue) {
			this.#limit = newValue;

			this.#update();
		}
	}
}

export const registerSwitcher = () => {
	customElements.define('l-switcher', Switcher);
};
