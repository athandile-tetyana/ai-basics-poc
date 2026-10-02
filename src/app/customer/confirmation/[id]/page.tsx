"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

  if (loading) return <main className="confirmation-page"><p>Loading...</p></main>;
  if (error) return <main className="confirmation-page"><p className="error">{error}</p></main>;
  if (!order) return null;

  return (
    <main className="confirmation-page">
      <h1>Order Confirmed</h1>
      <p className="subtitle">Your pre-order has been placed.</p>

      <div className="order-details">
        <div className="detail-row">
          <span className="label">Reference Number</span>
          <span className="value">#{order.id}</span>
        </div>
        <div className="detail-row">
          <span className="label">Name</span>
          <span className="value">{order.customer_name}</span>
        </div>
        <div className="detail-row">
          <span className="label">Item</span>
          <span className="value">{order.item}</span>
        </div>
        <div className="detail-row">
          <span className="label">Quantity</span>
          <span className="value">{order.quantity}</span>
        </div>
        <div className="detail-row">
          <span className="label">Pickup Date</span>
          <span className="value">{order.pickup_date}</span>
        </div>
        <div className="detail-row">
          <span className="label">Pickup Time</span>
          <span className="value">{order.pickup_time}</span>
        </div>
        <div className="detail-row">
          <span className="label">Location</span>
          <span className="value">{order.location}</span>
        </div>
        <div className="detail-row">
          <span className="label">Status</span>
          <span className="value">
            <span className={`status-badge status-${order.status}`}>
              {order.status}
            </span>
          </span>
        </div>
      </div>

      <button onClick={fetchOrder} className="btn btn-secondary">
        Check Status
      </button>
    </main>
  );
}
