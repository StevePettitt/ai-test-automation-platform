import { Page, Locator } from '@playwright/test';

/**
 * Page Object for the demoblaze Home / Index page.
 * Covers the product listing, navbar, and the Sign Up / Log In modals
 * which are rendered on this page.
 */
export class HomePage {
  readonly page: Page;
  readonly url = 'https://www.demoblaze.com/';

  // ── Nav links ───────────────────────────────────────────────────────────────
  readonly signupLink: Locator;
  readonly loginLink: Locator;
  readonly logoutLink: Locator;
  readonly usernameDisplay: Locator;
  readonly cartLink: Locator;

  // ── Product listing ─────────────────────────────────────────────────────────
  /** Collection of product links — use .first() for the first product */
  readonly productLinks: Locator;

  // ── Sign Up modal ───────────────────────────────────────────────────────────
  readonly signupModal: Locator;
  readonly signupUsername: Locator;
  readonly signupPassword: Locator;
  readonly signupSubmit: Locator;

  // ── Log In modal ────────────────────────────────────────────────────────────
  readonly loginModal: Locator;
  readonly loginUsername: Locator;
  readonly loginPassword: Locator;
  readonly loginSubmit: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signupLink      = page.locator('#signin2');
    this.loginLink       = page.locator('#login2');
    this.logoutLink      = page.locator('#logout2');
    this.usernameDisplay = page.locator('#nameofuser');
    this.cartLink        = page.locator('#cartur');

    this.productLinks = page.locator('a.hrefch');

    this.signupModal    = page.locator('#signInModal');
    this.signupUsername = page.locator('#sign-username');
    this.signupPassword = page.locator('#sign-password');
    this.signupSubmit   = page.locator('button[onclick="register()"]');

    this.loginModal    = page.locator('#logInModal');
    this.loginUsername = page.locator('#loginusername');
    this.loginPassword = page.locator('#loginpassword');
    this.loginSubmit   = page.locator('button[onclick="logIn()"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForLoad();
  }

  async waitForLoad(): Promise<void> {
    await this.productLinks.first().waitFor({ state: 'visible' });
  }
}
