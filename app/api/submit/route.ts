import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Force dynamic rendering - API routes should not be statically generated
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Payload = {
  name?: string;
  insta?: string;
  recommenderInsta?: string;
  content?: string;
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
  const content = body.content?.trim() ?? "";

  if (name.length < 1 || name.length > 30) {
    return NextResponse.json(
      { ok: false, error: "Name must be between 1 and 30 characters." },
      { status: 400 }
    );
  }

  if (!HANDLE_REGEX.test(insta)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "My Instagram handle must be 1–30 characters: a–z, 0–9, dot or underscore."
      },
      { status: 400 }
    );
  }

  if (!HANDLE_REGEX.test(recommenderInsta)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Recommender Instagram handle must be 1–30 characters: a–z, 0–9, dot or underscore."
      },
      { status: 400 }
    );
  }

  if (content.length < 1 || content.length > 3000) {
    return NextResponse.json(
      { ok: false, error: "Content must be between 1 and 3000 characters." },
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
        content,
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
      content
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

