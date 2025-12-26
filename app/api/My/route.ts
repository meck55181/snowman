import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering - API routes should not be statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// 서버 사이드에서 서비스 역할 키 사용 (RLS 우회)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 디버깅: 환경 변수 확인
console.log("My API Route - Environment check:");
console.log("  SUPABASE_URL exists:", !!supabaseUrl);
console.log("  SUPABASE_URL value:", supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing');
console.log("  SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("  ANON_KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log("  Using service key:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables!");
  console.error("  supabaseUrl:", supabaseUrl);
  console.error("  supabaseServiceKey:", supabaseServiceKey ? 'exists' : 'missing');
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

type Payload = {
  name?: string;
  insta?: string;
  recommenderInsta?: string;
  q1Word?: string;
  q1WordDesc?: string;
  q2Insight?: string;
  q2InsightDesc?: string;
  q3Content?: string;
  q3ContentDesc?: string;
  endingSong?: string;
  q4SongReason?: string;
  q5Resolution?: string;
  qFinalMessage?: string;
};

const HANDLE_REGEX = /^[a-z0-9._]{1,30}$/;
const MIN_INTERVAL_MS = 10_000;
const ipLastPost = new Map<string, number>();

function normalizeHandle(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const withoutAt = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  return withoutAt.toLowerCase();
}

export async function POST(request: Request) {
  const now = Date.now();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const last = ipLastPost.get(ip) ?? 0;
  if (now - last < MIN_INTERVAL_MS) {
    return NextResponse.json(
      { ok: false, error: "Please wait a moment before posting again." },
      { status: 429 }
    );
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const name = body.name?.trim() ?? "";
  const insta = normalizeHandle(body.insta);
  const recommenderInsta = normalizeHandle(body.recommenderInsta);
  const q1Word = body.q1Word?.trim() ?? "";
  const q1WordDesc = body.q1WordDesc?.trim() ?? "";
  const q2Insight = body.q2Insight?.trim() ?? "";
  const q2InsightDesc = body.q2InsightDesc?.trim() ?? "";
  const q3Content = body.q3Content?.trim() ?? "";
  const q3ContentDesc = body.q3ContentDesc?.trim() ?? "";
  const endingSong = body.endingSong?.trim() ?? "";
  const q4SongReason = body.q4SongReason?.trim() ?? "";
  const q5Resolution = body.q5Resolution?.trim() ?? "";
  const qFinalMessage = body.qFinalMessage?.trim() ?? "";

  if (name.length < 1 || name.length > 30) {
    return NextResponse.json(
      { ok: false, error: "이름은 1자 이상 30자 이하여야 합니다." },
      { status: 400 }
    );
  }

  if (!HANDLE_REGEX.test(insta)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "나의 인스타는 1-30자여야 합니다: a-z, 0-9, 점 또는 언더스코어만 사용 가능합니다."
      },
      { status: 400 }
    );
  }

  if (!HANDLE_REGEX.test(recommenderInsta)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "추천인 인스타는 1-30자여야 합니다: a-z, 0-9, 점 또는 언더스코어만 사용 가능합니다."
      },
      { status: 400 }
    );
  }

  if (!q1Word || q1Word.length < 1) {
    return NextResponse.json(
      { ok: false, error: "올해의 낱말을 입력해주세요." },
      { status: 400 }
    );
  }

  if (!q1WordDesc || q1WordDesc.length < 1) {
    return NextResponse.json(
      { ok: false, error: "올해의 낱말에 대한 설명을 입력해주세요." },
      { status: 400 }
    );
  }

  if (!q2Insight || q2Insight.length < 1) {
    return NextResponse.json(
      { ok: false, error: "올해 나의 삶의 낙을 입력해주세요." },
      { status: 400 }
    );
  }

  if (!q2InsightDesc || q2InsightDesc.length < 1) {
    return NextResponse.json(
      { ok: false, error: "삶의 낙으로 선택한 이유를 입력해주세요." },
      { status: 400 }
    );
  }

  if (!q3Content || q3Content.length < 1) {
    return NextResponse.json(
      { ok: false, error: "올해의 콘텐츠를 입력해주세요." },
      { status: 400 }
    );
  }

  if (!q3ContentDesc || q3ContentDesc.length < 1) {
    return NextResponse.json(
      { ok: false, error: "올해의 콘텐츠에 대한 설명을 입력해주세요." },
      { status: 400 }
    );
  }

  if (!q5Resolution || q5Resolution.length < 1) {
    return NextResponse.json(
      { ok: false, error: "내년의 다짐을 입력해주세요." },
      { status: 400 }
    );
  }

  if (!qFinalMessage || qFinalMessage.length < 1) {
    return NextResponse.json(
      { ok: false, error: "마지막 메시지를 입력해주세요." },
      { status: 400 }
    );
  }

  // Check if record with this insta already exists
  console.log("My API - Checking for existing record with insta:", insta);
  const { data: existing, error: checkError } = await supabase
    .from("responses")
    .select("id")
    .eq("insta", insta)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error("My API - Error checking existing record:", checkError);
  }

  console.log("My API - Existing record found:", !!existing);

  let error;
  if (existing) {
    // Update existing record
    console.log("My API - Updating existing record, id:", existing.id);
    const { error: updateError, data: updateData } = await supabase
      .from("responses")
      .update({
        name,
        recommender_insta: recommenderInsta,
        q1_word: q1Word,
        q1_word_desc: q1WordDesc,
        q2_insight: q2Insight,
        q2_insight_desc: q2InsightDesc,
        q3_content: q3Content,
        q3_content_desc: q3ContentDesc,
        ending_song: endingSong || null,
        q4_song_reason: q4SongReason || null,
        q5_resolution: q5Resolution,
        q_final_message: qFinalMessage,
        created_at: new Date().toISOString()
      })
      .eq("insta", insta)
      .select();
    
    console.log("My API - Update result:", {
      error: updateError ? updateError.message : null,
      data: updateData ? `Updated ${updateData.length} record(s)` : null
    });
    
    error = updateError;
  } else {
    // Insert new record with random pos_seed for node positioning
    const posSeed = Math.floor(Math.random() * 2147483647); // Random integer for positioning
    console.log("My API - Inserting new record with pos_seed:", posSeed);
    const { error: insertError, data: insertData } = await supabase.from("responses").insert({
      name,
      insta,
      recommender_insta: recommenderInsta,
      q1_word: q1Word,
      q1_word_desc: q1WordDesc,
      q2_insight: q2Insight,
      q2_insight_desc: q2InsightDesc,
      q3_content: q3Content,
      q3_content_desc: q3ContentDesc,
      ending_song: endingSong || null,
      q4_song_reason: q4SongReason || null,
      q5_resolution: q5Resolution,
      q_final_message: qFinalMessage,
      pos_seed: posSeed
    }).select();
    
    console.log("My API - Insert result:", {
      error: insertError ? insertError.message : null,
      data: insertData ? `Inserted ${insertData.length} record(s)` : null
    });
    
    error = insertError;
  }

  if (error) {
    console.error("My API - Supabase error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    return NextResponse.json(
      { ok: false, error: `Failed to save response: ${error.message}` },
      { status: 500 }
    );
  }

  ipLastPost.set(ip, now);

  return NextResponse.json({ ok: true });
}
