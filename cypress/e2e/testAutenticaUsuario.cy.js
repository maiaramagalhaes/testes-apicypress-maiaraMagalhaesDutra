import { faker, id_ID } from '@faker-js/faker';

describe('Teste de Autenticar Usuário', () => {

  let email;
  let password = "123456";
  let idUsuario = null;
  let token = null;

  before(() => {
    //criar um usuario para o teste de autenticacao
    cy.criarUsuario().then((dados) => {
    email = dados.body.email
    idUsuario = dados.body.id
    })

  })

  it('autenticar um usuario com sucesso', () => {
    cy.autenticarUsuario(email, password).then((dadosLogin) => {
        expect(dadosLogin.status).to.equal(200)
        token = dadosLogin.body.accessToken
      })

  })

 after(() => {
    //transforma o usuario logado em adm e exclui o usuario
      const idUsuarioString = idUsuario.toString();
      const accessToken = 'Bearer ' + token;
       cy.promoverAdm(token).then((response) => {
         expect(response.status).to.equal(204) 
         cy.deletarUsuario(idUsuarioString, accessToken)
        })
      
  }) 
})
  describe('Testes de autenticar o usuario sem sucesso', function(){

     const emailUsuario = faker.internet.email();
     

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

  })