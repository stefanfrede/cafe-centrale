const styles = `
	:host {
	  container: the-reel / inline-size;
	  display: flex;
	  flex-grow: 1;
	}

	div {
		--_height: var(--height, auto);
		--_space: var(--space, var(--grid-gutter));

		border: var(--border-thin) solid;
		block-size: var(--_height);
		display: flex;
	  flex-grow: 1;
		gap: var(--_space);
		overflow-x: auto;
		overscroll-behavior-x: contain;
		padding: var(--_space);
	  scroll-snap-align: center;
		scroll-snap-stop: always;
		scroll-snap-type: x mandatory;

		&.no-bar {
			scrollbar-width: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}

		&:not(.no-bar) {
		  scrollbar-color: var(--text-1) var(--surface-1);

		  &::-webkit-scrollbar {
			  block-size: var(--space-xs);
			}

			&::-webkit-scrollbar-track {
			  background-color: var(--surface-1);
			}

			&::-webkit-scrollbar-thumb {
			  background-color: var(--surface-1);
			  background-image:
			  	linear-gradient(
			  		var(--surface-1) 0,
				  	var(--surface-1) 0.25rem,
				  	var(--text-1) 0.25rem,
				  	var(--text-1) 0.75rem,
				  	var(--surface-1) 0.75rem
				  );
			}
		}

		& > ::slotted(*) {
			flex: 0 0 auto;
			scroll-snap-align: center;
		}

		& > ::slotted(l-frame) {
			block-size: 100%;
			flex-basis: auto;
			inline-size: auto;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		div {
			scroll-behavior: smooth;
		}
	}
`;

const template = document.createElement('template');
template.innerHTML = `
	  <div>
	    <slot></slot>
	  </div>
	`;

class Reel extends HTMLElement {
	static get observedAttributes() {
		return ['data-no-bar', 'data-displayed-items'];
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
				const nodes = slot
					.assignedNodes()
					.filter((node) => node.nodeType === 1);

				slot.parentElement.setAttribute('role', 'list');
				slot.parentElement.setAttribute('aria-label', 'slider');
				slot.parentElement.setAttribute('tabindex', '0');

				const observer = this.#observePanels(slot.parentElement);

				for (const [index, node] of nodes.entries()) {
					node.setAttribute('role', 'listitem');
					node.setAttribute('data-index', index);

					observer.observe(node);
				}
			}
		});
	}

	#observePanels(track) {
		const options = {
			root: track,
			rootMargin: '0px',
			threshold: 1.0,
		};

		const callback = (entries) => {
			for (const entry of entries) {
				const panel = entry.target;

				if (entry.isIntersecting) {
					if (entry.intersectionRatio >= 0.75) {
						panel.classList.add('is-visible');
					}
				} else {
					panel.classList.remove('is-visible');
				}
			}
		};

		return new IntersectionObserver(callback, options);
	}

	#addClass(name) {
		const div = this.shadowRoot.querySelector('div');
		div.classList.add(name);
	}

	#setItemWidth(items) {
		const styles = `
			@container the-reel (width < 1240px) {
				div > ::slotted(*) {
					flex-basis: 100% !important;
				}
			}

			@container the-reel (width >= 1240px) {
				div > ::slotted(*) {
					flex-basis: calc(100% / ${items} - ((var(--_space) * ${items - 1}) / ${items})) !important;
				}
			}
		`;

		this.#adoptStyles(styles);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-no-bar' && oldValue !== newValue) {
			this.#addClass('no-bar');
		}

		if (name === 'data-displayed-items' && oldValue !== newValue) {
			this.#setItemWidth(newValue);
		}
	}
}

export const registerReel = () => {
	customElements.define('l-reel', Reel);
};
