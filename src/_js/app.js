import { registerBox } from './components/l-box.js';
import { registerCenter } from './components/l-center.js';
import { registerCluster } from './components/l-cluster.js';
import { registerContainer } from './components/l-container.js';
import { registerCover } from './components/l-cover.js';
import { registerFrame } from './components/l-frame.js';
import { registerGrid } from './components/l-grid.js';
import { registerIcon } from './components/l-icon.js';
import { registerImposter } from './components/l-imposter.js';
import { registerReel } from './components/l-reel.js';
import { registerSidebar } from './components/l-sidebar.js';
import { registerStack } from './components/l-stack.js';
import { registerSwitcher } from './components/l-switcher.js';

const app = () => {
	const support = 'customElements' in window;
	const app = document.querySelector('#app');

	if (support && app) {
		registerBox();
		registerCenter();
		registerCluster();
		registerContainer();
		registerCover();
		registerFrame();
		registerGrid();
		registerIcon();
		registerImposter();
		registerReel();
		registerSidebar();
		registerStack();
		registerSwitcher();

		document.body.appendChild(app.content, true);
	}
};

document.addEventListener('DOMContentLoaded', app);
