import { NextResponse } from "next/server";
import { createSeller, getAllSellers } from "@/lib/db";

export async function GET() {
  try {
    return NextResponse.json({ sellers: getAllSellers() });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, items, available_start, available_end } = body;

    if (!name || !items || !available_start || !available_end) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const seller = createSeller({ name, items, available_start, available_end });
    return NextResponse.json(seller, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
