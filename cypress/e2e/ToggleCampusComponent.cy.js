describe("Toggle Button Component ", () => {
    beforeEach(() => {
        cy.intercept("GET", "/api/auth/me", {
            statusCode: 200,
            body: { user: { id: "test-user", email: "test@example.com" } }, // Fake authenticated user
        }).as("getCurrentUser");

        cy.visit("http://localhost:5173/");

        // Stub the geolocation API to return a location on sgw campus so the modal can dissapear
        cy.window().then((win) => {
            cy.stub(win.navigator.geolocation, "watchPosition").callsFake((success) => {
                success({
                    coords: { latitude: 45.4949, longitude: -73.5779, accuracy: 10 },
                });
            });
        });

    });

    it("The toggle button is on the screen", () => {
        cy.wait("@getCurrentUser"); // Wait for mock authentication request
        cy.get('[data-testid="toggle-button"]').should("exist");
        cy.get('[data-testid="toggle-button-loyola"]').should("have.text", "LOYOLA");
        cy.get('[data-testid="toggle-button-sgw"]').should("have.text", "SGW");
    });

    it("The toggle button changes the option's background appropriately", () => {
        cy.wait("@getCurrentUser"); // Wait for mock authentication request

        
        //check the background color of the page upon landing on the page
        cy.get('[data-testid="toggle-button-loyola"]').should("have.css", "background-color", "rgb(238, 235, 235)");
        cy.get('[data-testid="toggle-button-loyola"]').should("have.text", "LOYOLA");
        
        cy.get('[data-testid="toggle-button-sgw"]').should("have.text", "SGW");
        cy.get('[data-testid="toggle-button-sgw"]').should("have.css", "background-color", "rgb(65, 26, 114)");


        //click on the loyola button and check the background color of each button
        cy.get('[data-testid="toggle-button-loyola"]').click();
        cy.get('[data-testid="toggle-button-loyola"]').should("have.css", "background-color", "rgb(65, 26, 114)");
        cy.get('[data-testid="toggle-button-sgw"]').should("have.css", "background-color", "rgb(238, 235, 235)");
    });

    it("the toggle button changes the center location of the map", () => {
        cy.wait("@getCurrentUser"); // Wait for mock authentication request

        //check the center of the map upon landing on the page
        cy.get('#map').should("exist");
        cy.get('#map').invoke('attr', 'data-center').should('eq', 'SGW');

        //click loyola button and check the center of the map
        cy.get('[data-testid="toggle-button-loyola"]').click();
        cy.get('#map').should("exist");
        cy.get('#map').invoke('attr', 'data-center').should('eq', 'LOYOLA');
    });

});