// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'GreenGrant',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/unideb-advanced-software-engineering/26-tavasz-02-greengrant' }],
			sidebar: [
				{
					label: 'General',
					autogenerate: { directory: 'general' },
				},
				{
					label: 'ADRs',
					autogenerate: { directory: 'adrs' },
				},
			],
		}),
	],
});
