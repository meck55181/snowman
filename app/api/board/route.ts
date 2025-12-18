import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");

  let limit = Number.isFinite(Number(limitParam)) ? Number(limitParam) : 500;
  if (!Number.isFinite(limit) || limit <= 0) limit = 500;
  if (limit > 500) limit = 500;

  const { data, error } = await supabase
    .from("responses")
    .select("id, name, insta, recommender_insta, content, created_at, pos_seed")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Failed to load board" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, responses: data ?? [] });
}