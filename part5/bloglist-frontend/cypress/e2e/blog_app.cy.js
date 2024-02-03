describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    // create here a user to backend
    cy.createMyUsers()
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {

      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-btn').click()

      cy.contains('blogs')
      cy.contains('Logged in as mluukkai')
      cy.contains('logout')
      cy.contains('new blog')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-btn').click()

      cy.contains('username')
      cy.contains('password')
      cy.contains('login')

      cy.get('#notification')
        .should('contain', 'invalid password or username')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Logged in as mluukkai')
    })

    describe('When logged in', function () {
      beforeEach(function () {
        // log in user here
        cy.login({ username: 'mluukkai', password: 'salainen' })
      })

      it('A blog can be created', function () {
        cy.contains('new blog').click()
        cy.contains('create new blog')
        cy.contains('cancel')

        cy.get('#title').type('Title')
        cy.get('#author').type('Author')
        cy.get('#url').type('Url')
        cy.get('#create-btn').click()

        cy.get('#blogs').children('div')
          .should('contain', 'Title Author')
          .and('contain', 'view')
          .and('contain', 'delete post')
      })

      describe('and a blogs exists', () => {
        beforeEach(function () {
          cy.createBlog({ title: 'Title', author: 'Author', url: 'Url' })
          cy.visit('')
        })

        it('a blog can be liked', function () {
          cy.get('#blogs').children('div').as('blog')
          cy.get('@blog').contains('view').click()

          cy.contains('likes: 0')
          cy.get('#likeButton').click()
          cy.contains('likes: 1')
        })

        it('user who created blog can delete it', function () {
          cy.get('#blogs').children().should('exist')
          cy.contains('view').click()
          cy.contains('delete').click()

          cy.get('#blogs').children().should('not.exist')
        })

        it('only the blog creator can see the delete button', function () {
          cy.logout()
          cy.login({ username: 'hellas', password: 'swordfish' })
          cy.visit('')

          cy.get('#blogs').children('div').as('blog')
          cy.get('@blog').contains('view').click()
          cy.get('@blog')
            .should('not.contain', 'delete')

          cy.contains('likes: 0')
        })
      })

      it('blogs are ordered according to most likes can see the delete button', function () {
        cy.createBlog({ title: 'third highest likes', author: 'author', url: 'url.de', likes: '30' })
        cy.createBlog({ title: 'highest likes', author: 'author', url: 'url.de', likes: '100' })
        cy.createBlog({ title: 'second highest likes', author: 'author', url: 'url.de', likes: '42' })
        cy.visit('')

        cy.get('#blogs').children().as('blogs')
        cy.get('@blogs').eq(0).should('contain', 'highest likes')
        cy.get('@blogs').eq(1).should('contain', 'second highest likes')
        cy.get('@blogs').eq(2).should('contain', 'third highest likes')
      })
    })
  })
})