import { Temporal } from '@js-temporal/polyfill';

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

import { registerHeader } from './components/p-header.js';
import { registerNavigation } from './components/p-navigation.js';

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
		registerHeader();
		registerIcon();
		registerImposter();
		registerNavigation();
		registerReel();
		registerSidebar();
		registerStack();
		registerSwitcher();

		const dt = Temporal.Now.zonedDateTimeISO();
		const dayOfWeek = dt.dayOfWeek;
		const hour = dt.hour;

		const baseUrl = new URL(location.href);
		const params = baseUrl.searchParams;
		const menu = params.get('menu');

		const nodes = {
			menuLunch: {
				link: app.content.querySelector('.menu-lunch'),
				section: app.content.getElementById('menu-lunch'),
			},
			menuDinner: {
				link: app.content.querySelector('.menu-dinner'),
				section: app.content.getElementById('menu-dinner'),
			},
		};

		const addHidden = (node) => {
			if (node) {
				node.setAttribute('hidden', '');
			}
		};

		const removeHidden = (node) => {
			if (node) {
				node.removeAttribute('hidden');
			}
		};

		const show = (id) => {
			for (const [key, value] of Object.entries(nodes)) {
				if (key === id) {
					for (const node of Object.values(value)) {
						removeHidden(node);
					}
				}
			}
		};

		const hide = (id) => {
			for (const [key, value] of Object.entries(nodes)) {
				if (key === id) {
					for (const node of Object.values(value)) {
						addHidden(node);
					}
				}
			}
		};

		const menuLunch =
			(dayOfWeek < 6 && hour >= 12 && hour < 16) ||
			menu === 'lunch' ||
			menu === 'all';

		const menuDinner =
			(dayOfWeek === 6 && hour >= 12 && hour < 20) ||
			((dayOfWeek === 4 || dayOfWeek === 5) && hour >= 16 && hour < 22) ||
			menu === 'dinner' ||
			menu === 'all';

		if (menuLunch || menuDinner) {
			if (menuLunch) {
				show('menuLunch');
			} else {
				hide('menuLunch');
			}

			if (menuDinner) {
				show('menuDinner');
			} else {
				hide('menuDinner');
			}
		} else {
			hide('menuDinner');
			hide('menuLunch');
		}

		document.body.appendChild(app.content, true);
	}
};

document.addEventListener('DOMContentLoaded', app);
