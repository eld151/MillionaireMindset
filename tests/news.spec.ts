// tests/news.spec.ts

/* Playwright:
    - Node.js library that controls a real browser programmatically
    - Used for end-to-end tests
    - Playwright is typescript frist: all test helpers are fully typed

    SETUP (run once):
    - npm install --save-dev @playwright/test
    - npx playwright install chromium

    RUN:
    - npx playwright test tests/news.spec.ts
    - npx playwright test --ui (interactive mode - great for debugging)
*/

import { test, expect, type Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

//-------------------------------------------------------

// Test suite: News Feed 

test.describe("News Feed", () => {
    async function gotoAndWaitForNews(page: Page) {
        await page.goto(BASE_URL);
        //Wait for skeleton to disappear and real content appears
        await page.waitForSelector("[data-testid='news-skeleton']", {
            state: "hidden",
            timeout: 15_000, //give yahoo-finance2 15s
        });
    }

    //Test 1: News section renders on the homepage
    test("news section is visible on the homepage", async ({ page }) => {
        await page.goto(BASE_URL);

        const newsSection = page.getByRole("region", {
            name: "Financial news feed",
    });
        await expect(newsSection).toBeVisible();
    });

    //Test 2: hero article renders with headline and source
    test("hero article renders with a headline and source", async ({page}) => 
    {
        await gotoAndWaitForNews(page);
        // Hero is an article and there should be at least one
        const articles = page.getByRole("article");
        await expect(articles.first()).toBeVisible();
        const heroHeadline = page.locator("h2").first();
        await expect(heroHeadline).toBeVisible();
        // Headline should not be empty
        const headlineText = await heroHeadline.textContent();
        expect(headlineText?.trim().length).toBeGreaterThan(10);
    });

    //Test 3: At least 4 articles appear in total (hero + 3 grid cards)

    test("at leat 4 articles are displayed", async ({ page }) => {
        await gotoAndWaitForNews(page);

        const articles = page.getByRole("article");
        const count = await articles.count();
        expect(count).toBeGreaterThanOrEqual(4);
    });

    //Test 4: "read full story" link on the hero goes to an external URL
    
    test("hero read-more link has a valid href", async ({ page }) => {
        await gotoAndWaitForNews(page);

        const readMoreLink = page.getByRole("link", { name: /read full story/i});
        await expect(readMoreLink).toBeVisible();

        const href = await readMoreLink.getAttribute("href");
        expect(href).toBeTruthy();
    });

    //Test 5: Category filter buttons appear and work

    test("category filter buttons render and filter articles", async ({ page }) => {
        await gotoAndWaitForNews(page);

        // The "all" filter button should always be present
        const allButton = page.getByRole("button", { name: "All" });
        await expect(allButton).toBeVisible();

        // Click a category filter any exist beyond "All"
        const filterButtons = page.locator("button").filter({ hasText: /Markets|Crypto|Economy|Earnings|Tech/ });
        const filterCount = await filterButtons.count();

        if (filterCount > 0) {
            // Click the first available category filter 
            await filterButtons.first().click();

            // Articles grid should still have at least one card
            const articles = page.getByRole("article");
            const count = await articles.count();
            expect(count).toBeGreaterThanOrEqual(1);

            // Click "All" to reset 
            await allButton.click();
        }
    });

    // Test 6: Refresh button is visible and triggers a reload

    test("refresh button is visible and clickable", async ({ page }) => {
        await gotoAndWaitForNews(page);
        
        const refreshBtn = page.getByRole("button",  { name: /refresh/i });
        await expect(refreshBtn).toBeVisible();
        await refreshBtn.click();

        // After clicking refresh the component re-fetches 
        // We just verify it doesn't crash and articles still appear after
        await page.waitForSelector("[data-testid='news-skeleton']", {
            state: "hidden",
            timeout: 15_000,
        });

        const articles = page.getByRole("article");
        expect(await articles.count()).toBeGreaterThanOrEqual(1);
    });

    // Test 7: Network failure shows error state

    /* Network Interception:
        page.route() intercepts matching requests and lets you return a custom response.
        Here we simulate a server error to verify our error UI.
        This is a big advantage of Playwright over Selenium.
    */
   test("shows error UI when the /api/news endpoint fails", async ({ page }) => {
    //Intercept the news API and return a 500 error
    await page.route("**api/news", (route) => {
        route.fulfill({status: 500, body: "Internal Server Error" });
    });
    await page.goto(BASE_URL);

    // The error state should show a "Try again" button
    const tryAgain = page.getByRole("button", {name: /try again/i});
    await expect(tryAgain).toBeVisible({ timeout: 10_000 });
   });

   //Test 8: Images have alt text (accessibility)

   test("article images have non-empty alt text", async ({page}) => {
    await gotoAndWaitForNews(page);

    //Query all <img> elements inside <article> elements
    const images = page.locator("article img");
    const count = await images.count();

    for (let i = 0; i < count; i++ ) {
        const alt = await images.nth(i).getAttribute("alt");
        expect(alt?.trim().length).toBeGreaterThan(0);
    }
   });
});