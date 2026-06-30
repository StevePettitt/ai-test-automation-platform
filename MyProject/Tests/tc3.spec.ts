import { test, expect } from '@playwright/test';
import {
  DEFAULT_PASSWORD,
  generateUsername,
  navigateToHome,
  register,
  login,
  clickFirstProduct,
  addToCart,
  navigateToCart,
  getCartProductNames,
  placeOrder,
} from '../Framework/functions';

/**
 * TC3 — Add product to cart, then purchase
 * Verifies a logged-in user can add a product, confirm it's in the cart,
 * complete the purchase, and receive an order confirmation.
 */
test('TC3 - Add product to cart then purchase', async ({ page }) => {
  // ── Arrange ─────────────────────────────────────────────────────────────────
  const username = generateUsername();
  await navigateToHome(page);
  await register(page, username, DEFAULT_PASSWORD);
  await login(page, username, DEFAULT_PASSWORD);

  // ── Action: add product ──────────────────────────────────────────────────────
  const productName = await clickFirstProduct(page);
  await addToCart(page);
  await navigateToCart(page);

  // ── Assert: product in cart ──────────────────────────────────────────────────
  const cartItems = await getCartProductNames(page);
  expect(cartItems.length).toBeGreaterThan(0);
  expect(cartItems.some(item => item.toLowerCase().includes(productName.toLowerCase()))).toBe(true);

  // ── Action: purchase ─────────────────────────────────────────────────────────
  const confirmation = await placeOrder(page);

  // ── Assert: order confirmed ──────────────────────────────────────────────────
  expect(confirmation.toLowerCase()).toContain('thank you');
});
