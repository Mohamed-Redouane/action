describe("Bottom Navigation Bar", () => {
    beforeEach(() => {
        cy.intercept("GET", "/api/auth/me", {
            statusCode: 200,
            body: { user: { id: "test-user", email: "test@example.com" } }, // Fake authenticated user
        }).as("getCurrentUser");

        cy.visit("http://localhost:5173/");
        cy.wait("@getCurrentUser");
    });

    it("The bottom navigation bar should exist and be visible", () => {
        cy.get("nav").should("exist").should("be.visible");
    });

    it("The bottom navigation bar should have at least 4 main buttons", () => {
        cy.get("nav").find("button").should("have.length.at.least", 4);
    });

    
    it("Each navigation button should navigate correctly", () => {
        const navItems = [
            { label: "Shuttle", path: "/shuttle" },
            { label: "Map", path: "/" },
            { label: "Directions", path: "/directions" },
            { label: "Schedule", path: "/schedule" },
        ];

        navItems.forEach(({ label, path }) => {
            cy.get("nav").find("button").contains(label).click();
            cy.url().should("include", path);
        });
    });
});
