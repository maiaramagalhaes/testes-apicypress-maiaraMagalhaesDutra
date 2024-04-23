describe('Teste de consulta de filmes', () => {

  let token = null;
  const password = '123456';
  let idFilme = null;
  let idUsuario;
  const filme = require('../fixtures/filme.json');
  let nomeFilme;
  let email;

  beforeEach(function(){
    cy.criarUsuario().then((dados) => {
      email = dados.body.email
      idUsuario = dados.body.id
      //console.log(email)
      cy.autenticarUsuario(email,password).then((dadosLogin) => {
          token = dadosLogin.body.accessToken
      cy.promoverAdm(token)
      cy.cadastrarFilme(token, filme).then((response) => {
        idFilme = response.body.id
        nomeFilme = response.body.title
      cy.cadastrarReview(token, idFilme).then((responseReview) => {
        expect(responseReview.status).to.equal(201)
        })
      })
     })
	  });
  })


     it('buscar filme por id', () => {
  
       cy.buscarFilmeId(idFilme).then((response) =>{
        expect(response.status).to.equal(200)
        expect(response.body.reviews[0]).to.have.property('reviewText')
        expect(response.body.reviews[0]).to.have.property('score')
        expect(response.body.reviews[0]).to.have.property('updatedAt')
        expect(response.body.reviews[0]).to.have.property('reviewText')
        expect(response.body.reviews[0]).to.have.property('score')
        expect(response.body.reviews[0]).to.have.property('updatedAt')

      }) 

      });

      it('buscar todos os filmes', () => {
        cy.listarFilmes().then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body[0]).has.property('id'),
        expect(response.body[0]).has.property('title'),
        expect(response.body[0]).has.property('genre'),
        expect(response.body[0]).has.property('description'),
        expect(response.body[0]).has.property('totalRating'),
        expect(response.body[0]).has.property('durationInMinutes'),
        expect(response.body[0]).has.property('releaseYear')
       });})

       it('buscar filme por nome com sucesso', () => {
        cy.buscarFilmePorNome(nomeFilme).then((response) =>{
          expect(response.status).to.equal(200)
        })
      })

    })




  





