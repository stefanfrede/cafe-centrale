const styles = `
	:host {
	  display: block;
	}

	div {
		--_space: var(--space, var(--grid-gutter));

		align-items: center;
		display: flex;
	  flex-wrap: wrap;
	  gap: var(--_space);
		justify-content: flex-start;

	  &.items-start {
			align-items: flex-start;
		}

		&.items-end {
			align-items: flex-end;
		}

		&.items-center {
			align-items: center;
		}

		&.items-baseline {
			align-items: baseline;
		}

		&.items-stretch {
			align-items: stretch;
		}

	  &.justify-start {
			justify-content: flex-start;
		}

	  &.justify-end {
			justify-content: flex-end;
		}

	  &.justify-center {
			justify-content: center;
		}

	  &.justify-between {
			justify-content: space-between;
		}

	  &.justify-around {
			justify-content: space-around;
		}

	  &.justify-evenly {
			justify-content: space-evenly;
		}

	  &.justify-stretch {
			justify-content: stretch;
		}

	  &.justify-baseline {
			justify-content: baseline;
		}

	  &.justify-normal {
			justify-content: normal;
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	    <slot></slot>
	  </div>
	`;

class Cluster extends HTMLElement {
	static get observedAttributes() {
		return ['data-align', 'data-justify'];
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
		const classes = div.classList;
		const [id] = name.split('-');

		for (const c of classes) {
			if (c.startsWith(id)) {
				div.classList.remove(c);
			}
		}

		div.classList.add(name);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-align') {
			this.#addClass(`items-${newValue}`);
		}

		if (name === 'data-justify' && oldValue !== newValue) {
			this.#addClass(`justify-${newValue}`);
		}
	}
}

export const registerCluster = () => {
	customElements.define('l-cluster', Cluster);
};
