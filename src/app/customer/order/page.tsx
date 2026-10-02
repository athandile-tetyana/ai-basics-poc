"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <main className="form-page">
      <h1>Place a Pre-Order</h1>
      <p className="subtitle">Order ahead for a specific pickup time.</p>

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label htmlFor="customer_name">Your Name</label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            required
            placeholder="e.g. Thandi"
          />
        </div>

        <div className="form-group">
          <label htmlFor="item">Food Item</label>
          <input
            type="text"
            id="item"
            name="item"
            value={form.item}
            onChange={handleChange}
            required
            placeholder="e.g. kota"
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            min="1"
            placeholder="e.g. 2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pickup_date">Pickup Date</label>
          <input
            type="date"
            id="pickup_date"
            name="pickup_date"
            value={form.pickup_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pickup_time">Pickup Time</label>
          <input
            type="time"
            id="pickup_time"
            name="pickup_time"
            value={form.pickup_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Pickup Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            placeholder="e.g. Corner of Main & 5th"
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </main>
  );
}
