/// <reference types="cypress" />
import {loginClass} from '../page_objects/loginPageObject'
import {general} from '../page_objects/general'
import data from '../fixtures/data.json'
import {navigation} from '../page_objects/navigation'

var token ;
var galleryID ;

describe ('Zavrsni' , () => {

before ('Visit login page and Login- FrontEnd' , () =>{
   cy.intercept("POST" , 'https://gallery-api.vivifyideas.com/api/auth/login').as('validLogin')
    cy.visit ('/login')
    cy.url().should('contain' , '/login')
    general.headerTitle.should('be.visible')
    .and('have.text' , data.loginHeader)
    loginClass.loginFunc()
    cy.wait('@validLogin').then(intercept =>{
        // console.log(intercept)
        expect(intercept.response.statusCode).to.eq(200)
        token = intercept.response.body.access_token
    })
})

beforeEach ('set token to local storage', () => {
    window.localStorage.setItem('token' , token)
})

it ('Create gallery BE' , () => {
     cy.request({ 
        method : 'POST',
        url : 'https://gallery-api.vivifyideas.com/api/galleries',
        body : {
            "title":"FOXLIFE",
            "description":"vodavoda",
            "images":["https://t4.ftcdn.net/jpg/04/18/75/51/360_F_418755149_eQGDIReqUJmSkLyg2w757t6vJ42VyabT.jpg","https://i.pinimg.com/736x/13/16/e9/1316e9e0c1ba71705d17b9163b8bba93.jpg"]
        },
        headers : {
            authorization : `Bearer ${token}`
        }
        
     }).then(response => {
        // console.log(response)
        expect(response.status).to.eq(201)
        expect(response.body.title).to.eq(data.createGallery.title)
        expect(response.body.description).to.eq(data.createGallery.description)
        galleryID = response.body.id
     })
} )

it ('Edit gallery BE' , () => {
    cy.request ({
        method : "PUT" ,
        url : `https://gallery-api.vivifyideas.com/api/galleries/${galleryID}`,
        body : {
            "title":"FOX",
            "description":"Grad Novi Sad",
            "images":["https://i.pinimg.com/736x/13/16/e9/1316e9e0c1ba71705d17b9163b8bba93.jpg"]
        },
        headers : {
            authorization : `Bearer ${token}`
        }
    }).then((response) => {
        console.log(response)
        expect(response.status).to.eq(200)
        expect(response.body.title).to.eq('FOX')
        expect(response.body.description).to.eq('Grad Novi Sad')
    })
} )

it ('Delete gallery BE' , () => {
    cy.request ({
        method : "DELETE",
        url: `https://gallery-api.vivifyideas.com/api/galleries/${galleryID}`,
        headers : {
            authorization : `Bearer ${token}`
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
    })
} )

})