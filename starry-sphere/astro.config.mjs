// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'GreenGrant Documentation',
			description: 'Documentation for the GreenGrant platform: specifications, architecture, and design decisions.',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/unideb-advanced-software-engineering/26-tavasz-02-greengrant' }],
			sidebar: [
				{
					label: 'Overview',
					autogenerate: { directory: 'general' },
				},
				{
					label: 'Specifications',
					autogenerate: { directory: 'specification' },
				},
				{
					label: 'Architecture',
					items: [
						{ label: 'Architecture Styles', slug: 'architecture/styles' },
					],
					autogenerate: { directory: 'architecture/adrs' },
				},
				{
					label: 'Decisions (ADRs)',
					autogenerate: { directory: 'adrs' },
				},
			],
		}),
	],
});
