import { setup } from '../../support/setup.js';
setup();

describe(`Basic tests`, () => {
	it('Can visit the page', () => {
		cy.visit('http://localhost:8080/');
	});

	// Verify the tags show up
	it('Has correct tags visible', () => {
		cy.contains('#owncast').should('exist');
		cy.contains('#streaming').should('exist');
	});

	// it('Can open notify modal', () => {
	// 	cy.contains('Be notified').click();
	// 	cy.wait(1500);
	// 	cy.get('.ant-modal-close').click();
	// });

	// it('Can open follow modal', () => {
	// 	cy.contains('Follow').click();
	// 	cy.wait(1500);
	// 	cy.get('.ant-modal-close').click();
	// });

	// Verify content header values
	it('Has correct content header values', () => {
		cy.get('.header-title').should('have.text', 'New Owncast Server');
		cy.get('.header-subtitle').should(
			'have.text',
			'This is a new live video streaming server powered by Owncast.'
		);
	});

	it('Has correct global header values', () => {
		cy.get('#global-header-text').should('have.text', 'New Owncast Server');
	});
});
