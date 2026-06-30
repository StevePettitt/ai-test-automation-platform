import { Page } from '@playwright/test';
import { HomePage } from '../POM/HomePage';
import { ProductPage } from '../POM/ProductPage';
import { CartPage } from '../POM/CartPage';

// ── Config ─────────────────────────────────────────────────────────────────────

export const BASE_URL          = 'https://www.demoblaze.com/';
export const DEFAULT_PASSWORD  = 'password';
export const PURCHASE_NAME     = 'Test User';
export const PURCHASE_COUNTRY  = 'UK';
export const PURCHASE_CITY     = 'London';
export const PURCHASE_CARD     = '1234567890123456';
export const PURCHASE_MONTH    = '12';
export const PURCHASE_YEAR     = '2026';

// ── Functions ──────────────────────────────────────────────────────────────────

/** Generate a unique random username to avoid registration conflicts. */
export function generateUsername(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `user_${suffix}`;
}

/** Navigate to the home page and wait for products to load. */
export async function navigateToHome(page: Page): Promise<void> {
  const home = new HomePage(page);
  await home.navigate();
}

/** Register a new account using the Sign Up modal. */
export async function register(page: Page, username: string, password: string): Promise<void> {
  const home = new HomePage(page);

  await home.signupLink.click();
  await home.signupModal.waitFor({ state: 'visible' });
  await home.signupUsername.fill(username);
  await home.signupPassword.fill(password);

  page.once('dialog', dialog => dialog.accept());
  await home.signupSubmit.click();
  await page.waitForTimeout(500);
}

/** Log in using the Log In modal. */
export async function login(page: Page, username: string, password: string): Promise<void> {
  const home = new HomePage(page);

  await home.loginLink.click();
  await home.loginModal.waitFor({ state: 'visible' });
  await home.loginUsername.fill(username);
  await home.loginPassword.fill(password);
  await home.loginSubmit.click();

  await home.usernameDisplay.waitFor({ state: 'visible' });
}

/** Return true if the username display is visible in the navbar. */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const home = new HomePage(page);
  return home.usernameDisplay.isVisible();
}

/** Log out by clicking the Log Out nav link. */
export async function logout(page: Page): Promise<void> {
  const home = new HomePage(page);
  await home.logoutLink.click();
  await home.loginLink.waitFor({ state: 'visible' });
}

/** Return true if the Log In link is visible (no active session). */
export async function isLoggedOut(page: Page): Promise<boolean> {
  const home = new HomePage(page);
  return home.loginLink.isVisible();
}

/** Click the first product on the home page; return its name. */
export async function clickFirstProduct(page: Page): Promise<string> {
  const home = new HomePage(page);
  const firstLink = home.productLinks.first();
  const productName = (await firstLink.innerText()).trim();
  await firstLink.click();

  const product = new ProductPage(page);
  await product.waitForLoad();
  return productName;
}

/** Click "Add to cart" and dismiss the confirmation alert. */
export async function addToCart(page: Page): Promise<void> {
  const product = new ProductPage(page);
  page.once('dialog', dialog => dialog.accept());
  await product.addToCartButton.click();
  await page.waitForTimeout(500);
}

/** Navigate to the cart page via the Cart nav link. */
export async function navigateToCart(page: Page): Promise<void> {
  const product = new ProductPage(page);
  await product.cartLink.click();

  const cart = new CartPage(page);
  await cart.waitForLoad();
}

/** Return the names of all products currently in the cart. */
export async function getCartProductNames(page: Page): Promise<string[]> {
  const cart = new CartPage(page);
  const rows = await cart.cartRows.all();
  const names: string[] = [];
  for (const row of rows) {
    const cells = await row.locator('td').all();
    if (cells.length >= 2) {
      names.push((await cells[1].innerText()).trim());
    }
  }
  return names;
}

/** Delete the first item in the cart and wait for it to disappear. */
export async function deleteFirstCartItem(page: Page): Promise<void> {
  const cart = new CartPage(page);
  const initialCount = await cart.cartRows.count();
  await cart.deleteLinks.first().click();
  await page.waitForFunction(
    (count: number) => document.querySelectorAll('#tbodyid tr').length < count,
    initialCount
  );
}

/** Fill and submit the Place Order form; return the confirmation message. */
export async function placeOrder(page: Page): Promise<string> {
  const cart = new CartPage(page);

  await cart.placeOrderButton.click();
  await cart.orderModal.waitFor({ state: 'visible' });

  await cart.orderName.fill(PURCHASE_NAME);
  await cart.orderCountry.fill(PURCHASE_COUNTRY);
  await cart.orderCity.fill(PURCHASE_CITY);
  await cart.orderCard.fill(PURCHASE_CARD);
  await cart.orderMonth.fill(PURCHASE_MONTH);
  await cart.orderYear.fill(PURCHASE_YEAR);

  await cart.purchaseButton.click();

  // The sweet-alert is a DOM modal — the container div has class 'sweet-alert',
  // the heading is an h2 *inside* it (not h2.sweet-alert)
  const sweetAlert = page.locator('div.sweet-alert.visible');
  await sweetAlert.waitFor({ state: 'visible' });

  const heading = page.locator('div.sweet-alert h2');
  const body    = page.locator('div.sweet-alert p.lead');

  const message = `${(await heading.innerText()).trim()} ${(await body.innerText()).trim()}`.trim();

  // Dismiss the sweet-alert and wait for it to disappear
  await page.locator('div.sweet-alert button.confirm').click();
  await sweetAlert.waitFor({ state: 'hidden' });

  return message;
}
