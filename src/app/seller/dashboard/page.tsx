"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import NumberBadge from "@/components/NumberBadge";
import StatusBadge from "@/components/StatusBadge";
import styles from "./dashboard.module.css";

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

type Seller = {
  id: number;
  name: string;
  items: string;
  available_start: string;
  available_end: string;
};

type DayGroup = {
  date: string;
  label: string;
  note: string | null;
  orders: Order[];
};

function dayLabel(iso: string): { label: string; note: string | null } {
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { label: iso, note: null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((parsed.getTime() - today.getTime()) / 86400000);

  const date = parsed.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
  });

  if (diff === 0) return { label: "Today", note: date };
  if (diff === 1) return { label: "Tomorrow", note: date };

  return {
    label: parsed.toLocaleDateString("en-ZA", {
      weekday: "long",
      day: "numeric",
      month: "short",
    }),
    note: null,
  };
}

function groupByPickupDay(orders: Order[]): DayGroup[] {
  const byDate = new Map<string, Order[]>();

  for (const order of orders) {
    const list = byDate.get(order.pickup_date) ?? [];
    list.push(order);
    byDate.set(order.pickup_date, list);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, list]) => {
      const { label, note } = dayLabel(date);
      const sorted = [...list].sort(
        (a, b) =>
          a.pickup_time.localeCompare(b.pickup_time) || a.id - b.id
      );
      return { date, label, note, orders: sorted };
    });
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function init() {
    try {
      const res = await fetch("/api/seller/setup");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      if (Array.isArray(data.sellers) && data.sellers.length === 0) {
        router.replace("/seller/setup");
        return;
      }

      if (Array.isArray(data.sellers) && data.sellers.length > 0) {
        setSeller(data.sellers[0]);
      }

      await fetchOrders();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  async function fetchOrders() {
    try {
      const res = await fetch("/api/seller/orders");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }
      setOrders(data);
      setLoading(false);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  async function updateStatus(id: number, action: "confirm" | "decline") {
    setBusyId(id);
    setActionError("");
    try {
      const res = await fetch(`/api/seller/orders/${id}/${action}`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setActionError(data.error || "That didn't save — try again.");
        return;
      }

      await fetchOrders();
    } catch {
      setActionError("That didn't save — check your connection and try again.");
    } finally {
      setBusyId(null);
    }
  }

  const pending = orders.filter((o) => o.status === "pending");
  const groups = groupByPickupDay(orders);

  return (
    <div className="seller-theme">
      <SiteHeader role="seller" />
      <main className={styles.layout}>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>
              Incoming <span className="accent-text">orders</span>
            </h1>
            {seller && (
              <p className="hand-note">
                {seller.name} · open {seller.available_start}–
                {seller.available_end}
              </p>
            )}
          </div>
          <div className={styles.headMeta}>
            <NumberBadge value={orders.length} />
            <span className="hand-note">
              {pending.length} waiting on you
            </span>
          </div>
        </div>

        {loading && <p className="hand-note">Loading orders...</p>}
        {error && <p className="error-text">{error}</p>}
        {actionError && <p className="error-text">{actionError}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className={styles.empty}>
            <p className="hand-note">
              No orders yet — place one from the customer side and watch it
              land right here.
            </p>
            <Link href="/customer/order" className="btn btn-secondary btn-sm">
              Try it →
            </Link>
          </div>
        )}

        {groups.map((group) => (
          <section key={group.date} className={styles.dayGroup}>
            <header className={styles.dayHead}>
              <h2 className={styles.dayTitle}>{group.label}</h2>
              {group.note && <span className={styles.dayDate}>{group.note}</span>}
              <span className={styles.dayLeader} />
              <NumberBadge size="sm" value={group.orders.length} hollow />
            </header>

            <ul className={styles.orderList}>
              {group.orders.map((order) => (
                <li key={order.id} className={styles.orderCard}>
                  <div className={styles.orderId}>
                    <NumberBadge value={order.id} />
                  </div>

                  <div className={styles.orderInfo}>
                    <div className={styles.orderItem}>
                      <span className={styles.itemName}>{order.item}</span>
                      <NumberBadge
                        size="sm"
                        value={`×${order.quantity}`}
                        hollow
                      />
                    </div>
                    <div className={styles.orderMeta}>
                      <span>{order.customer_name}</span>
                      <span className={styles.dot}>·</span>
                      <NumberBadge size="sm" value={order.pickup_time} hollow />
                      <span className={styles.location}>{order.location}</span>
                    </div>
                  </div>

                  <div className={styles.orderActions}>
                    <StatusBadge status={order.status} />
                    {order.status === "pending" &&
                      (busyId === order.id ? (
                        <span className="hand-note">Saving…</span>
                      ) : (
                        <div className={styles.buttons}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => updateStatus(order.id, "confirm")}
                            disabled={busyId !== null}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => updateStatus(order.id, "decline")}
                            disabled={busyId !== null}
                          >
                            Decline
                          </button>
                        </div>
                      ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
