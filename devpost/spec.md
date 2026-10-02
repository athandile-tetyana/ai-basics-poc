---
doc: spec
status: draft
---

# PreOrder Kasi — Technical Spec

## How This Works, In Plain Language

PreOrder Kasi is a single Next.js app that runs on your laptop. It has two parts: the **frontend** (what people see in the browser — buttons, forms, lists) and the **backend** (API routes that handle logic and talk to the database). Both live in the same project, so you run one command and everything works.

The database is a SQLite file on your laptop — think of it as a spreadsheet that your app reads and writes. When a customer places an order, it gets saved to this file. When the seller opens their dashboard, it reads from the same file. That's how data persists between tabs and sessions.

The AI order parsing uses Groq's free API. When a customer types "2 kota tomorrow at 5:30" and clicks Parse, the app sends that text to Groq, which returns structured JSON like `{"item": "kota", "quantity": 2, "date": "tomorrow", "time": "5:30"}`. The app then fills in the form fields with those values.

**Why this shape:** One project, one command to start, no separate frontend and backend to wire together. SQLite is a file on disk — no database server to install or configure. Groq is a simple HTTP API — no complex SDK or auth flow. Everything is explainable in one sentence.

## The Core Journey Through the System

1. **User opens the app** → Next.js serves the home page with two buttons.
2. **Customer taps "I'm a customer"** → Next.js serves the order form page. The form has an AI text box and manual fields.
3. **Customer types "2 kota tomorrow at 5:30" and clicks Parse** → The browser sends the text to a Next.js API route (`/api/parse`). That route calls Groq's API with the text and a JSON schema. Groq returns structured data. The API route sends it back to the browser, which fills the form fields.
4. **Customer reviews and submits** → The browser sends the order data to another API route (`/api/orders`). That route checks if a seller matches (item + availability), saves the order to SQLite, and returns the order with a reference number.
5. **Customer sees confirmation** → The browser shows the order details, status (Pending), and reference number.
6. **Seller opens the app in another tab** → Taps "I'm a seller" → Next.js serves the seller dashboard. An API route (`/api/seller/orders`) reads all orders from SQLite and returns them.
7. **Seller confirms an order** → The browser sends the confirmation to an API route (`/api/seller/orders/[id]/confirm`). That route updates the order status in SQLite to "confirmed".
8. **Seller views prep list** → An API route (`/api/seller/prep-list`) reads all confirmed orders from SQLite, groups them by pickup time, and returns them. The browser renders the grouped list.
9. **Seller marks collected** → The browser sends the update to an API route (`/api/seller/orders/[id]/collect`). That route updates the order status in SQLite to "collected".
10. **Customer refreshes** → The browser calls the order status API route (`/api/orders/[id]`), which reads the latest status from SQLite and returns it.

PRD ref: `prd.md > The Core Journey`.

## Stack

- **Next.js 15 (App Router)** — React framework that handles both frontend pages and backend API routes in one project. Chosen because the learner is comfortable with Next.js and it's the simplest way to build a full-stack app.
  - Docs: https://nextjs.org/docs
- **better-sqlite3** — Node.js library for reading and writing SQLite databases. Synchronous, fast, no ORM. Chosen for simplicity: raw SQL queries that are easy to read and explain.
  - Docs: https://github.com/WiseLibs/better-sqlite3
- **Groq API** — Free-tier AI API for natural-language order parsing. No credit card required. Supports structured outputs (JSON schema) so the AI returns exactly the shape we need.
  - Docs: https://console.groq.com/docs
  - Free tier: 30 requests/min, 1,000 requests/day
- **Plain CSS with CSS modules** — Scoped CSS per component. No build tools, no utility classes. Chosen to keep the stack minimal and easy to explain.

## Where It Runs and How Someone Tries It

- **Runtime:** Local development on the learner's laptop
- **Requirements:** Node.js 20+, a Groq API key (free)
- **Start command:** `npm run dev` (starts Next.js on localhost:3000)
- **What to open:** http://localhost:3000 in a browser
- **Demo recording:** Two browser tabs side by side — one as customer, one as seller
- **Submission:** Short demo video + public GitHub repository. Deployment is optional.

## Look and Feel

- Warm, approachable, South African, food-related character
- Not dark, not corporate, not techy
- Simple and clean — not a heavy custom design system
- Warm earthy tones (terracotta, warm cream, soft greens) — evoking food, warmth, and local character
- Clean sans-serif typography (system fonts — no custom font loading)
- Generous whitespace, rounded corners, friendly button styles
- CSS modules for component-scoped styling

## Components

### Home Page
- Two large buttons: "I'm a customer" and "I'm a seller"
- "Look up my order" link
- Serves as the entry point for all flows
- PRD ref: `prd.md > Screens and Layout > 1. Home Screen`

### Customer Order Form
- AI text box at the top with "Parse" button
- Manual form fields below: Name, Item, Quantity, Pickup Date, Pickup Time, Location
- Submit button
- Calls `/api/parse` for AI parsing, `/api/orders` for submission
- PRD ref: `prd.md > Features and Behavior > Customer: Place a Pre-Order` and `Customer: AI-Assisted Order Entry`

### Customer Order Confirmation
- Shows order details, customer name, reference number, current status
- "Check status" button that calls `/api/orders/[id]`
- PRD ref: `prd.md > Features and Behavior > Customer: Check Order Status`

### Order Lookup
- Single input for reference number
- Calls `/api/orders/[id]` to fetch and display order status
- PRD ref: `prd.md > Features and Behavior > Customer: Look Up Order`

### Seller Setup Form
- Name, items (comma-separated), availability window (start/end time)
- Calls `/api/seller/setup` to create seller profile
- PRD ref: `prd.md > Features and Behavior > Seller: One-Time Setup`

### Seller Dashboard
- Lists all incoming orders with customer name, item, quantity, pickup time, status
- Confirm/Decline buttons for pending orders
- Link to prep list view
- Calls `/api/seller/orders` for list, `/api/seller/orders/[id]/confirm` and `/api/seller/orders/[id]/decline` for actions
- PRD ref: `prd.md > Features and Behavior > Seller: Manage Incoming Orders`

### Seller Prep List
- Confirmed orders grouped by pickup time slot
- Each order can be marked as "collected" or "not collected"
- Calls `/api/seller/prep-list` for grouped data, `/api/seller/orders/[id]/collect` for status updates
- PRD ref: `prd.md > Features and Behavior > Seller: View Prep List` and `Seller: Mark Orders as Collected`

### Database Module
- Singleton connection to SQLite file (`data/preorder.db`)
- Creates tables on first run: `sellers`, `orders`
- Exports query functions used by API routes
- PRD ref: `prd.md > Features and Behavior > Data Persistence`

### AI Parse Module
- Sends order text to Groq API with a JSON schema
- Returns structured data: `{ item, quantity, date, time }`
- Handles API errors gracefully (returns null, form fallback works)
- PRD ref: `prd.md > Features and Behavior > Customer: AI-Assisted Order Entry`

## Data Model

### sellers table
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key, auto-increment |
| name | TEXT | Seller name |
| items | TEXT | Comma-separated list of items they sell |
| available_start | TEXT | Availability window start (e.g. "16:00") |
| available_end | TEXT | Availability window end (e.g. "20:00") |
| created_at | TEXT | Timestamp |

### orders table
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key, auto-increment (used as reference number) |
| customer_name | TEXT | Customer's name |
| item | TEXT | Food item ordered |
| quantity | INTEGER | Number of items |
| pickup_date | TEXT | Pickup date (ISO format) |
| pickup_time | TEXT | Pickup time (HH:MM format) |
| location | TEXT | Pickup location (text) |
| status | TEXT | pending, confirmed, declined, collected, not_collected |
| seller_id | INTEGER | Foreign key to sellers table |
| created_at | TEXT | Timestamp |

**How data moves:**
- Customer submits order → API route inserts row into `orders` table with status "pending"
- Seller confirms → API route updates `orders.status` to "confirmed"
- Seller views prep list → API route reads all "confirmed" orders, groups by `pickup_time`
- Seller marks collected → API route updates `orders.status` to "collected" or "not_collected"
- Customer checks status → API route reads `orders` row by `id` and returns current status

**What persists:** All order and seller data lives in the SQLite file. Closing the tab, refreshing, or restarting the app does not lose data. The file is at `data/preorder.db`.

## File Structure

```
preorder-kasi/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (html, body, global styles)
│   │   ├── page.tsx             # Home screen (two buttons)
│   │   ├── globals.css          # Global styles, CSS variables
│   │   ├── customer/
│   │   │   ├── order/
│   │   │   │   ├── page.tsx     # Customer order form
│   │   │   │   └── order.module.css
│   │   │   ├── confirmation/
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx # Order confirmation screen
│   │   │   │       └── confirmation.module.css
│   │   │   └── lookup/
│   │   │       ├── page.tsx     # Order lookup screen
│   │   │       └── lookup.module.css
│   │   ├── seller/
│   │   │   ├── setup/
│   │   │   │   ├── page.tsx     # Seller setup form
│   │   │   │   └── setup.module.css
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx     # Seller dashboard (orders list)
│   │   │   │   └── dashboard.module.css
│   │   │   └── prep-list/
│   │   │       ├── page.tsx     # Prep list view
│   │   │       └── prep-list.module.css
│   │   └── api/
│   │       ├── parse/
│   │       │   └── route.ts     # POST: AI order parsing
│   │       ├── orders/
│   │       │   ├── route.ts     # POST: create order
│   │       │   └── [id]/
│   │       │       └── route.ts # GET: get order by ID
│   │       └── seller/
│   │           ├── setup/
│   │           │   └── route.ts # POST: seller setup
│   │           ├── orders/
│   │           │   ├── route.ts # GET: list all orders
│   │           │   └── [id]/
│   │           │       ├── route.ts # GET: get order
│   │           │       ├── confirm/
│   │           │       │   └── route.ts # POST: confirm order
│   │           │       ├── decline/
│   │           │       │   └── route.ts # POST: decline order
│   │           │       └── collect/
│   │           │           └── route.ts # POST: mark collected/not collected
│   │           └── prep-list/
│   │               └── route.ts # GET: confirmed orders grouped by time
│   ├── lib/
│   │   ├── db.ts                # SQLite connection + table creation
│   │   └── ai.ts                # Groq API call for order parsing
│   └── components/
│       ├── OrderForm.tsx        # Reusable order form component
│       ├── StatusBadge.tsx      # Status indicator component
│       └── PrepList.tsx         # Prep list display component
├── data/
│   └── preorder.db              # SQLite database file (created on first run)
├── devpost/                     # Devpost learning workspace
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## External Services and Dependencies

### Groq API
- **Endpoint:** `POST https://api.groq.com/openai/v1/chat/completions`
- **Auth:** Bearer token (GROQ_API_KEY environment variable)
- **Model:** `openai/gpt-oss-120b` (free tier, supports structured outputs)
- **Request payload:**
  ```json
  {
    "model": "openai/gpt-oss-120b",
    "messages": [
      {
        "role": "system",
        "content": "You parse food orders into structured data. Extract item, quantity, date, and time from the customer's text."
      },
      {
        "role": "user",
        "content": "2 kota tomorrow at 5:30"
      }
    ],
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "order",
        "strict": true,
        "schema": {
          "type": "object",
          "properties": {
            "item": { "type": "string" },
            "quantity": { "type": "integer" },
            "date": { "type": "string" },
            "time": { "type": "string" }
          },
          "required": ["item", "quantity", "date", "time"]
        }
      }
    }
  }
  ```
- **Response:** JSON object with `item`, `quantity`, `date`, `time` fields
- **Rate limits:** 30 requests/min, 1,000 requests/day (free tier)
- **Cost:** Free
- **Docs:** https://console.groq.com/docs

### better-sqlite3
- **No external service** — local file database
- **npm package:** `better-sqlite3`
- **Docs:** https://github.com/WiseLibs/better-sqlite3

## Important Failure Modes

- **Groq API is slow or fails** → The parse route returns an error. The customer sees a message like "Couldn't parse that — please fill in the form manually." The form is always available as the fallback. The core flow never breaks.
- **No seller matches the order** → The order route checks if any seller offers the item and is available at the requested time. If no match, returns an error: "No seller available for that item or time." The customer can try a different item or time.
- **Seller has no orders yet** → The dashboard shows "No orders yet" empty state. The prep list shows "No confirmed orders yet."
- **Customer enters invalid reference number** → The lookup route returns "Order not found."
- **Database file doesn't exist yet** → The db module creates it and the tables on first run. No manual setup needed.

## What Was Simplified and Why

- **Single seller for hackathon** instead of multi-seller matching — the seller setup form exists in the product, but the build only needs one seller. The matching logic checks against that one seller. This keeps the demo simple and the data model clean.
- **No real-time updates** instead of websockets/polling — the customer refreshes or taps "Check status" to see updates. Real-time would add a websocket server, connection management, and reconnection logic — complexity that doesn't prove the core concept.
- **No authentication** instead of a login system — customers and sellers are identified by name fields only. Auth would add password hashing, session management, and protected routes — none of which prove the pre-order concept.
- **No prices/payments** instead of a payment system — cash on collection. Payments would add a payment gateway, webhook handling, and transaction records — completely outside the core loop.
- **Plain CSS** instead of Tailwind or a design system — no build step, no utility classes, no config. Just CSS you can read and explain.
- **better-sqlite3** instead of an ORM like Prisma — raw SQL queries that are visible and explainable. An ORM would add a schema file, generated types, and a migration system — one more abstraction layer to learn.

## Decisions and Open Issues

- **Next.js with App Router** — chosen because the learner is comfortable with Next.js and it handles both frontend and API routes in one project. Tradeoff: App Router is newer and has some differences from Pages Router, but it's the current recommended approach.
- **better-sqlite3** — chosen for simplicity and transparency. Tradeoff: raw SQL means writing queries by hand, but that's a feature for learning.
- **Groq API with gpt-oss-120b** — chosen for free tier, speed, and structured output support. Tradeoff: free tier has rate limits (30 RPM, 1K/day), but that's plenty for a demo.
- **Plain CSS modules** — chosen for minimal stack. Tradeoff: no utility classes or design tokens, but that keeps things simple.
- **Single seller for hackathon** — the seller setup form exists but the demo uses one seller. The matching logic is real but trivial with one seller.
- **No real-time updates** — refresh/check status is sufficient for the demo. This is a deliberate simplification, not an oversight.

**Open questions:** None blocking the build. The technical approach is clear and sized to the POC.
