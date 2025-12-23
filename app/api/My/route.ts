import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Force dynamic rendering - API routes should not be statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Payload = {
  name?: string;
  insta?: string;
  recommenderInsta?: string;
  word?: string;
  story?: string;
  memory?: string;
  city?: string;
  cityMessage?: string;
  endingSong?: string;
  finalMessage?: string;
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
  const word = body.word?.trim() ?? "";
  const story = body.story?.trim() ?? "";
  const memory = body.memory?.trim() ?? "";
  const city = body.city?.trim() ?? "";
  const cityMessage = body.cityMessage?.trim() ?? "";
  const endingSong = body.endingSong?.trim() ?? "";
  const finalMessage = body.finalMessage?.trim() ?? "";

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

  if (!word || word.length < 1) {
    return NextResponse.json(
      { ok: false, error: "올해를 대표하는 낱말을 입력해주세요." },
      { status: 400 }
    );
  }

  if (!story || story.length < 1) {
    return NextResponse.json(
      { ok: false, error: "낱말에 담긴 이야기를 입력해주세요." },
      { status: 400 }
    );
  }

  if (!memory || memory.length < 1) {
    return NextResponse.json(
      { ok: false, error: "올해 가장 기억에 남는 장면을 입력해주세요." },
      { status: 400 }
    );
  }

  if (!city || city.length < 1) {
    return NextResponse.json(
      { ok: false, error: "올해 내가 살았던 도시를 입력해주세요." },
      { status: 400 }
    );
  }

  if (!cityMessage || cityMessage.length < 1) {
    return NextResponse.json(
      { ok: false, error: "도시에게 하고 싶은 말을 입력해주세요." },
      { status: 400 }
    );
  }

  if (!finalMessage || finalMessage.length < 1) {
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
        word,
        story,
        memory,
        city,
        city_message: cityMessage,
        ending_song: endingSong || null,
        final_message: finalMessage,
        created_at: new Date().toISOString()
      })
      .eq("insta", insta);
    error = updateError;
  } else {
    // Insert new record
    const { error: insertError } = await supabase.from("responses").insert({
      name,
      insta,
      recommender_insta: recommenderInsta,
      word,
      story,
      memory,
      city,
      city_message: cityMessage,
      ending_song: endingSong || null,
      final_message: finalMessage
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

  ipLastPost.set(ip, now);

  return NextResponse.json({ ok: true });
}

