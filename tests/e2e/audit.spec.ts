import { test, expect } from "@playwright/test";

/**
 * The Audit is the primary acquisition flow (design/02 §7, Flow A) —
 * this journey must never break: 12 answers → immediate ungated result.
 */
test.describe("Inner Dialogue Audit", () => {
  test("completes the full flow and shows a narrator result without signup", async ({ page }) => {
    await page.goto("/lab/audit");

    // Progress indicator present and accessible.
    await expect(page.getByText("01 / 12")).toBeVisible();

    // Answer all 12 items via the buttons (varying answers to exercise scoring).
    for (let i = 0; i < 12; i++) {
      const option = page.getByRole("button", { name: i % 2 === 0 ? "Often" : "Sometimes" });
      await option.click();
    }

    // Result renders immediately — no email gate before value.
    await expect(page.getByText("Your dominant narrator:")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("link", { name: "Save my profile" })).toBeVisible();
  });

  test("supports keyboard-only completion", async ({ page }) => {
    await page.goto("/lab/audit");
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("3");
    }
    await expect(page.getByText("Your dominant narrator:")).toBeVisible({ timeout: 10_000 });
  });

  test("home page has no horizontal scroll and a working skip link", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });
});
