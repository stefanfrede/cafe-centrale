const styles = `
	:host {
	  display: flex;
	  flex-grow: 1;
	}

	div {
		--_space: var(--space, var(--grid-gutter));

		display: flex;
	  flex-direction: column;
	  flex-grow: 1;
	  justify-content: flex-start;

	  &:not(.is-recursive) {
			& > ::slotted(:not(*:first-child)) {
			  margin-block-start: var(--_space) !important;
			}
	  }

	  &.is-recursive {
			& ::slotted(:not(*:first-child)) {
			  margin-block-start: var(--_space) !important;
			}
	  }
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	    <slot></slot>
	  </div>
	`;

class Stack extends HTMLElement {
	#nodes = [];
	#splitAfterNode = 0;

	static get observedAttributes() {
		return ['data-recursive', 'data-split-after'];
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
		if (this.#splitAfterNode && this.#nodes.length) {
			if (this.#splitAfterNode < this.#nodes.length) {
				this.#nodes[this.#splitAfterNode - 1].style.marginBlockEnd = 'auto';
			}
		}
	}

	#addClass(name) {
		const div = this.shadowRoot.querySelector('div');
		div.classList.add(name);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-recursive' && oldValue !== newValue) {
			this.#addClass('is-recursive');
		}

		if (name === 'data-split-after' && oldValue !== newValue) {
			this.#splitAfterNode = newValue;

			this.#update();
		}
	}
}

export const registerStack = () => {
	customElements.define('l-stack', Stack);
};
