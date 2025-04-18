const styles = `
	:host {
	  display: flex;
	  flex-grow: 1;
	}

	div {
		--_content-min: var(--content-min, 50%);
		--_space: var(--space, var(--grid-gutter));
		--_side-width: var(--side-width, auto);

		display: flex;
	  flex-grow: 1;
		flex-wrap: wrap;
		gap: var(--_space);

		&:not(.is-right) {
			& > :first-child {
			  flex-basis: var(--_side-width);
			  flex-grow: 1;
			}

			& :last-child {
			  flex-basis: 0;
			  flex-grow: 999;
			  min-inline-size: var(--_content-min);
			}

			&.no-stretch {
				& > :first-child {
					align-items: flex-start;
				}
			}
		}

		&.is-right {
			& > :first-child {
			  flex-basis: 0;
			  flex-grow: 999;
			  min-inline-size: var(--_content-min);
			}

			& :last-child {
			  flex-basis: var(--_side-width);
			  flex-grow: 1;
			}

			&.no-stretch {
				& > :last-child {
					align-items: flex-start;
				}
			}
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	  	<div>
		    <slot name="sidebar"></slot>
		  </div>
	  	<div>
		    <slot></slot>
		  </div>
	  </div>
	`;

class Sidebar extends HTMLElement {
	static get observedAttributes() {
		return ['data-side', 'data-no-stretch'];
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
		if (name === 'data-side' && oldValue !== newValue) {
			this.#addClass('is-right');
		}

		if (name === 'data-no-stretch' && oldValue !== newValue) {
			this.#addClass('no-stretch');
		}
	}
}

export const registerSidebar = () => {
	customElements.define('l-sidebar', Sidebar);
};
