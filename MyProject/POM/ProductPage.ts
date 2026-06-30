import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the demoblaze Product Detail page (prod.html).
 * Shows product info and the Add to Cart button.
 */
export class ProductPage {
  readonly page: Page;

  // ── Nav links ───────────────────────────────────────────────────────────────
  readonly cartLink: Locator;
  readonly logoutLink: Locator;

  // ── Product details ─────────────────────────────────────────────────────────
  readonly productContainer: Locator;
  readonly productName: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartLink   = page.locator('#cartur');
    this.logoutLink = page.locator('#logout2');

    this.productContainer = page.locator('#tbodyid');
    this.productName      = page.locator('h2.name');
    this.addToCartButton  = page.locator('a.btn-success');
  }

  async waitForLoad(): Promise<void> {
    await this.addToCartButton.waitFor({ state: 'visible' });
  }
}
