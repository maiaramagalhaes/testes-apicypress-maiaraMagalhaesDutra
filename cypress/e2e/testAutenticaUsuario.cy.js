import { faker, id_ID } from '@faker-js/faker';

describe('Teste de Autenticar Usuário', () => {

  const nomeUsuario = faker.internet.userName();
  const emailUsuario = faker.internet.email();
  let idUsuario
  let token

  before(() => {
    //criar um usuario para o teste de autenticacao
    cy.request({
      method: 'POST',
      url: '/users',
      body: { "name": nomeUsuario, "email": emailUsuario, "password": "123456" }

    }).then((response) => {
      idUsuario = (response.body.id)
      expect(response.status).to.equal(201)
    })

  })

  it('autenticar um usuario com sucesso', () => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: { "email": emailUsuario, "password": "123456" }

    }).then((response) => {
      token = response.body.accessToken
      expect(response.status).to.equal(200)
    })
  })

  it('autenticar um usuario sem sucesso', () => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      failOnStatusCode: false,
      body: { "email": emailUsuario, "password": "12345" }

    }).then((response) => {
         expect(response.status).to.equal(401)
         expect(response.body.message).includes('Invalid username or password')

    })
  })

  it('autenticar um usuario nao cadastrado', () => {
    cy.request({
      method: 'POST',
      url: 'auth/login',
      failOnStatusCode: false,
      body: { "email": "maia@raro.com", "password": "123456" }

    }).then((response) => {
       expect(response.status).to.equal(401)
       expect(response.body.message).includes('Invalid username or password.')

    })
  })

  it('autenticar um usuario com email invalido', () => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      failOnStatusCode: false,
      body: { "email": "email", "password": "12345" }

    }).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).includes('email must be an email')
    })
  })

  after(() => {
    //transforma o usuario logado em adm e exclui o usuario
      const idUsuarioString = idUsuario.toString()
      const acessToken = 'Bearer ' + token

       cy.request({
          method: 'PATCH',
          url: '/users/admin',
          headers: {'Authorization': acessToken}
          }).then((response) => {
         expect(response.status).to.equal(204) 
         cy.deletarUsuario(idUsuarioString, acessToken)
        })
      
  })
})