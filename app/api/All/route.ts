import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering - API routes should not be statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// 서버 사이드에서 서비스 역할 키 사용 (RLS 우회)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables!");
}

const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const idParam = url.searchParams.get("id");

  // 개별 노드 조회
  if (idParam) {
    const { data, error } = await supabase
      .from("responses")
      .select("*")
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

  // RLS 정책 문제를 피하기 위해 모든 데이터 조회 시도
  // 필드명이 없어도 에러가 나지 않도록 * 사용 (모든 필드 선택)
  const { data, error, count } = await supabase
    .from("responses")
    .select("*", { count: 'exact' })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Supabase error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error details:", error.details);
    return NextResponse.json(
      { ok: false, error: `Failed to load board: ${error.message}` },
      { status: 500 }
    );
  }

  console.log(`API: Total count in DB: ${count ?? 'unknown'}`);
  console.log(`API: Returning ${data?.length ?? 0} responses`);
  if (data && data.length > 0) {
    console.log("API: Response IDs:", data.map(r => r.id));
    console.log("API: Response names:", data.map(r => r.name));
    console.log("API: Response instas:", data.map(r => r.insta));
    console.log("API: First response fields:", Object.keys(data[0]));
    console.log("API: First response has pos_seed:", data[0].pos_seed !== null && data[0].pos_seed !== undefined);
    console.log("API: All responses data:", JSON.stringify(data, null, 2));
  } else {
    console.warn("API: No data returned from Supabase!");
    if (error) {
      console.error("API: Supabase error details:", error);
    }
  }

  return NextResponse.json({ ok: true, responses: data ?? [] });
}