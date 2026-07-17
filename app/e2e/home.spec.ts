import { test, expect } from "@playwright/test";

test("home page loads with Phantom Gadgets branding", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Phantom Gadgets")).toBeVisible();
  await expect(page.locator("text=Browse products")).toBeVisible();
});

test("navigation links are present", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Home")).toBeVisible();
  await expect(page.locator("text=Catalog")).toBeVisible();
  await expect(page.locator("text=Cart")).toBeVisible();
  await expect(page.locator("text=Orders")).toBeVisible();
  await expect(page.locator("text=Admin")).toBeVisible();
  await expect(page.locator("text=Profile")).toBeVisible();
});
