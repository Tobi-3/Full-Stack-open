// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
    cy.visit('')
  })
})

Cypress.Commands.add('logout', () => {
  cy.clearLocalStorage('loggedBlogappUser')
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/blogs`,
    method: 'POST',
    body: { title, author, url, likes },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })
})

Cypress.Commands.add('createUser', ({ username, name, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/users/`, { username, name, password })

})

Cypress.Commands.add('createMyUsers', () => {
  const mluukkai = {
    name: 'Matti Luukkainen',
    username: 'mluukkai',
    password: 'salainen'
  }
  const hellas = {
    name: 'Artos Hellas',
    username: 'hellas',
    password: 'swordfish'
  }

  cy.request('POST', `${Cypress.env('BACKEND')}/users/`, mluukkai)
  cy.request('POST', `${Cypress.env('BACKEND')}/users/`, hellas)
})