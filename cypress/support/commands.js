import { faker, id_ID } from '@faker-js/faker';
import { head } from 'lodash';

Cypress.Commands.add('deletarUsuario', function (id, acessToken ) {
  cy.request({
    method: 'DELETE',
    url: '/users/'+ id, 
    headers: {'Authorization': acessToken}
    }).then((response) => {
    expect(response.status).to.equal(204)
    })
  });

  Cypress.Commands.add('buscarFilmeId', function (id) {
    cy.request('GET', '/movies/' + id)
    .then((response) => {
      return response;
    })
  });

  Cypress.Commands.add('criarUsuario', function () {
    return cy
      .request('POST', '/users', {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "123456"
      })
      .then((response) => {
        return response;
      });
  });

  Cypress.Commands.add('autenticarUsuario', function (email, password) {
    return cy
      .request({
        method: 'POST', 
        url: '/auth/login', 
        body: {
          'email':email,
          'password': password 
        }       
      })
      .then((response) => {
        return response;
      });
  });

  Cypress.Commands.add('cadastrarFilme', function (token,filme) {
       return cy
      .request({
        method: 'POST', 
        url: '/movies', 
        headers: {'Authorization': 'Bearer '  + token},
        body: {
          'title':filme.title ,
          'genre': filme.genre ,
          'description': filme.description,
          'durationInMinutes': filme.durationInMinutes,
          'releaseYear': filme.releaseYear
        }
      })
      .then((response) => {
        return response;
      });
  });

  Cypress.Commands.add('promoverAdm', function (token) {
    return cy
      .request({
        method: 'PATCH', 
        url: '/users/admin', 
        headers: {'Authorization': 'Bearer '  + token},
      })
      .then((response) => {
        return response;
      });
  });

  Cypress.Commands.add('listarReviews', function (token) {
    return cy
      .request({
        method: 'GET', 
        url: 'users/review/all', 
        headers: {'Authorization': 'Bearer '  + token},
      })
      .then((response) => {
        return response;
      });
  });  

  Cypress.Commands.add('deletarFilme', function (id, token) {
    cy.request({
      method: 'DELETE',
      url: '/movies/'+ id, 
      headers: {'Authorization': 'Bearer '  + token},
      }).then((response) => {
      expect(response.status).to.equal(204)
      })
    });

    Cypress.Commands.add('listarFilmes', function () {
      return cy
        .request({
          method: 'GET', 
          url: '/movies', 
          
        })
        .then((response) => {
          return response;
        });
    }); 
Cypress.Commands.add('buscarUsuarioId', function (id, token) {
   return cy
        .request({
          method: 'GET', 
          url: '/movies/' + id, 
          headers: {'Authorization': 'Bearer '  + token}
          
        })
        .then((response) => {
          return response;
        });
}); 


Cypress.Commands.add('buscaTodosUsuarios', function (token) {
  return cy
       .request({
         method: 'GET', 
         url: '/users/', 
         headers: {'Authorization': 'Bearer '  + token}
     
       })
       .then((response) => {
         return response;
       });
}); 


Cypress.Commands.add('promoverCritico', function (token) {
  return cy
       .request({
         method: 'PATCH', 
         url: '/users/apply', 
         headers: {'Authorization': 'Bearer '  + token}
     
       })
       .then((response) => {
         return response;
       });
}); 


Cypress.Commands.add('atualizarUsuario', function (id, token) {
  return cy
       .request({
         method: 'PUT', 
         url: '/users/' + id, 
         headers: {'Authorization': 'Bearer '  + token},
         body:{
            "name": "Joaquim",
            "password": "654321"
         }
       })
       .then((response) => {
         return response;
       });
}); 

Cypress.Commands.add('atualizarFilme', function (id, token) {
  return cy
       .request({
         method: 'PUT', 
         url: '/movies/' + id, 
         headers: {'Authorization': 'Bearer '  + token},
         body:{
          "title": "Um filme atualizado",
          "genre": "acao",
          "description": "Em ferias, uma galera atulaliza um filme no Raro Filmes",
          "durationInMinutes": 110,
          "releaseYear": 2024
          }
       })
       .then((response) => {
         return response;
       });
}); 


Cypress.Commands.add('deletarFilme', function (id, token) {
  return cy
       .request({
         method: 'DELETE', 
         url: '/movies/' + id, 
         headers: {'Authorization': 'Bearer '  + token},
       })
       .then((response) => {
         return response;
       });
}); 


Cypress.Commands.add('buscarFilmePorNome', function (nome) {
  return cy
       .request({
          method: 'GET',
          url: '/movies/search',
          qs: {'title': nome}
       })
       .then((response) => {
         return response;
       });
}); 


Cypress.Commands.add('cadastrarReview',function(token, idFilme){
  cy.request({
    method: 'POST', 
    url: '/users/review',
    headers: {'Authorization': 'Bearer '  + token},
    body: {
      "movieId": idFilme,
      "score": 5,
      "reviewText": "meu cachorro curtiu d+",
           }
  }).then((response) => {
        return response;
           
  });

});