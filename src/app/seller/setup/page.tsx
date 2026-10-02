"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import NumberBadge from "@/components/NumberBadge";
import styles from "./setup.module.css";

export default function SellerSetupPage() {
  const [form, setForm] = useState({
    name: "",
    items: "",
    available_start: "",
    available_end: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ id: number; name: string } | null>(
    null
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/seller/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setCreated(data);
      setLoading(false);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="seller-theme">
        <SiteHeader role="seller" />
        <main className={styles.layout}>
          <section className={styles.done}>
            <NumberBadge value={created.id} size="lg" />
            <h1>Stall is set up</h1>
            <p className="hand-note">
              {created.name} — orders will land on your dashboard.
            </p>
            <Link href="/seller/dashboard" className="btn btn-primary">
              Go to dashboard →
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="seller-theme">
      <SiteHeader role="seller" />
      <main className={styles.layout}>
        <div className={styles.formCol}>
          <h1 className={styles.title}>
            Set up <span className="accent-text">your stall</span>
          </h1>
          <p className="hand-note">
            One time only — this is what customers order against.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name" className="field-label">
                Stall name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Sipho's Kota Corner"
                className="field-input"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="items" className="field-label">
                What you sell
              </label>
              <input
                type="text"
                id="items"
                name="items"
                value={form.items}
                onChange={handleChange}
                required
                placeholder="kota, chicken feet, pap"
                className="field-input"
              />
              <span className="hand-note">Separate items with commas.</span>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="available_start" className="field-label">
                  Open from
                  <NumberBadge
                    size="sm"
                    value={form.available_start || "—"}
                    hollow={!form.available_start}
                  />
                </label>
                <input
                  type="time"
                  id="available_start"
                  name="available_start"
                  value={form.available_start}
                  onChange={handleChange}
                  required
                  className="field-input"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="available_end" className="field-label">
                  Open until
                  <NumberBadge
                    size="sm"
                    value={form.available_end || "—"}
                    hollow={!form.available_end}
                  />
                </label>
                <input
                  type="time"
                  id="available_end"
                  name="available_end"
                  value={form.available_end}
                  onChange={handleChange}
                  required
                  className="field-input"
                />
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className={styles.submitRow}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save stall"}
              </button>
            </div>
          </form>
        </div>

        <aside className={styles.aside}>
          <div className={styles.stickyNote}>
            <p className="hand-note" style={{ color: "var(--ink)" }}>
              Customers can only order what you list, between the hours you
              set. Keep it honest — confirm what you can cook.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
