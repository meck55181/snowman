import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Force dynamic rendering - API routes should not be statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
      { ok: false, error: "올해의 깨달음을 입력해주세요." },
      { status: 400 }
    );
  }

  if (!q2InsightDesc || q2InsightDesc.length < 1) {
    return NextResponse.json(
      { ok: false, error: "올해의 깨달음에 대한 설명을 입력해주세요." },
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
  const { data: existing } = await supabase
    .from("responses")
    .select("id")
    .eq("insta", insta)
    .single();

  let error;
  if (existing) {
    // Update existing record
    const { error: updateError } = await supabase
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
      .eq("insta", insta);
    error = updateError;
  } else {
    // Insert new record with random pos_seed for node positioning
    const posSeed = Math.floor(Math.random() * 2147483647); // Random integer for positioning
    const { error: insertError } = await supabase.from("responses").insert({
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
    });
    error = insertError;
  }

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json(
      { ok: false, error: `Failed to save response: ${error.message}` },
      { status: 500 }
    );
  }

  // 저장 성공 후 실제로 저장되었는지 확인
  const { data: savedData, error: verifyError } = await supabase
    .from("responses")
    .select("*")
    .eq("insta", insta)
    .single();

  if (verifyError) {
    console.error("Failed to verify saved data:", verifyError);
  } else {
    console.log("Successfully saved/updated data:", {
      id: savedData?.id,
      name: savedData?.name,
      insta: savedData?.insta,
      created_at: savedData?.created_at
    });
  }

  ipLastPost.set(ip, now);

  return NextResponse.json({ 
    ok: true,
    data: savedData ? { id: savedData.id, insta: savedData.insta } : null
  });
}
