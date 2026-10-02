---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Project skeleton + home screen**
  Becomes usable: A running Next.js app with a home screen showing two buttons ("I'm a customer" / "I'm a seller"). You can start the app and see the home screen.
  Why now: Proves the project boots and the dev loop works before adding any complexity.
  PRD ref: `prd.md > Screens and Layout > 1. Home Screen`
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`
  Build: Scaffold Next.js project with App Router, install dependencies, create folder structure, global CSS with warm/approachable theme, home page with two buttons.
  Verify (mechanical): Run `npm run dev` and confirm the app starts with no errors on localhost:3000.
  Learner check: Open http://localhost:3000 and confirm you see the home screen with two buttons.
  Commit: `Add project skeleton and home screen`

- [ ] **2. Database + customer order form (manual only)**
  Becomes usable: Customer can fill in the order form (name, item, quantity, date, time, location), submit it, and see a confirmation screen with their order details and reference number. Data persists in SQLite.
  Why now: Proves the core data path end to end — form → API → database → confirmation — before adding AI complexity.
  PRD ref: `prd.md > Features and Behavior > Customer: Place a Pre-Order`
  Spec ref: `spec.md > Data Model`, `spec.md > Components > Customer Order Form`, `spec.md > Components > Database Module`
  Build: Add better-sqlite3, create db module with sellers/orders tables, build customer order form page, create /api/orders route, build confirmation page.
  Verify (mechanical): Start dev server, submit an order via curl, confirm it returns a reference number and appears in the SQLite database.
  Learner check: Open the customer order form, fill it in, submit, and confirm you see your order details and a reference number.
  Commit: `Add database and customer order form`

- [ ] **3. AI order parsing**
  Becomes usable: Customer can type "2 kota tomorrow at 5:30" in the text box, click Parse, and see the form fields fill automatically. They can edit and submit as normal.
  Why now: The AI feature is the hackathon differentiator — proving it works early de-risks the demo.
  PRD ref: `prd.md > Features and Behavior > Customer: AI-Assisted Order Entry`
  Spec ref: `spec.md > External Services > Groq API`, `spec.md > Components > AI Parse Module`
  Build: Add /api/parse route, integrate Groq API with structured output schema, add text box + Parse button to order form, wire up form filling from AI response.
  Verify (mechanical): Call /api/parse with sample text via curl, confirm it returns structured JSON with item/quantity/date/time.
  Learner check: Type "2 kota tomorrow at 5:30" in the text box, click Parse, and confirm the form fields fill in correctly.
  Commit: `Add AI order parsing with Groq`

- [ ] **4. Seller dashboard + confirm/decline**
  Becomes usable: Seller can set up their profile (name, items, availability), see incoming orders on their dashboard, and confirm or decline each one.
  Why now: The seller side of the loop is what makes this a two-sided product — without it, orders go nowhere.
  PRD ref: `prd.md > Features and Behavior > Seller: One-Time Setup`, `prd.md > Features and Behavior > Seller: Manage Incoming Orders`
  Spec ref: `spec.md > Components > Seller Setup Form`, `spec.md > Components > Seller Dashboard`
  Build: Add seller setup form page, create /api/seller/setup route, build seller dashboard page, create /api/seller/orders routes for list/confirm/decline.
  Verify (mechanical): Start dev server, create a seller via API, submit an order, confirm it appears in the seller dashboard API response.
  Learner check: Open the seller setup form, fill it in, then place an order as a customer and confirm it appears on the seller dashboard.
  Commit: `Add seller dashboard and order management`

- [ ] **5. Prep list + collected/not collected**
  Becomes usable: Seller can view confirmed orders grouped by pickup time in the prep list, and mark each as collected or not collected. Customer sees status updates on refresh.
  Why now: This is the "oh, that's cool" beat — the prep list is the demo moment that proves the concept.
  PRD ref: `prd.md > Features and Behavior > Seller: View Prep List`, `prd.md > Features and Behavior > Seller: Mark Orders as Collected`
  Spec ref: `spec.md > Components > Seller Prep List`
  Build: Build prep list page grouped by pickup time, create /api/seller/prep-list route, add collect/not collected buttons, wire up customer status refresh.
  Verify (mechanical): Confirm via API that confirmed orders are grouped by pickup time and that marking collected updates the order status.
  Learner check: Confirm an order as a seller, view the prep list, mark it collected, then refresh the customer confirmation page and confirm the status updated.
  Commit: `Add prep list and collected tracking`

- [ ] **6. Order lookup + polish**
  Becomes usable: Customer can look up their order by reference number. Empty states, error messages, and visual polish are in place.
  Why now: The lookup screen makes the MVP usable without keeping a tab open. Polish makes the demo presentable.
  PRD ref: `prd.md > Features and Behavior > Customer: Look Up Order`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Important Failure Modes`, `spec.md > Look and Feel`
  Build: Build order lookup page, add empty states for seller dashboard and prep list, add error messages for no-match and not-found, apply visual polish.
  Verify (mechanical): Confirm lookup returns order for valid reference and "Order not found" for invalid. Confirm empty states render correctly.
  Learner check: Place an order, note the reference number, open the lookup page, enter it, and confirm you see your order. Also try an invalid number and confirm you see "Order not found."
  Commit: `Add order lookup and polish`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after Slice 2 (customer can place an order end to end)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [to be completed after build]
Route and stops: [to be completed after build]
Edit outcome: [to be completed after build]
Reflection: [to be completed after build]
Activity mode: [to be completed after build]

## Revisions

