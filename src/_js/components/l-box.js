const styles = `
	:host {
	  display: flex;
	  flex-grow: 1;
	}

	div {
		--_border-width: var(--border-width, var(--border-thin));
		--_padding: var(--padding, var(--space-m));

	  background-color: var(--surface-2);
		border: var(--_border-width) solid;
	  color: var(--text-1);
	  flex-grow: 1;
	  padding: var(--_padding);

		@media (prefers-contrast: more) {
		  outline: var(--_border-width) solid transparent;
		  outline-offset: calc(var(--_border-width) * -1);
		}

		& > ::slotted(*) {
		  color: inherit;
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	    <slot></slot>
	  </div>
	`;

class Box extends HTMLElement {
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

export const registerBox = () => {
	customElements.define('l-box', Box);
};
