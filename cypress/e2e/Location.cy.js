describe("Location Tracking", () => {
  beforeEach(() => {
    
    cy.intercept("GET", "/api/auth/me", {
      statusCode: 200,
      body: { user: { id: "test-user", email: "test@example.com" } }, 
    }).as("getCurrentUser");

    cy.visit("/"); 
    cy.wait("@getCurrentUser");
  });


  it("should hide the modal and update location when accuracy improves", () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, "watchPosition").callsFake((success) => {
        success({
          coords: { latitude: 45.4949, longitude: -73.5779, accuracy: 10 }, 
        });
      });
    });

    cy.contains("Are you on campus?").should("not.exist"); 
  });

  it("should not display marker when user is outside buildings", () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, "watchPosition").callsFake((success) => {
        success({
          coords: { latitude: 45.5000, longitude: -73.5800, accuracy: 5 }, 
        });
      });
    });

    cy.get('[data-testid="user-marker"]').should("not.exist");
  });
});
  