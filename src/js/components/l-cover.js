const styles = `
	:host {
	  display: flex;
	  flex-grow: 1;
	}

	*,
	::before,
	::after {
	  box-sizing: border-box;
	}

	.cover {
		--_space: var(--space, var(--grid-gutter));
		--_min-height: var(--min-height, 100dvh);

		display: flex;
		flex-direction: column;
	  flex-grow: 1;
	  min-block-size: var(--_min-height);
		padding: var(--_space);

		&.no-padding {
			padding: 0;
		}

		& > div {
			display: none;

			&.has-content {
				display: block;
			}

			&.header.has-content {
				margin-block: 0 var(--_space);
			}

			&.main.has-content {
				margin-block: auto;
			}

			&.footer.has-content {
				margin-block: var(--_space) 0;
			}
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div class="cover">
	  	<div class="header">
		    <slot name="header"></slot>
		  </div>
	  	<div class="main">
		    <slot name="main"></slot>
		  </div>
	  	<div class="footer">
		    <slot name="footer"></slot>
		  </div>
	  </div>
	`;

class Cover extends HTMLElement {
	static get observedAttributes() {
		return ['data-no-pad'];
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

		const slots = this.shadowRoot.querySelectorAll('slot');

		for (const slot of slots) {
			slot.addEventListener('slotchange', (e) => {
				const slot = e.target;

				if (slot.assignedNodes().length) {
					slot.parentElement.classList.add('has-content');
				}
			});
		}
	}

	#addClass(name) {
		const div = this.shadowRoot.querySelector('div');
		div.classList.add(name);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-no-pad' && oldValue !== newValue) {
			this.#addClass('no-padding');
		}
	}
}

export const registerCover = () => {
	customElements.define('l-cover', Cover);
};
