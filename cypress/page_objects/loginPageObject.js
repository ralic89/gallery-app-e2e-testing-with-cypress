class LoginClass {

    get emailInput () {
        return cy.get ('#email')
    }
     
    get passwordInput () {
        return cy.get ('#password')
    }

    get submitBtn () {
        return cy.get ('button[type="submit"]')
    }

    loginFunc (email = Cypress.env ('validEmail') , password = Cypress.env ('validPassword')) {
        this.emailInput.type(email)
        this.passwordInput.type(password) 
        this.submitBtn.click()
    }
}

export const loginClass = new LoginClass ()