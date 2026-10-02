"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import NumberBadge from "@/components/NumberBadge";
import styles from "./order.module.css";

export default function OrderForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    customer_name: "",
    item: "",
    quantity: "",
    pickup_date: "",
    pickup_time: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          item: form.item,
          quantity: parseInt(form.quantity),
          pickup_date: form.pickup_date,
          pickup_time: form.pickup_time,
          location: form.location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push(`/customer/confirmation/${data.id}`);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader role="customer" />
      <main className={styles.layout}>
        <div className={styles.formCol}>
          <h1 className={styles.title}>
            Place a <span className="accent-text">pre-order</span>
          </h1>
          <p className="hand-note">
            Fill it in — we&apos;ll hold it for your pickup time.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="customer_name" className="field-label">
                Your name
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                required
                placeholder="e.g. Thandi"
                className="field-input"
              />
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="item" className="field-label">
                  Food item
                </label>
                <input
                  type="text"
                  id="item"
                  name="item"
                  value={form.item}
                  onChange={handleChange}
                  required
                  placeholder="e.g. kota"
                  className="field-input"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="quantity" className="field-label">
                  Quantity
                  <NumberBadge
                    size="sm"
                    value={form.quantity || "1"}
                    hollow={!form.quantity}
                  />
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 2"
                  className="field-input"
                />
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="pickup_date" className="field-label">
                  Pickup date
                </label>
                <input
                  type="date"
                  id="pickup_date"
                  name="pickup_date"
                  value={form.pickup_date}
                  onChange={handleChange}
                  required
                  className="field-input"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="pickup_time" className="field-label">
                  Pickup time
                  <NumberBadge
                    size="sm"
                    value={form.pickup_time || "—"}
                    hollow={!form.pickup_time}
                  />
                </label>
                <input
                  type="time"
                  id="pickup_time"
                  name="pickup_time"
                  value={form.pickup_time}
                  onChange={handleChange}
                  required
                  className="field-input"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="location" className="field-label">
                Pickup location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Corner of Main & 5th"
                className="field-input"
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className={styles.submitRow}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Placing order..." : "Place order"}
              </button>
            </div>
          </form>
        </div>

        <aside className={styles.aside}>
          <div className={styles.stickyNote}>
            <p className="hand-note" style={{ color: "var(--ink)" }}>
              Cash on collection — pay when you pick up.
            </p>
          </div>
          <div className={styles.stickyNoteAlt}>
            <p className="hand-note" style={{ color: "var(--ink)" }}>
              Sellers only confirm times they can actually cook for. If it says
              no, try another time.
            </p>
          </div>
        </aside>
      </main>
    </>
  );
}
