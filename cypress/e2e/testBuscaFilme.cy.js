import { faker, id_ID } from '@faker-js/faker';

describe('Teste de consulta de filmes', () => {
  var tittleMovie = "Barbie";
  var idMovie = 1;

  it('buscar todos os filmes', () => {
          cy.request({
          method: 'GET',
          url: '/movies',
          qs: {'sort': true}
        }).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body[0]).has.property('id'),
         expect(response.body[0]).has.property('title'),
          expect(response.body[0]).has.property('genre'),
          expect(response.body[0]).has.property('description'),
          expect(response.body[0]).has.property('totalRating'),
          expect(response.body[0]).has.property('durationInMinutes'),
          expect(response.body[0]).has.property('releaseYear')
        })
    }) 
     it('buscar filme por nome', () => {
          cy.request({
          method: 'GET',
          url: '/movies/search',
          qs: {'title': tittleMovie},
     
        }).then((response) => {
           expect(response.status).to.equal(200)
        })
    }) 

    it('buscar filme por id', () => {
        cy.buscarFilmeId(idMovie)
      })
 
})
