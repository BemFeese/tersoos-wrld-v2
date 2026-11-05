import { NextResponse } from "next/server";
import { addSubscriber } from "../../../lib/orderStore";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }
    await addSubscriber(email.toLowerCase());
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "splat" }, { status: 500 });
  }
}
