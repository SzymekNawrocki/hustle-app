import { test, expect } from "@playwright/test";

test.describe("Demo login → dashboard flow", () => {
  test("landing page loads and Try Demo button is visible", async ({ page }) => {
    await page.goto("/");
    const demoButton = page.getByRole("link", { name: /try demo/i }).or(
      page.getByRole("button", { name: /try demo/i })
    );
    await expect(demoButton.first()).toBeVisible();
  });

  test("demo login redirects to dashboard", async ({ page }) => {
    await page.goto("/");

    // Click the first Try Demo button
    const demoButton = page.getByRole("link", { name: /try demo/i }).or(
      page.getByRole("button", { name: /try demo/i })
    );
    await demoButton.first().click();

    // Should land on dashboard
    await page.waitForURL(/\/(dashboard|$)/, { timeout: 15_000 });

    // Dashboard heading should be visible
    const heading = page.getByRole("heading", { name: /dashboard/i });
    await expect(heading).toBeVisible({ timeout: 10_000 });
  });

  test("dashboard shows today stats section", async ({ page }) => {
    // Go directly to dashboard (requires cookie — first do demo login)
    await page.goto("/");
    const demoButton = page.getByRole("link", { name: /try demo/i }).or(
      page.getByRole("button", { name: /try demo/i })
    );
    await demoButton.first().click();
    await page.waitForURL(/\/(dashboard|$)/, { timeout: 15_000 });

    // Dashboard should have a tasks section
    const tasksSection = page.getByText(/today'?s tasks/i);
    await expect(tasksSection).toBeVisible({ timeout: 10_000 });
  });
});
