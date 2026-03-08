// src/app/api/health/route.js
import { connectDB } from "@/lib/db/models/connect.js";

export async function GET(req) {
  try {
    await connectDB(); // ensure DB is reachable
    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err) {
    console.error("Health check failed:", err);
    return new Response(JSON.stringify({ status: "error" }), { status: 500 });
  }
}