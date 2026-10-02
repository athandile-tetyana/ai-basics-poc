import { NextResponse } from "next/server";
import { createOrder, getAllSellers } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { customer_name, item, quantity, pickup_date, pickup_time, location } = body;

    if (!customer_name || !item || !quantity || !pickup_date || !pickup_time || !location) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const sellers = getAllSellers() as Array<{
      id: number;
      items: string;
      available_start: string;
      available_end: string;
    }>;

    const itemLower = item.toLowerCase();
    const matchedSeller = sellers.find((seller) => {
      const sellerItems = seller.items.toLowerCase().split(",").map((i) => i.trim());
      const hasItem = sellerItems.includes(itemLower);
      const withinHours = pickup_time >= seller.available_start && pickup_time <= seller.available_end;
      return hasItem && withinHours;
    });

    if (!matchedSeller) {
      return NextResponse.json(
        { error: "No seller available for that item or time" },
        { status: 400 }
      );
    }

    const order = createOrder({
      customer_name,
      item,
      quantity,
      pickup_date,
      pickup_time,
      location,
      seller_id: matchedSeller.id,
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
