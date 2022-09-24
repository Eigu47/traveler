/// <reference types="cypress" />
import { NearbySearchResult } from "@/types/NearbySearchResult";

describe.only("map page with mocked results", () => {
  beforeEach(() => {
    cy.viewport("macbook-16");

    cy.visit("/map");

    cy.intercept(
      "GET",
      "**/api/nearby?*",
      { fixture: "nearby.json" } // Comment this line for real API call
    ).as("nearby");

    cy.findByPlaceholderText(/search city/i).type("Tokyo", { force: true });

    cy.findAllByRole("option", { name: /tokyo, japan/i })
      .first()
      .click();
  });

  it("should render result card correctly", () => {
    // Get results from fixture or API response
    cy.wait("@nearby").then((interception) => {
      const { results } = interception.response.body as NearbySearchResult;
      // Search within each result card scope
      cy.findAllByTestId("result-card")
        .should("have.length", results.length)
        .each(($resultCard, index) => {
          cy.wrap($resultCard).within(() => {
            // Assert all result card content
            cy.findByRole("link", { name: results[index].name }).should(
              "exist"
            );

            cy.findByRole("img", { name: results[index].name }).should("exist");

            cy.findByText(results[index].vicinity).should("exist");

            if (results[index].geometry.location) {
              cy.findByText(/from the center/i).should("exist");
            }

            if (results[index].opening_hours) {
              cy.findByText(
                results[index].opening_hours.open_now ? /open/i : /closed/i
              ).should("exist");
            }

            if (results[index].rating) {
              cy.findByText(/reviews/i).should("exist");
            }
            // Filter tags before asserting tag list
            const tags = results[index].types
              .filter(
                (type) =>
                  type !== "point_of_interest" && type !== "establishment"
              )
              .map(
                (type) =>
                  type.charAt(0).toUpperCase() +
                  type.slice(1).replaceAll("_", " ")
              );

            cy.findAllByRole("listitem").each(($listItem, index) => {
              expect($listItem).to.have.text(tags[index]);
            });
          });
        });
    });
  });

  it("should render map markers", () => {
    cy.wait("@nearby").then((interception) => {
      const { results } = interception.response?.body as NearbySearchResult;
      cy.findByTestId("center-marker").should("exist");

      cy.findAllByTestId("result-marker").should("have.length", results.length);
    });
  });

  it("search options should work", () => {
    cy.wait("@nearby");

    cy.findByRole("textbox").type("open now");

    cy.findByRole("combobox", { name: /filter by/i }).select("restaurant");

    cy.findByRole("combobox", { name: /sort by/i }).select("distance");

    cy.findByRole("slider", { name: /max radius/i }).then(($slider) => {
      cy.wrap($slider)
        .invoke("val", +$slider.val() + 10000)
        .trigger("change");
    });

    cy.findByRole("button", { name: /search here/i }).click();

    cy.findAllByTestId("result-card").then(($resultCards) => {
      cy.findAllByTestId("result-marker").should(
        "have.length",
        $resultCards.length
      );
    });
  });
});

describe("map page with real results", () => {
  beforeEach(() => {
    cy.viewport("macbook-16");

    cy.visit("/map");

    cy.intercept("GET", "**/api/nearby?*").as("nearby");

    cy.findByPlaceholderText(/search city/i).type("Tokyo");

    cy.findAllByRole("option", { name: /tokyo, japan/i })
      .first()
      .click();
  });

  it("loads next page in loop until there is no next page token", () => {
    cy.wait("@nearby").then((interception) => {
      const { next_page_token } = interception.response
        .body as NearbySearchResult;

      function loadNextPageLoop(next_page_token) {
        if (next_page_token) {
          cy.findByRole("button", { name: /load more/i }).click();

          cy.wait("@nearby").then((interception) => {
            const { next_page_token } = interception.response
              .body as NearbySearchResult;

            loadNextPageLoop(next_page_token);
          });
        }

        cy.findByRole("button", { name: /no more results/i }).should("exist");
      }

      loadNextPageLoop(next_page_token);
    });
  });
});
