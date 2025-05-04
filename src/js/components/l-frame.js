const styles = `
	:host {
	  display: inline-flex;
	  flex-grow: 1;
	}

	div {
		--_n: var(--n, 16);
		--_d: var(--d, 9);
		--_f: var(--f, "cover");
		--_p: var(--p, "center");

		align-items: center;
		aspect-ratio: var(--_n) / var(--_d);
		display: flex;
	  flex-grow: 1;
	  justify-content: center;
	  overflow: crop;

		& > ::slotted(img),
		& > ::slotted(picture),
		& > ::slotted(video) {
			block-size: 100% !important;
			inline-size: 100% !important;
		}

		& > ::slotted(img),
		& > ::slotted(video) {
			object-fit: var(--_f);
			object-position: var(--_p);
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
		return ['data-fit', 'data-position', 'data-ratio'];
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

		const slot = this.shadowRoot.querySelector('slot');

		slot.addEventListener('slotchange', (e) => {
			const slot = e.target;

			if (slot.assignedNodes().length) {
				const [node] = slot
					.assignedNodes()
					.filter((node) => node.nodeType === 1);

				if (node.nodeName === 'PICTURE') {
					const img = node.querySelector('img');

					img.style.blockSize = '100%';
					img.style.inlineSize = '100%';
					img.style.objectFit = this.dataset.fit ?? 'cover';
					img.style.objectPosition = this.dataset.position ?? 'center';
				}
			}
		});
	}

	connectedCallback() {
		this.#adoptStyles(styles);
	}

	#setObjectFit(value) {
		if (value) {
			this.style.setProperty('--f', value);
		}
	}

	#setObjectPosition(value) {
		if (value) {
			this.style.setProperty('--p', value);
		}
	}

	#setRatio(ratio) {
		const [n, d] = ratio.split(':');

		if (!Number.isNaN(Number(n)) && !Number.isNaN(Number(d))) {
			this.style.setProperty('--n', Number(n));
			this.style.setProperty('--d', Number(d));
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-fit' && oldValue !== newValue) {
			this.#setObjectFit(newValue);
		}

		if (name === 'data-position' && oldValue !== newValue) {
			this.#setObjectPosition(newValue);
		}

		if (name === 'data-ratio' && oldValue !== newValue) {
			this.#setRatio(newValue);
		}
	}
}

export const registerFrame = () => {
	customElements.define('l-frame', Frame);
};
