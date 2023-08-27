import { test, expect } from "@playwright/test"

test.describe(`Kitchen Sink`, () => {
  test(`should build and serve index page`, async ({ page }) => {
    await page.goto(`/`)

    await expect(page).toHaveTitle(`@lekoarts/gatsby-source-flickr`)
  })
  test(`contains elements`, async ({ page }) => {
    await page.goto(`/`)

    await expect(await page.locator(`h1:has-text("@lekoarts/gatsby-source-flickr")`)).toBeVisible()
    await expect(await page.locator(`text=ars_aurea`)).toBeVisible()
    await expect(
      await page
        .locator(
          `img[alt="A colorful blob of glowing spheres with some translucent rings around them\\. The background is a light blue and a chinese sign is below the \\'blob\\'\\. The mashed together spheres in the middle touch each other and morph into each other in some places\\. They are orange and black"]`
        )
        .first()
    ).toBeVisible()
    await expect(await page.locator(`text=3D`)).toBeVisible()
    await expect(await page.locator(`text=Design`)).toBeVisible()
    await expect(await page.locator(`text=Croatia`)).toBeVisible()
    await expect(
      await page.locator(
        `img[alt="Small boat in a port of a small town in Croatia\\. The town is in the background and has a small destroyed castle at the top"]`
      )
    ).toBeVisible()
    await expect(await page.locator(`text=Demo of @lekoarts/gatsby-source-flickr – GitHub – Website`)).toBeVisible()
  })
})
