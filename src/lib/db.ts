import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "preorder.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const fs = require("fs");
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS sellers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        items TEXT NOT NULL,
        available_start TEXT NOT NULL,
        available_end TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        item TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        pickup_date TEXT NOT NULL,
        pickup_time TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        seller_id INTEGER,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (seller_id) REFERENCES sellers (id)
      );
    `);
  }
  return db;
}

export function createOrder(order: {
  customer_name: string;
  item: string;
  quantity: number;
  pickup_date: string;
  pickup_time: string;
  location: string;
  seller_id: number | null;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO orders (customer_name, item, quantity, pickup_date, pickup_time, location, status, seller_id)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
  `);
  const result = stmt.run(
    order.customer_name,
    order.item,
    order.quantity,
    order.pickup_date,
    order.pickup_time,
    order.location,
    order.seller_id
  );
  return getOrderById(result.lastInsertRowid as number);
}

export function getOrderById(id: number) {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM orders WHERE id = ?");
  return stmt.get(id);
}

export function getAllOrders() {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM orders ORDER BY created_at DESC");
  return stmt.all();
}

export function updateOrderStatus(id: number, status: string) {
  const db = getDb();
  const stmt = db.prepare("UPDATE orders SET status = ? WHERE id = ?");
  stmt.run(status, id);
  return getOrderById(id);
}

export function getSellerById(id: number) {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM sellers WHERE id = ?");
  return stmt.get(id);
}

export function getAllSellers() {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM sellers");
  return stmt.all();
}

export function createSeller(seller: {
  name: string;
  items: string;
  available_start: string;
  available_end: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO sellers (name, items, available_start, available_end)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(
    seller.name,
    seller.items,
    seller.available_start,
    seller.available_end
  );
  return getSellerById(result.lastInsertRowid as number);
}
