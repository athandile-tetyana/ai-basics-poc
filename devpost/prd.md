---
doc: prd
status: approved
---

# PreOrder Kasi — Product Requirements

One line: A pre-order food app for South Africa where customers order ahead for a specific pickup time and sellers get a clear prep list to plan production.
Source: `scope.md > The Unique Kernel`.

## The Core Journey

1. **User opens the app** and sees two buttons: "I'm a customer" and "I'm a seller".
2. **Customer** taps "I'm a customer" and sees an order form with an AI text box at the top and form fields below (name, item, quantity, pickup date, pickup time, location).
3. **Customer** either types a natural-language order in the text box and clicks "Parse" (AI fills the form fields), or fills the form manually. They can edit any field before submitting.
4. **Customer** submits the order. The system automatically matches it to a seller who offers the requested item and is available at the requested time. If no seller matches, the customer sees a clear message: "No seller available for that item or time".
5. **Customer** sees a confirmation screen with their order details (item, quantity, pickup time), status (Pending), their name, and a reference number.
6. **Seller** (in another tab or browser) opens the app, taps "I'm a seller", and sees their dashboard with incoming orders.
7. **Seller** confirms or declines each order. Confirmed orders appear in the prep list view, grouped by pickup time.
8. **Customer** refreshes or taps "check status" to see their order update to Confirmed (with pickup time and location) or Declined.
9. **Seller** prepares food according to the prep list. When the customer arrives, the seller marks the order as "collected" from the prep list view.
10. **Seller** can also mark an order as "not collected" if the customer doesn't show up.

## Screens and Layout

### 1. Home Screen
- Two large buttons: "I'm a customer" and "I'm a seller"
- Simple, centered layout
- App name "PreOrder Kasi" at the top

### 2. Customer Order Form
- AI text box at the top: single-line input with placeholder "Describe your order (e.g. '2 kota, tomorrow at 5:30')" and a "Parse" button
- Form fields below (always visible): Name, Item, Quantity, Pickup Date, Pickup Time, Location (text field)
- Submit button
- If AI parse fails or is slow, the customer can ignore the text box and fill the form directly

### 3. Customer Order Confirmation
- Order details: item, quantity, pickup date/time, location
- Customer name
- Reference number (incrementing order ID)
- Current status (Pending, Confirmed, Declined, Collected, Not collected)
- "Check status" button to refresh

### 4. Seller Setup Form (first time only)
- Name
- Items they sell (comma-separated list, e.g. "kota, chicken feet, pap")
- Available pickup window (start time and end time, e.g. "16:00 to 20:00")
- Submit button
- After setup, seller can edit items or availability from the dashboard

### 5. Seller Dashboard
- List of incoming orders, each showing: customer name, item, quantity, pickup time, status
- "Confirm" and "Decline" buttons for each pending order
- Link/button to view prep list
- Option to edit items or availability

### 6. Seller Prep List
- Confirmed orders grouped by pickup time slot
- Each time slot shows: time, list of items with quantities, number of orders
- Each order can be marked as "collected" or "not collected"
- Only confirmed orders appear here; declined orders do not

### 7. Order Lookup
- Simple screen with a single input: "Enter your reference number"
- Customer enters the reference number from their confirmation screen
- Shows the order details and current status (same as confirmation screen)
- Accessible from the home screen ("Look up my order" link)

## Look and Feel

- Warm, approachable, South African, food-related character
- Not dark, not corporate, not techy
- Simple and clean — not a heavy custom design system
- Exact colours and typography to be proposed by the agent during spec/build, keeping it simple and achievable within the hackathon time limit

## Features and Behavior

### Customer: Place a Pre-Order
- As a customer, I want to place a pre-order for a specific pickup time so that my food is ready when I arrive.
  - [ ] Acceptance criterion: Customer can enter name, item, quantity, pickup date, pickup time, and location, and submit an order
  - [ ] Acceptance criterion: After submitting, customer sees a confirmation screen with order details, their name, a reference number, and status "Pending"
  - [ ] Acceptance criterion: If no seller matches the item or time, customer sees "No seller available for that item or time"

### Customer: AI-Assisted Order Entry
- As a customer, I want to type my order in plain language so that I don't have to fill in every field manually.
  - [ ] Acceptance criterion: Customer can type "2 kota tomorrow at 5:30" in the text box, click "Parse", and the form fields are filled with item=kota, quantity=2, date=tomorrow, time=5:30
  - [ ] Acceptance criterion: Customer can edit any field after parsing and before submitting
  - [ ] Acceptance criterion: If AI fails, is slow, or produces wrong results, the customer can fill the form manually and submit — the text box is never required

### Customer: Check Order Status
- As a customer, I want to check my order status so that I know when the seller has confirmed it.
  - [ ] Acceptance criterion: Customer can refresh or tap "Check status" to see updates
  - [ ] Acceptance criterion: Status changes from Pending to Confirmed (with pickup time and location) or Declined
  - [ ] Acceptance criterion: No real-time updates — customer must manually refresh

### Seller: One-Time Setup
- As a seller, I want to set up my profile once so that the system knows what I sell and when I'm available.
  - [ ] Acceptance criterion: First-time seller sees a setup form with name, items, and availability window
  - [ ] Acceptance criterion: After setup, seller lands on the dashboard
  - [ ] Acceptance criterion: Seller can edit items or availability later from the dashboard

### Seller: Manage Incoming Orders
- As a seller, I want to see and respond to incoming orders so that I can plan my preparation.
  - [ ] Acceptance criterion: Dashboard lists all incoming orders with customer name, item, quantity, pickup time, and status
  - [ ] Acceptance criterion: Seller can confirm or decline each pending order
  - [ ] Acceptance criterion: Confirmed orders appear in the prep list; declined orders do not

### Seller: View Prep List
- As a seller, I want to see my confirmed orders grouped by pickup time so that I know what to prepare and by when.
  - [ ] Acceptance criterion: Prep list shows confirmed orders grouped by time slot (e.g., "5:30 PM — 2x kota, 1x chicken feet meal")
  - [ ] Acceptance criterion: Each time slot shows the items, quantities, and number of orders
  - [ ] Acceptance criterion: Seller can see which orders make up each time slot

### Seller: Mark Orders as Collected
- As a seller, I want to mark orders as collected or not collected so that I can track no-shows.
  - [ ] Acceptance criterion: Seller can mark an individual order as "collected" from the prep list view
  - [ ] Acceptance criterion: Seller can mark an individual order as "not collected" from the prep list view
  - [ ] Acceptance criterion: Collected/not collected status is visible to the customer when they check status

### Customer: Look Up Order
- As a customer, I want to look up my order by reference number so that I can check status without keeping the tab open.
  - [ ] Acceptance criterion: Customer can enter their reference number on the lookup screen and see their order details and current status
  - [ ] Acceptance criterion: Lookup screen is accessible from the home screen
  - [ ] Acceptance criterion: If the reference number doesn't exist, customer see "Order not found"

### Data Persistence
- As a user, I want my data to persist so that orders and prep lists survive tab closes, refreshes, and browser restarts.
  - [ ] Acceptance criterion: Orders placed by a customer are still visible after closing and reopening the app
  - [ ] Acceptance criterion: Seller dashboard and prep list are still populated after closing and reopening the app
  - [ ] Acceptance criterion: Data is stored in a simple database (SQLite), not just in memory

## States and Boundaries

- **First use (seller):** Seller sees the setup form. After submitting, they see the dashboard.
- **First use (customer):** Customer sees the order form. No setup needed.
- **Empty state (seller dashboard):** "No orders yet" message when there are no incoming orders.
- **Empty state (prep list):** "No confirmed orders yet" message when there are no confirmed orders.
- **No match:** Customer sees "No seller available for that item or time" when no seller matches.
- **AI failure:** Customer can always fall back to manual form entry. The text box is never required.
- **Order lifecycle:** Pending → Confirmed → Collected/Not collected, or Pending → Declined.
- **No real-time updates:** Customer must refresh or tap "Check status" to see status changes.
- **No login:** Identified by name fields only.
- **No prices:** Cash on collection only.
- **English only.**

## Product Decisions

- **One app, two buttons** — not separate customer and seller apps. Simpler to build and demo.
- **No login system** — just name fields. Keeps the MVP small and avoids auth complexity.
- **AI text box is a shortcut, not a requirement** — the form always works on its own. This is the safety net that makes the AI feature low-risk.
- **No real-time updates** — refresh/check status is enough for the demo. Websockets or polling would add complexity without proving the core concept.
- **SQLite for persistence** — data must survive tab switches and refreshes. In-memory storage would break the demo.
- **No prices** — cash on collection. Testing the pre-order and prep list flow, not payments.
- **Simple matching on item + time** — no ranking, no customer choice. Just a basic match.
- **English only** — isiXhosa and Afrikaans are deferred.
- **Seller setup is one-time** — a simple form, not a full onboarding flow. Editable later but not the focus of the demo.
- **Single seller for hackathon** — the seller setup form exists in the product, but the build and demo only need to support one seller account. No multi-seller selection or seller matching beyond the single seller.

## What We're Building

- Home screen with two buttons (customer / seller) and "Look up my order" link
- Customer order form with AI text box and manual form fields
- Customer order confirmation screen with status checking
- Order lookup screen (enter reference number to see status)
- Seller one-time setup form (name, items, availability)
- Seller dashboard with incoming orders list (confirm/decline)
- Seller prep list grouped by pickup time (mark collected/not collected)
- Automatic matching on item + time (single seller for hackathon)
- SQLite database for persistence
- Natural-language order parsing AI feature with form fallback

## Deferred From the POC

- **WhatsApp integration** — adds API dependencies and complexity. Start with a web app.
- **Multilingual support (isiXhosa, Afrikaans)** — English is enough for the demo.
- **Online payments or deposits** — cash on collection is simpler and more realistic for informal sellers.
- **Advanced matching based on seller capacity** — simple item + time matching is enough to prove the concept.
- **Seller analytics and demand forecasting** — not needed for the core loop.
- **Multiple sellers per order or order splitting** — one seller per order is enough.
- **Ratings and reviews** — trust comes from repeat customers first.
- **Deposits or penalties** — no-shows are an open business risk to test, not an MVP feature.
- **Real-time updates** — refresh/check status is sufficient for the demo.

## Possible Later Enhancements

- WhatsApp integration for sellers who prefer it
- Multilingual support (isiXhosa, Afrikaans)
- Online payments or deposits to reduce no-shows
- Advanced matching based on seller capacity and demand
- Seller analytics and demand forecasting
- Ratings and reviews system
- Delivery logistics (currently cut — customer picks up)

## Non-Goals

- **Delivery logistics** — too complex and costly for a solo builder. Customer picks up.
- **WhatsApp integration** — adds complexity and API dependencies. Start with a web app.
- **Online payments** — cash on collection is simpler and more realistic for informal sellers.
- **Multilingual support** — start with English for the demo.
- **Complex maps** — a simple text location field is sufficient.
- **Ratings and reviews** — trust comes from repeat customers first.
- **Deposits or penalties** — no-shows are an open business risk to test, not an MVP feature.
- **Real-time updates** — refresh/check status is enough for the demo.
- **Login system** — name fields only, no auth.
- **Prices** — cash on collection, no payment processing.

## Open Questions

- None blocking spec approval. The product is well-defined and ready for technical planning.
