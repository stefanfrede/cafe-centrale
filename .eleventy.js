import pluginWebc from '@11ty/eleventy-plugin-webc';
import pluginVite from '@11ty/eleventy-plugin-vite';

import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	eleventyConfig.addPlugin(pluginWebc, {
		components: './src/_components/**/*.webc',
	});

	eleventyConfig.addPlugin(eleventyImageTransformPlugin);

	eleventyConfig.addPassthroughCopy('src/css');
	eleventyConfig.addPassthroughCopy('src/js');

	eleventyConfig.addPassthroughCopy({
		'./src/_public/': '/',
	});

	eleventyConfig.addPlugin(pluginVite, {
		serverOptions: {
			watch: ['./src/css/**/*.css', './src/js/**/*.js'],
			https: {
				key: './_mkcert/localhost-key.pem',
				cert: './_mkcert/localhost.pem',
			},
		},

		viteOptions: {
			css: {
				transformer: 'lightningcss',
				lightningcss: {
					targets: browserslistToTargets(browserslist('>= 0.25%')),
				},
			},

			build: {
				cssMinify: 'lightningcss',
				minify: 'terser',
			},

			server: {
				allowedHosts: true,
			},
		},
	});
}

export const config = {
	templateFormats: ['html', 'md', 'webc'],
	markdownTemplateEngine: 'webc',
	htmlTemplateEngine: 'webc',
	dir: {
		input: 'src',
		layouts: '_layouts',
	},
};
