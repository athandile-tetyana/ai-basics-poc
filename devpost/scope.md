---
doc: scope
status: approved
---

# PreOrder Kasi — Scope

Order ahead for a specific time. Sellers plan production. Customers get food when they need it.

## The Unique Kernel

Ordering ahead for a specific time — not "order now," but "I need this ready at 5:30 tomorrow." The seller knows the night before what to prepare and when the customer plans to collect it. The seller prep list turns advance orders into "prepare 10 chicken feet meals by 5:30."

*This scheduled pre-order + seller prep workflow is the differentiation we are testing, not a proven market fact.*

## Who It's For

**Customer:** A person in South Africa with a schedule that doesn't match normal food-selling hours — someone who finishes work late, leaves very early, or needs food ready at a specific time.

**Seller:** An informal food seller or small local food business who cooks to order and wants to plan production in advance.

## The Core Loop

1. **Customer creates an advance order** — Food, quantity, future pickup date/time
2. **Seller confirms or declines the order** — Two-step confirmation before preparation
3. **Prep list is generated for the seller** — "Prepare 10 chicken feet meals by 5:30"
4. **Customer receives pickup confirmation** — Pickup info, time, and location
5. **Seller marks collected or not collected** — Tracks no-shows for future learning

## What "Working" Looks Like

A customer creates an advance order for a specific pickup time. The seller confirms and gets a prep list. The customer receives pickup confirmation. The seller marks the order as collected or not collected.

**The "oh, that's cool" beat:** The seller prep list — turning scattered advance orders into a clear production plan.

## The ONE AI Feature

**Natural-language order parsing:** A customer types something like "2 kota tomorrow at 5:30" and AI extracts:
- Item (kota)
- Quantity (2)
- Pickup date (tomorrow)
- Pickup time (5:30)

The customer can then review and confirm the structured order.

**Safety net:** The normal form remains the fallback if AI fails, so a slow or failed AI call cannot break the core flow.

## No-Show Handling

- Step 1: Customer places the order
- Step 2: Seller confirms they can fulfill it
- Step 3: Seller starts preparing
- Step 4: Seller marks "collected" or "not collected" at pickup time

No deposits or penalties in MVP. No-shows are an open business risk to test with 1-3 sellers.

## Scope Boundaries

### IN — What's in the MVP

- Customer selects food and quantity
- Customer chooses a future pickup date and time
- Location as a simple context field (no complex location matching)
- Basic matching: choose a seller who offers the requested item and is available for the requested pickup time (no ranking or advanced matching). Seller availability is a simple field, e.g. "Available 16:00–20:00" — no complex scheduling.
- Seller dashboard with orders and prep list
- Seller confirms or declines an order
- Customer sees confirmation with pickup info
- Seller marks order as "collected" or "not collected"
- One AI feature: natural-language order parsing (with form fallback)
- English only
- Cash on collection

### LATER — Worth doing, just not now

- WhatsApp integration for sellers who prefer it
- Multilingual support (isiXhosa, Afrikaans)
- Online payments or deposits to reduce no-shows
- Advanced matching based on seller capacity
- Seller analytics and demand forecasting
- Multiple sellers per order or order splitting

### CUT — Explicitly out, each with a reason

- **Delivery logistics** — Too complex and costly for a solo builder. Customer picks up.
- **WhatsApp integration** — Adds complexity and API dependencies. Start with a web app.
- **Online payments** — Cash on collection is simpler and more realistic for informal sellers.
- **Multilingual support** — Start with English for the demo. Add isiXhosa and Afrikaans later.
- **Complex maps** — Location matters, but a simple text address or area selector is sufficient.
- **Ratings and reviews** — Trust comes from repeat customers first. Add later.
- **Deposits or penalties** — List no-shows as an open business risk to test, not an MVP feature.

## Open Business Risks

- **No-shows** — With cash and no deposit, the seller carries the loss if a customer doesn't collect. Test with 1-3 sellers to measure no-show rates.
- **Seller adoption** — Sellers may not update availability or confirm orders quickly. Test manually with 1-3 sellers.
- **Customer behavior** — People may not actually order food in advance. This is the main hypothesis to test.

## Manual Test Plan

In parallel with the build, test manually with 1-3 sellers and a few customers:
- Do sellers understand the prep list?
- Do customers actually place pre-orders?
- What is the no-show rate?
- What friction points exist in the workflow?
