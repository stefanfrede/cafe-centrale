const styles = `
	:host {
	  container: navigation / inline-size;
	  display: block;
	}

	*,
	::before,
	::after {
	  box-sizing: border-box;
	}

	div {
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: var(--grid-gutter);
		position: relative;
	}

	nav {
		background-color: var(--btn-bg);
	  border: var(--border-thin) solid var(--btn-border);
	  border-radius: var(--radius-sm);
		display: flex;
		inset-block-start: calc(100% + var(--grid-gutter));
		justify-content: center;
	  padding-block: var(--space-xs);
	  padding-inline: var(--space-s);
		position: absolute;

		&::after {
			block-size: 0;
			border: var(--space-s) solid transparent;
			border-block-end-color: var(--btn-border);
			border-block-start: 0;
			content: '';
			inline-size: 0;
			inset-block-start: 0;
			inset-inline-start: 50%;
			margin-block-start: calc(var(--space-s) * -1);
			margin-inline-start: calc(var(--space-s) * -1);
			position: absolute;
		}

		&[hidden] {
			display: none;
		}

		& > ::slotted(ul) {
			display: grid;
			gap: var(--grid-gutter);
			grid-template-columns: repeat(2, 1fr);
		  grid-template-rows: 1fr 1fr 1fr;
		  grid-auto-flow: column;
			list-style: none;
			padding-inline-start: 0 !important;
		}
	}

	@container navigation (width >= 768px) {
		::slotted(button) {
			display: none !important;
		}

		nav {
			background-color: transparent;
			border: none;
			display: flex !important;
			padding: 0;
			position: initial;
			inset-block-start: initial;

			&::after {
				content: none;
			}

			& > ::slotted(ul) {
				align-items: center;
				display: inline-flex;
				justify-content: center;
			}
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
		<div>
	    <slot></slot>
		  <nav>
		    <slot name="nav"></slot>
		  </nav>
		</div>
	`;

class Navigation extends HTMLElement {
	#nav;

	constructor() {
		super();

		if (!this.shadowRoot) {
			this.attachShadow({ mode: 'open' });
			this.shadowRoot.append(template.content.cloneNode(true));

			this.#nav = this.shadowRoot.querySelector('nav');
			this.#nav.setAttribute('hidden', '');
		}
	}

	#adoptStyles(styles) {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(styles);

		this.shadowRoot.adoptedStyleSheets.push(sheet);
	}

	connectedCallback() {
		this.#adoptStyles(styles);

		const btnSlot = this.shadowRoot.querySelector('div > slot');
		const navSlot = this.shadowRoot.querySelector('nav > slot');

		btnSlot.addEventListener('slotchange', (e) => {
			const slot = e.target;

			if (slot.assignedNodes().length) {
				const [button] = slot
					.assignedNodes()
					.filter((node) => node.nodeType === 1);

				button.setAttribute('aria-expanded', 'false');

				button.addEventListener('click', (e) => {
					e.preventDefault();

					const t = e.target;
					const f = t.getAttribute('aria-expanded');
					const isExpanded = f === 'true';

					t.setAttribute(
						'aria-expanded',
						isExpanded ? 'false' : 'true'
					);

					if (isExpanded) {
						this.#nav.setAttribute('hidden', '');
					} else {
						this.#nav.removeAttribute('hidden');

					}
				});
			}
		});

		navSlot.addEventListener('slotchange', (e) => {
			const slot = e.target;

			if (slot.assignedNodes().length) {
				const [ul] = slot
					.assignedNodes()
					.filter((node) => node.nodeType === 1);

				const links = ul.querySelectorAll('a');

				for (const link of links) {
					link.addEventListener('click', (e) => {
						e.preventDefault();

						const id = link.getAttribute('href');

						globalThis.getElementById(id).scrollIntoView();
					});
				}
			}
		});
	}
}

export const registerNavigation = () => {
	customElements.define('p-navigation', Navigation);
};
