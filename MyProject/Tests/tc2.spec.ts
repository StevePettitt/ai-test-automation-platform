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
  deleteFirstCartItem,
} from '../Framework/functions';

/**
 * TC2 — Add product to cart, then delete it
 * Verifies a logged-in user can add a product, confirm it's in the cart,
 * delete it, and confirm the cart is empty.
 */
test('TC2 - Add product to cart then delete', async ({ page }) => {
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

  // ── Action: delete product ───────────────────────────────────────────────────
  await deleteFirstCartItem(page);

  // ── Assert: cart is empty ────────────────────────────────────────────────────
  const remaining = await getCartProductNames(page);
  expect(remaining).toEqual([]);
});
