import { test, expect } from '@playwright/test';
import {
  DEFAULT_PASSWORD,
  generateUsername,
  navigateToHome,
  register,
  login,
  isLoggedIn,
  logout,
  isLoggedOut,
} from '../Framework/functions';

/**
 * TC1 — Register, Login, Logout
 * Verifies a new user can register, log in (username visible in nav),
 * then log out (login link visible in nav).
 */
test('TC1 - Register, Login, Logout', async ({ page }) => {
  // ── Arrange ─────────────────────────────────────────────────────────────────
  const username = generateUsername();
  await navigateToHome(page);

  // ── Action ──────────────────────────────────────────────────────────────────
  await register(page, username, DEFAULT_PASSWORD);
  await login(page, username, DEFAULT_PASSWORD);

  // ── Assert: logged in ────────────────────────────────────────────────────────
  expect(await isLoggedIn(page)).toBe(true);

  // ── Action ──────────────────────────────────────────────────────────────────
  await logout(page);

  // ── Assert: logged out ───────────────────────────────────────────────────────
  expect(await isLoggedOut(page)).toBe(true);
});
