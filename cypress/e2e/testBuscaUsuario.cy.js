import { faker, id_ID } from '@faker-js/faker';

describe('Teste de Buscar Usuário', () => {

  describe('Testes busca com sucesso', () =>{

    let idUsuario;
    let token;
    let email = null;
    let password = "123456";
    
      beforeEach(() => {
        cy.criarUsuario().then((dadosUsuario) => {
        email = dadosUsuario.body.email
        idUsuario = dadosUsuario.body.id
        cy.autenticarUsuario(email, password).then((responseLogin) =>{
        expect(responseLogin.status).to.equal(200)
        token = (responseLogin.body.accessToken)

        })
      })
    })


      it('buscar um usuario por id com sucesso', () => {
        cy.buscarUsuarioId(idUsuario, token).then((response) => {
         expect(response.status).to.equal(200)
       })
   })

   it('buscar todos os usuarios', () => {
    cy.promoverAdm(token).then((responseadm) => {
      expect(responseadm.status).to.equal(204) 
    })
    cy.buscaTodosUsuarios(token).then((responseTodosUsuarios) => {
     expect(responseTodosUsuarios.status).to.equal(200)
     expect(responseTodosUsuarios.body[0]).has.property('id'),
     expect(responseTodosUsuarios.body[0]).has.property('name'),
     expect(responseTodosUsuarios.body[0]).has.property('email'),
     expect(responseTodosUsuarios.body[0]).has.property('type'),
     expect(responseTodosUsuarios.body[0]).has.property('active')
   })
})

    afterEach(() => {
     //transforma o usuario logado em adm e exclui o usuario
  
    const accessToken = 'Bearer ' + token;
     cy.promoverAdm(token).then((responseadm) => {
        expect(responseadm.status).to.equal(204) 
       cy.deletarUsuario(idUsuario, accessToken)
   })
    
   })

  })

  describe('Testes busca sem sucesso',() =>{

    let id = 12

    it('buscar um usuario sem tem ter autenticado', () => {
      cy.request({
            method: 'GET',
            url: '/users/' + id,
            failOnStatusCode: false      
      }).then((response) => {
       expect(response.status).to.equal(401)
       expect(response.body.message).includes('Access denied')

      })
    
    })

    it('buscar todos os usuarios sem tem ter autenticado', () => {
      cy.request({
            method: 'GET',
            url: '/users/',
            failOnStatusCode: false      
      }).then((response) => {
       expect(response.status).to.equal(401)
       expect(response.body.message).includes('Access denied')

      })
    
    })

  })
   
})
      
    

 
 





  
    


        
      
          




 
  

       





 

























