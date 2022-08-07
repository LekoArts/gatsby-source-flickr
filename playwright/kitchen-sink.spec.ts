import { test, expect } from "@playwright/test"

test.describe(`Kitchen Sink`, () => {
  test(`index page`, async ({ page }) => {
    await page.goto(`/`)

    await expect(page).toHaveTitle(`Plugin`)
  })
})
