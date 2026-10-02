"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import NumberBadge from "@/components/NumberBadge";
import StatusBadge from "@/components/StatusBadge";
import styles from "./lookup.module.css";

type Order = {
  id: number;
  customer_name: string;
  item: string;
  quantity: number;
  pickup_date: string;
  pickup_time: string;
  location: string;
  status: string;
};

export default function LookupPage() {
  const [ref, setRef] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${ref.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found");
        setLoading(false);
        return;
      }

      setOrder(data);
      setLoading(false);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader role="customer" />
      <main className={styles.layout}>
        <div className={styles.lookupCol}>
          <h1 className={styles.title}>
            Look up <span className="accent-text">an order</span>
          </h1>
          <p className="hand-note">
            Got your reference number? Pop it in.
          </p>

          <form onSubmit={handleLookup} className={styles.lookupRow}>
            <input
              type="text"
              inputMode="numeric"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="e.g. 3"
              aria-label="Reference number"
              className={`field-input ${styles.refInput}`}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Checking..." : "Find order"}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}
        </div>

        {order && (
          <section className={styles.result}>
            <div className={styles.resultHead}>
              <NumberBadge value={order.id} />
              <StatusBadge status={order.status} />
            </div>
            <dl className={styles.detailList}>
              <div className={styles.detailRow}>
                <dt>Item</dt>
                <span className={styles.leader} />
                <dd>
                  {order.item} × <NumberBadge size="sm" value={order.quantity} hollow />
                </dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Pickup</dt>
                <span className={styles.leader} />
                <dd>
                  {order.pickup_date}{" "}
                  <NumberBadge size="sm" value={order.pickup_time} hollow />
                </dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Location</dt>
                <span className={styles.leader} />
                <dd>{order.location}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Name</dt>
                <span className={styles.leader} />
                <dd>{order.customer_name}</dd>
              </div>
            </dl>
          </section>
        )}
      </main>
    </>
  );
}
