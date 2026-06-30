import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the demoblaze Cart page (cart.html).
 * Shows cart items, delete links, the Place Order button, and the order modal.
 */
export class CartPage {
  readonly page: Page;
  readonly url = 'https://www.demoblaze.com/cart.html';

  // ── Nav ─────────────────────────────────────────────────────────────────────
  readonly cartLink: Locator;

  // ── Cart table ──────────────────────────────────────────────────────────────
  /** The <tbody> containing all cart rows */
  readonly cartBody: Locator;
  /** Collection of all <tr> rows — use .count() or .all() */
  readonly cartRows: Locator;
  /** Collection of Delete links — one per row */
  readonly deleteLinks: Locator;
  readonly total: Locator;

  // ── Place Order ─────────────────────────────────────────────────────────────
  readonly placeOrderButton: Locator;

  // ── Order modal ─────────────────────────────────────────────────────────────
  readonly orderModal: Locator;
  readonly orderName: Locator;
  readonly orderCountry: Locator;
  readonly orderCity: Locator;
  readonly orderCard: Locator;
  readonly orderMonth: Locator;
  readonly orderYear: Locator;
  readonly purchaseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartLink = page.locator('#cartur');

    this.cartBody    = page.locator('#tbodyid');
    this.cartRows    = page.locator('#tbodyid tr');
    this.deleteLinks = page.locator('a[onclick^="deleteItem"]');
    this.total       = page.locator('#totalp');

    this.placeOrderButton = page.locator('button[data-target="#orderModal"]');

    this.orderModal   = page.locator('#orderModal');
    this.orderName    = page.locator('#name');
    this.orderCountry = page.locator('#country');
    this.orderCity    = page.locator('#city');
    this.orderCard    = page.locator('#card');
    this.orderMonth   = page.locator('#month');
    this.orderYear    = page.locator('#year');
    this.purchaseButton = page.locator('button[onclick="purchaseOrder()"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForLoad();
  }

  async waitForLoad(): Promise<void> {
    await this.cartBody.waitFor({ state: 'visible' });
  }
}
