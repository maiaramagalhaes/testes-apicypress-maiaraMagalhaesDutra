import { faker, id_ID } from '@faker-js/faker';

describe('Teste cadastro usuario', function () {
   var idUsuario
   var token
   const nomeUsuario = faker.internet.userName();
   const emailUsuario = faker.internet.email();

   it('Cadastrar um usuario com sucesso', function () {
       

       cy.request('POST', '/users', {
           name: nomeUsuario,
           email: emailUsuario,
           password: '123456'
       }).then(function (response) {
           expect(response.status).to.equal(201)
           expect(response.body.name).to.equal(nomeUsuario)
           expect(response.body.email).to.equal(emailUsuario)
       })
   });

   it('Cadastrar um usuario sem sucesso - email invalido', function () {
       cy.request({
           method: 'POST',
           url: '/users',
           body: {
               name: nomeUsuario,
               email: 'maiara',
               password: '123456'
           },
           failOnStatusCode: false,
       })
           .then(function (response) {
               expect(response.status).to.equal(400)
               expect(response.body.message).includes('email must be an email')
           });
   });

      it('Cadastrar um usuario sem sucesso - senha com menos caracteres', function () {
          cy.request({
              method: 'POST',
              url: '/users',
              body: {
                  name: nomeUsuario,
                  email: emailUsuario,
                  password: '1234'
              },
              failOnStatusCode: false,
          })
              .then(function (response) {
                  expect(response.status).to.equal(400)
                  expect(response.body.message).includes('password must be longer than or equal to 6 characters')
              });
      });

      after(() => {

        //atentica e inativa o usuario
        cy.request({
            method: 'POST',
            url: '/auth/login',
            body: { "email": emailUsuario, "password": "123456" }
      
          }).then((response) => {
            token = response.body.accessToken
            expect(response.status).to.equal(200)
            cy.request({
            method: 'PATCH',
            url: '/users/inactivate',
            headers: {'Authorization': 'Bearer ' + token},   
            }).then((response) => {

            })
          });

    
    });
})


