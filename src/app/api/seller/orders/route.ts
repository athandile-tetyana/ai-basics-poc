import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/db";

export async function GET() {
  try {
    return NextResponse.json(getAllOrders());
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
