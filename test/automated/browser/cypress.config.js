const { defineConfig } = require('cypress');
const { lighthouse, prepareAudit } = require('@cypress-audit/lighthouse');

module.exports = defineConfig({
	projectId: 'wwi3xe',
	e2e: {
		supportFile: 'cypress/support/e2e.js',
		setupNodeEvents(on, config) {
			on('before:browser:launch', (browser = {}, launchOptions) => {
				prepareAudit(launchOptions);
			});

			on('task', {
				lighthouse: lighthouse(),
			});
		},
	},
	retries: 3,
});
