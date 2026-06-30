# Test Plan — demoblaze.com

## Site
https://www.demoblaze.com/

## Credentials
- Username: generated at runtime — random alphanumeric string (e.g. `user_a3f9k2`) to avoid duplicate registration errors
- Password: `password`

## Product selection
- Always select the **first available product** on the home page

## Test Cases

---

### TC1 — Register, Login, Logout

**Arrange:**
- Generate a unique username (random alphanumeric)
- Navigate to the home page

**Action:**
1. Register a new account using the generated username and password
2. Log in with those credentials
3. Assert the user is logged in (username visible in nav)
4. Log out
5. Assert the user is logged out (login link visible in nav)

**Expected result:** Pass if both assertions hold

---

### TC2 — Add product to cart, then delete it

**Arrange:**
- Generate a unique username (random alphanumeric)
- Register and log in with those credentials

**Action:**
1. From the home page, select the first available product
2. Add it to the cart
3. Navigate to the cart
4. Assert the product appears in the cart
5. Delete the product from the cart
6. Assert the cart is empty

**Expected result:** Pass if both assertions hold

---

### TC3 — Add product to cart, then purchase

**Arrange:**
- Generate a unique username (random alphanumeric)
- Register and log in with those credentials

**Action:**
1. From the home page, select the first available product
2. Add it to the cart
3. Navigate to the cart
4. Assert the product appears in the cart
5. Complete the purchase (fill in purchase form and confirm)
6. close the dialog that appears
7. Assert the order confirmation is shown and the cart is empty

**Expected result:** Pass if both assertions hold

---

## Notes
- TC2 and TC3 are fully independent — each creates its own account and adds its own product
- Credentials are never reused between runs; random username generation prevents registration conflicts
