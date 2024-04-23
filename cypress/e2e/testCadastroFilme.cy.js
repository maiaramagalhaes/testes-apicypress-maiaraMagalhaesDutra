
describe('Teste de Cadastrar Filmes', function (){

describe('Teste de Cadastrar Filmes Sem Sucesso', function (){
   let id
    it('Cadastrar filme sem estar logado', function () {
        cy.request({
           method: 'POST', 
           url: '/movies',
           body: {
            "title": "a vida e bela",
            "genre": "drama",
            "description": "filme triste",
            "durationInMinutes": 150,
            "releaseYear": 1990
                },
          
               failOnStatusCode: false,

        }).then((response) => {
            expect(response.status).to.equal(401)
            expect(response.body.message).includes('Access denied')
        })
    });

    it ('Cadastrar filme sem estar logado e body invalido', function (){
        cy.request({
                   method: 'POST', 
                   url: '/movies',
                   body: {
                    "title": "",
                    "genre": "",
                    "description": "",
                    "durationInMinutes": 0,
                    "releaseYear": 0
                        },
                    failOnStatusCode: false,
         }).then((response) => {
                    expect(response.status).to.equal(401)
                    expect(response.body.message).includes('Access denied')
         })
        
    });

    it('Atualiza Filme se estar autenticado', function (){
        cy.request({
            method: 'PUT', 
            url: '/movies/' + id, 
            body:{
             "title": "Um filme atualizado",
             "genre": "acao",
             "description": "decricao atualizada",
             "durationInMinutes": 110,
             "releaseYear": 2024
             },
           failOnStatusCode: false,
          }).then((response) => {
              expect(response.status).to.equal(401)
              expect(response.body.message).includes('Access denied')
          })


    })
    it('Deletar Filme se estar autenticado', function (){
        cy.request({
            method: 'DELETE', 
            url: '/movies/' + id, 
           failOnStatusCode: false,
          }).then((response) => {
              expect(response.status).to.equal(401)
              expect(response.body.message).includes('Access denied')
          })


    })
    
describe('Cadastrar Filmes com sucesso', function (){
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
   
            })
           })

        })

        it('Cadastrar filme com suceso', function () {
            cy.cadastrarFilme(token, filme).then((response) => {
             expect(response.status).to.equal(201)  
             let idFilme = response.body.id    
             cy.deletarFilme(idFilme, token)       
            })
    
        });

        it('Atualizar filme com suceso', function () {
            cy.cadastrarFilme(token, filme).then((response) => {
             expect(response.status).to.equal(201) 
             let idFilme = response.body.id  
             cy.atualizarFilme(idFilme, token).then((resp) =>{
                expect(resp.status).to.equal(204) 
            cy.deletarFilme(idFilme, token)
             })   
              
            })
    
        })

        it('Deletar filme com suceso', function () {
            cy.cadastrarFilme(token, filme).then((response) => {
             expect(response.status).to.equal(201) 
             let idFilme = response.body.id  
             cy.deletarFilme(idFilme, token).then((resp) =>{
                expect(resp.status).to.equal(204) 
             })   
              
            })
    
        })

       afterEach( function(){
            acessToken = 'Bearer '  + token
            cy.deletarUsuario(idUsuario ,acessToken)
          
          }); 
        })

    })
})



