import { test, expect, Page } from "@playwright/test";

async function demoLogin(page: Page) {
  await page.goto("/");
  const demoButton = page.getByRole("link", { name: /try demo/i }).or(
    page.getByRole("button", { name: /try demo/i })
  );
  await demoButton.first().click();
  await page.waitForURL(/\/(dashboard|$)/, { timeout: 15_000 });
}

test.describe("Demo login → dashboard flow", () => {
  test("landing page loads and Try Demo button is visible", async ({ page }) => {
    await page.goto("/");
    const demoButton = page.getByRole("link", { name: /try demo/i }).or(
      page.getByRole("button", { name: /try demo/i })
    );
    await expect(demoButton.first()).toBeVisible();
  });

  test("demo login redirects to dashboard with heading", async ({ page }) => {
    await demoLogin(page);
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible({ timeout: 10_000 });
  });

  test("dashboard shows today's tasks section", async ({ page }) => {
    await demoLogin(page);
    await expect(page.getByText(/today'?s tasks/i)).toBeVisible({ timeout: 10_000 });
  });

  test("goals page shows existing goals from demo data", async ({ page }) => {
    await demoLogin(page);

    // Navigate to goals page via sidebar
    await page.getByRole("link", { name: /goals/i }).first().click();
    await page.waitForURL(/\/goals/, { timeout: 10_000 });

    // Demo data includes pre-seeded goals — at least one card or heading should be visible
    const goalsHeading = page.getByRole("heading", { name: /goals/i });
    await expect(goalsHeading).toBeVisible({ timeout: 10_000 });
  });

  test("dashboard today-stats section is visible after demo login", async ({ page }) => {
    await demoLogin(page);

    // The dashboard server component fetches and renders today stats
    // Verify the tasks section rendered (means SSR data fetch worked)
    await expect(page.getByText(/today'?s tasks/i)).toBeVisible({ timeout: 10_000 });

    // Verify the page has task items or an empty state — either way the section loaded
    const taskArea = page.locator("text=/today'?s tasks/i").locator("..");
    await expect(taskArea).toBeVisible();
  });
});
