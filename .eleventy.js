import pluginWebc from '@11ty/eleventy-plugin-webc';

import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	eleventyConfig.addPlugin(pluginWebc, {
		components: './src/_components/**/*.webc',
	});

	eleventyConfig.addPlugin(eleventyImageTransformPlugin);

	eleventyConfig.addBundle('css');
	eleventyConfig.addBundle('js');

	eleventyConfig.addPassthroughCopy({
		'./src/_js/': '/',
	});

	eleventyConfig.addPassthroughCopy({
		'./src/_public/': '/',
	});

	eleventyConfig.addWatchTarget('./src/_css/**/*.css');

	eleventyConfig.setServerOptions({
		https: {
			key: './_mkcert/localhost-key.pem',
			cert: './_mkcert/localhost.pem',
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
