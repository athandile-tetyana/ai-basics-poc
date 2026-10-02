"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import NumberBadge from "@/components/NumberBadge";
import StatusBadge from "@/components/StatusBadge";
import styles from "./confirmation.module.css";

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

export default function ConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
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

  if (loading) {
    return (
      <>
        <SiteHeader role="customer" />
        <main className={styles.layout}>
          <p className="hand-note">Checking your order...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SiteHeader role="customer" />
        <main className={styles.layout}>
          <p className="error-text">{error}</p>
        </main>
      </>
    );
  }

  if (!order) return null;

  return (
    <>
      <SiteHeader role="customer" />
      <main className={styles.layout}>
        <section className={styles.hero}>
          <NumberBadge size="lg" value={order.id} />
          <p className="hand-note">Your reference number — quote it at the stall.</p>
          <StatusBadge status={order.status} />
        </section>

        <section className={styles.details}>
          <h1>Order placed</h1>
          <p className="hand-note" style={{ marginBottom: "1.25rem" }}>
            Here&apos;s what the seller received:
          </p>

          <dl className={styles.detailList}>
            <div className={styles.detailRow}>
              <dt>Name</dt>
              <span className={styles.leader} />
              <dd>{order.customer_name}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Item</dt>
              <span className={styles.leader} />
              <dd>{order.item}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Quantity</dt>
              <span className={styles.leader} />
              <dd>
                <NumberBadge size="sm" value={order.quantity} hollow />
              </dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Pickup date</dt>
              <span className={styles.leader} />
              <dd>{order.pickup_date}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Pickup time</dt>
              <span className={styles.leader} />
              <dd>
                <NumberBadge size="sm" value={order.pickup_time} hollow />
              </dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Location</dt>
              <span className={styles.leader} />
              <dd>{order.location}</dd>
            </div>
          </dl>

          <button onClick={fetchOrder} className="btn btn-primary">
            Check status
          </button>
        </section>
      </main>
    </>
  );
}
