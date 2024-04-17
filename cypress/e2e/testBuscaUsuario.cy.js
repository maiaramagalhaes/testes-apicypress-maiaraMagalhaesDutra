import { faker, id_ID } from '@faker-js/faker';

describe('Teste de Buscar Usuário', () => {

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
        
        cy.request({
           method: 'POST',
           url: '/auth/login',
           body: { "email": emailUsuario, "password": "123456" }
          
        }).then((response) => {
           token = response.body.accessToken
          expect(response.status).to.equal(200)
        })

    }) 

  

    it('buscar um usuario por id com sucesso', () => {

      const idUsuarioString = idUsuario.toString()
      const accessToken = 'Bearer ' + token
         cy.request({
          method: 'GET',
          url: '/users/' + idUsuarioString,
          headers: {'Authorization': accessToken}
        
        }).then((response) => {
          expect(response.status).to.equal(200)

        })
    })
    
    it('buscar um usuario sem tem ter autenticado', () => {
      cy.request({
            method: 'GET',
            url: '/users/' + idUsuario,
            failOnStatusCode: false      
      }).then((response) => {
       expect(response.status).to.equal(401)
       expect(response.body.message).includes('Access denied')

      })
    
    })
 
    
    it('listar todos os usuario', () => {
      const accessToken = 'Bearer ' + token
      //transforma usuario autenticado em admin para buscar todos          
      cy.request({
        method: 'PATCH',
        url: '/users/admin/',
        headers: {'Authorization': accessToken}
        
        }).then((response) => {
         expect(response.status).to.equal(204) 
        })

      cy.request({
      method: 'GET',
      url: '/users/', 
      headers: {'Authorization' : accessToken}
 
     }).then((response) => {
       expect(response.status).to.equal(200) 
     })
    
    })

    after(() => {
      //transforma o usuario autenticado em adm e exclui o usuario
        const idUsuarioString = idUsuario.toString()
        const acessToken = 'Bearer ' + token
  
         cy.request({
            method: 'PATCH',
            url: '/users/admin',
            headers: {'Authorization': acessToken}
            }).then((response) => {
           expect(response.status).to.equal(204) 
           cy.deletarUsuario(idUsuarioString ,acessToken)
          })

    })
})
      
    

 
 





  
    


        
      
          




 
  

       





 

























