# Framework Functions — demoblaze.com

## Project
- Site: https://www.demoblaze.com/
- Language: Python
- Test framework: Playwright

## Configuration
| Key | Value |
|-----|-------|
| BASE_URL | https://www.demoblaze.com/ |
| DEFAULT_PASSWORD | password |
| PURCHASE_NAME | Test User |
| PURCHASE_COUNTRY | UK |
| PURCHASE_CITY | London |
| PURCHASE_CARD | 1234567890123456 |
| PURCHASE_MONTH | 12 |
| PURCHASE_YEAR | 2026 |

---

## Functions

---

### `generate_username() -> str`

**Purpose:** Generate a unique random username to avoid registration conflicts between test runs.

**Parameters:** None

**Steps:**
1. Generate a random 8-character alphanumeric string (e.g. `user_a3f9k2`)
2. Return it as a string

**Returns:** `str` — unique username, e.g. `"user_a3f9k2"`

**Used by:** TC1, TC2, TC3

---

### `navigate_to_home(page: Page) -> None`

**Purpose:** Navigate to the home page and wait for products to load.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |

**Steps:**
1. Go to `BASE_URL`
2. Wait for `networkidle` load state
3. Wait for at least one product link to be visible — selector: `a.hrefch`

**Returns:** `None`

**Used by:** TC1, TC2, TC3

---

### `register(page: Page, username: str, password: str) -> None`

**Purpose:** Register a new account using the Sign Up modal.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |
| username | str | Username to register |
| password | str | Password to use |

**Steps:**
1. Click the "Sign up" nav link — selector: `#signin2`
2. Wait for the Sign Up modal to be visible — selector: `#signInModal`
3. Fill the username field — selector: `#sign-username`
4. Fill the password field — selector: `#sign-password`
5. Click the "Sign up" submit button — selector: `button[onclick="register()"]`
6. Handle the browser alert that appears (accept it — it confirms registration)
7. Wait for the alert to be dismissed before returning

**Returns:** `None`

**Used by:** TC1, TC2, TC3

---

### `login(page: Page, username: str, password: str) -> None`

**Purpose:** Log in using the Log In modal.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |
| username | str | Username to log in with |
| password | str | Password |

**Steps:**
1. Click the "Log in" nav link — selector: `#login2`
2. Wait for the Log In modal to be visible — selector: `#logInModal`
3. Fill the username field — selector: `#loginusername`
4. Fill the password field — selector: `#loginpassword`
5. Click the "Log in" submit button — selector: `button[onclick="logIn()"]`
6. Wait for `#nameofuser` to become visible — this confirms the login succeeded

**Returns:** `None`

**Used by:** TC1, TC2, TC3

---

### `is_logged_in(page: Page) -> bool`

**Purpose:** Assert whether the current session shows a logged-in state.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |

**Steps:**
1. Check if `#nameofuser` is visible in the navbar
2. Return `True` if visible, `False` otherwise

**Returns:** `bool` — `True` if the user is logged in

**Used by:** TC1

---

### `logout(page: Page) -> None`

**Purpose:** Log out by clicking the Log Out nav link.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |

**Steps:**
1. Click the "Log out" nav link — selector: `#logout2`
2. Wait for `#login2` to become visible — confirms logged-out state

**Returns:** `None`

**Used by:** TC1

---

### `is_logged_out(page: Page) -> bool`

**Purpose:** Assert whether the current session shows a logged-out state.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |

**Steps:**
1. Check if `#login2` is visible in the navbar

**Returns:** `bool` — `True` if the user is logged out

**Used by:** TC1

---

### `click_first_product(page: Page) -> str`

**Purpose:** Click the first product on the home page and return its name.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |

**Steps:**
1. Locate the first product link on the page — selector: `a.hrefch` (first match)
2. Read and store the product name (its text content)
3. Click it
4. Wait for the product detail page to load — wait for `a.btn-success` ("Add to cart") to be visible

**Returns:** `str` — the product name (e.g. `"Samsung galaxy s6"`)

**Used by:** TC2, TC3

---

### `add_to_cart(page: Page) -> None`

**Purpose:** Click "Add to cart" on a product page and dismiss the confirmation alert.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |

**Steps:**
1. Click the "Add to cart" button — selector: `a.btn-success` (text: "Add to cart")
2. Handle the browser alert that appears ("Product added") — accept it
3. Wait for the alert to be dismissed before returning

**Returns:** `None`

**Used by:** TC2, TC3

---

### `navigate_to_cart(page: Page) -> None`

**Purpose:** Navigate to the shopping cart page.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |

**Steps:**
1. Click the "Cart" nav link — selector: `#cartur`
2. Wait for the cart page to load — wait for `#tbodyid` to be visible

**Returns:** `None`

**Used by:** TC2, TC3

---

### `get_cart_product_names(page: Page) -> list[str]`

**Purpose:** Return the names of all products currently in the cart.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |

**Steps:**
1. Find all rows in the cart table — selector: `#tbodyid tr`
2. For each row, read the product name from the second `<td>` (index 1)
3. Return the list of names

**Returns:** `list[str]` — product names, e.g. `["Samsung galaxy s6"]`. Empty list `[]` if the cart is empty.

**Used by:** TC2, TC3

---

### `delete_first_cart_item(page: Page) -> None`

**Purpose:** Delete the first item in the cart by clicking its Delete link.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |

**Steps:**
1. Find the first Delete link in the cart — selector: `#tbodyid tr:first-child a[onclick^="deleteItem"]`
2. Click it
3. Wait for the row to disappear from `#tbodyid` before returning

**Returns:** `None`

**Used by:** TC2

---

### `place_order(page: Page) -> str`

**Purpose:** Click Place Order, fill the purchase form with test data, confirm, and return the confirmation message.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| page | Page | Playwright page object |

**Steps:**
1. Click the "Place Order" button — selector: `button[data-target="#orderModal"]`
2. Wait for the order modal to appear — selector: `#orderModal`
3. Fill Name — selector: `#name` — value: `PURCHASE_NAME` from config
4. Fill Country — selector: `#country` — value: `PURCHASE_COUNTRY`
5. Fill City — selector: `#city` — value: `PURCHASE_CITY`
6. Fill Credit card — selector: `#card` — value: `PURCHASE_CARD`
7. Fill Month — selector: `#month` — value: `PURCHASE_MONTH`
8. Fill Year — selector: `#year` — value: `PURCHASE_YEAR`
9. Click the "Purchase" button — selector: `button[onclick="purchaseOrder()"]`
10. Wait for the sweet-alert confirmation dialog to appear
11. Read the confirmation text from the alert
12. Click the confirm button on the sweet-alert to dismiss it
13. Return the confirmation text

**Returns:** `str` — the confirmation message text (contains "Thank you for your purchase!")

**Used by:** TC3
