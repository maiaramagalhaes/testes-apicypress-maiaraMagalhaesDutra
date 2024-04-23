describe('Teste criar review de filme', function () {
    
    //caminhos infelizes
    describe(' Cadastrar review de filme sem sucesso', function (){
        it('Cadastrar review de filme sem estar logado', function () {
            cy.request({
               method: 'POST', 
               url: '/users/review',
               body: {
                 "movieId": 'Mulan',
                 "score": '5',
                 "reviewText": 'otimo filme',
                      },
              
                   failOnStatusCode: false,
    
            }).then((response) => {
                expect(response.status).to.equal(401)
                expect(response.body.message).includes('Access denied')
            })
        });

        it('Cadastrar review de filme sem estar logado e body invalido', function () {
            cy.request({
               method: 'POST', 
               url: '/users/review',
               body: {
                 "movieId": '',
                 "score": '',
                 "reviewText": '',
                      },
              
                   failOnStatusCode: false,
    
            }).then((response) => {
                expect(response.status).to.equal(401)
                expect(response.body.message).includes('Access denied')
            })
        
        });

        it('Listar reviews de filmes sem sucesso', function (){
            cy.request({
                   method: 'GET', 
                   url: 'users/review/all',
                                     
                    failOnStatusCode: false,
        
                }).then((response) => {
                    expect(response.status).to.equal(401)
                    expect(response.body.message).includes('Access denied')
                })
            
            });  
           
        })

    })

     //caminhos felizes
    describe('Cadastrar review de filme com sucesso', function () {
        var usuarioCriado = null;
        let token = null;
        var email = null;
        const password = '123456';
        let idFilme = null;
        let idUsuario;
        const filme = require('../fixtures/filme.json');
        let acessToken
        
        beforeEach(function (){
            cy.criarUsuario().then((dados) => {
                email = dados.body.email
                idUsuario = dados.body.id
                console.log(email)
            cy.autenticarUsuario(email,password).then((dadosLogin) => {
                token = dadosLogin.body.accessToken
                console.log(token)
            cy.promoverAdm(token)
            cy.cadastrarFilme(token, filme).then((dadosFilme) => {
                idFilme = dadosFilme.body.id
        
                    })
               })

            })
            
        }) 
//
         afterEach( function(){
           acessToken = 'Bearer '  + token
           cy.deletarFilme(idFilme, token) 
           cy.deletarUsuario(idUsuario ,acessToken)
            
        })  
        
        it('Cadastrar review de filme com sucesso', function () {
            cy.request({
                method: 'POST', 
                url: '/users/review',
                headers: {'Authorization': 'Bearer '  + token},
                body: {
                  "movieId": idFilme,
                  "score": 5,
                  "reviewText": "filmelegal",
                       }
            }).then((response) => {
                        expect(response.status).to.equal(201)
                       
        }); 

        })

        it('Cadastrar review de filme logado e body invalido', function () {
            cy.request({
                method: 'POST', 
                url: '/users/review',
                headers: {'Authorization': 'Bearer '  + token},
                body: {
                  
                       },

                       failOnStatusCode: false,

            }).then((response) => {
                        expect(response.status).to.equal(400)
                                               
        }); 

        }) 

        it('Cadastrar review de filme nao cadastrado', function () {
            cy.request({
                method: 'POST', 
                url: '/users/review',
                headers: {'Authorization': 'Bearer '  + token},
                body: {
                    "movieId": 10000,
                    "score": 4,
                    "reviewText": "meu cachorro amou"
                      },

                       failOnStatusCode: false,

            }).then((response) => {
                        expect(response.status).to.equal(404)
                        expect(response.body.message).includes('Movie not found')                       
        }); 

        it('Listar reviews de filmes com sucesso', function (){
            
            cy.listarReviews(token).then(() => {
              expect(dados.status).to.equal(200)
              expect(dados.body[0]).has.property('id'),
              expect(dados.body[0]).has.property('movieId'),
              expect(dados.body[0]).has.property('movieTitle'),
              expect(dados.body[0]).has.property('score'),
              expect(dados.body[0]).has.property('reviewText'),
              expect(dados.body[0]).has.property('reviewType')
              })
            
            })
            
        })   
        
        
})
  

