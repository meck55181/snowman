import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Force dynamic rendering - API routes should not be statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const idParam = url.searchParams.get("id");

  // 개별 노드 조회
  if (idParam) {
    const { data, error } = await supabase
      .from("responses")
      .select("id, name, insta, recommender_insta, word, story, memory, city, city_message, ending_song, final_message, created_at, pos_seed")
      .eq("id", idParam)
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: "Failed to load node" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, response: data });
  }

  // 전체 리스트 조회
  let limit = Number.isFinite(Number(limitParam)) ? Number(limitParam) : 500;
  if (!Number.isFinite(limit) || limit <= 0) limit = 500;
  if (limit > 500) limit = 500;

  const { data, error } = await supabase
    .from("responses")
    .select("id, name, insta, recommender_insta, word, story, memory, city, city_message, ending_song, final_message, created_at, pos_seed")
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