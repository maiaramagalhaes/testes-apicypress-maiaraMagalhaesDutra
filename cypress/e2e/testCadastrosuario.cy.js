import { faker, id_ID } from '@faker-js/faker';

describe('Teste cadastro usuario', function () {
    let idUsuario;
    let token;
    let email;
    let password = "123456";


 describe('teste cadastro de usuario com sucesso', function(){

    it('Cadastrar Usuario com sucesso ', function(){
        cy.criarUsuario().then((responseUsuario) => {
            expect(responseUsuario.status).to.equal(201) 
            email = responseUsuario.body.email
            idUsuario = responseUsuario.body.id
        })

    })
 })
 describe('Testar cenarios que necessitam de um usuario criado', function(){

    it('Promover para Critico', function(){
        let email1 
        cy.criarUsuario().then((respusuario)=>{
            email1 = (respusuario.body.email)
        cy.autenticarUsuario(email1, password).then((responseLogin) =>{
          token = (responseLogin.body.accessToken)
          cy.promoverCritico(token).then((responseCritico) =>{
            expect(responseCritico.status).to.equal(204) 
          }) 
        })
        })
      
    }) 
    it('Promover para Admin', function(){
        let email2
        cy.criarUsuario().then((respusuario)=>{
            email2 = (respusuario.body.email)
           cy.autenticarUsuario(email2, password).then((responseLogin) =>{
          token = (responseLogin.body.accessToken)
          cy.promoverAdm(token).then((responseAdmin) =>{
            expect(responseAdmin.status).to.equal(204) 
          }) 
        })
        })
      
    }) 

    it('Atualizar Usuario', function(){
        let email3
        let id
        cy.criarUsuario().then((respusuario)=>{
            email3 = (respusuario.body.email)
            id = (respusuario.body.id)
            console.log(id)
            console.log(email3)
        cy.autenticarUsuario(email3, password).then((responseLogin) =>{
          token = (responseLogin.body.accessToken)
          cy.atualizarUsuario(id, token).then((responseAdmin) =>{
            expect(responseAdmin.status).to.equal(200) 
          }) 
        })
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



 describe('teste cadastro de usuario sem sucesso', function(){
    const nomeUsuario = faker.internet.userName();
    const emailUsuario = faker.internet.email()

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
       it('Cadastrar um usuario sem sucesso - body vazio', function () {
        cy.request({
            method: 'POST',
            url: '/users',
            body: {
            },
            failOnStatusCode: false,
        })
            .then(function (response) {
                expect(response.status).to.equal(400)
                expect(response.body.message).includes('password must be longer than or equal to 6 characters')
            });
    });

    it('Atualizar usuario sem estar autenticado', function () {
        const idInvalido = 3;
        cy.request({
            method: 'PUT',
            url: '/users'  + idInvalido,
            body: {
                "name": "string",
                "password": "string"
            },
            failOnStatusCode: false,
        })
            .then(function (response) {
                expect(response.status).to.equal(401)
                expect(response.body.message).includes('Access denied.')
            });
    });


    it('Deletar usuario sem estar autenticado', function () {
        const idInvalido = 3;
        cy.request({
            method: 'DELETE',
            url: '/users'  + idInvalido,
            failOnStatusCode: false,
        })
            .then(function (response) {
                expect(response.status).to.equal(401)
                expect(response.body.message).includes('Access denied.')
            });
    });
 
 })


})


