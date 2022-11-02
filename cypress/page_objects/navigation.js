class Navigation {

    get logoutBtn () {
        return cy.get ('a[role="button "]')
    }

    



}

export const navigation = new Navigation ()