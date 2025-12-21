"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SubmitState = {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
};

type SubmitFormProps = {
  initialRef?: string;
};

export default function SubmitForm({ initialRef = "" }: SubmitFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [insta, setInsta] = useState("");
  const [recommenderInsta, setRecommenderInsta] = useState(initialRef);
  const [q1Word, setQ1Word] = useState("");
  const [q1Story, setQ1Story] = useState("");
  const [q2Memory, setQ2Memory] = useState("");
  const [q3City, setQ3City] = useState("");
  const [q3Message, setQ3Message] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareLink = useMemo(() => {
    if (!insta || !origin) return "";
    const url = new URL("/submit", origin);
    url.searchParams.set("ref", insta.toLowerCase());
    return url.toString();
  }, [origin, insta]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: "loading" });

    const trimmedName = name.trim();
    const trimmedInsta = insta.trim();
    const trimmedRecommender = recommenderInsta.trim();
    const trimmedQ1Word = q1Word.trim();
    const trimmedQ1Story = q1Story.trim();
    const trimmedQ2Memory = q2Memory.trim();
    const trimmedQ3City = q3City.trim();
    const trimmedQ3Message = q3Message.trim();
    const trimmedFinalMessage = finalMessage.trim();

    if (!trimmedName || !trimmedInsta || !trimmedRecommender || !trimmedQ1Word || 
        !trimmedQ1Story || !trimmedQ2Memory || !trimmedQ3City || !trimmedQ3Message || !trimmedFinalMessage) {
      setState({
        status: "error",
        message: "모든 필드를 입력해주세요."
      });
      return;
    }

    // 모든 답변을 JSON 형태로 content 필드에 저장
    const contentData = {
      q1Word: trimmedQ1Word,
      q1Story: trimmedQ1Story,
      q2Memory: trimmedQ2Memory,
      q3City: trimmedQ3City,
      q3Message: trimmedQ3Message,
      finalMessage: trimmedFinalMessage
    };

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmedName,
        insta: trimmedInsta,
        recommenderInsta: trimmedRecommender,
        content: JSON.stringify(contentData)
      })
    });

    if (!response.ok) {
      const json = await response.json().catch(() => null);
      setState({
        status: "error",
        message:
          (json && typeof json.error === "string" && json.error) ||
          "오류가 발생했습니다. 다시 시도해주세요."
      });
      return;
    }

    router.push("/board");
  };

  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <span>←</span> 홈으로 돌아가기
      </Link>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-blue-600">나의 결산 작성하기</p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          나의 결산 작성하기
        </h1>
        <p className="text-slate-600">
          가벼운 답변도 깊은 생각도 다 좋아요! 부담 없이 작성해주세요
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              이름 *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="이름을 입력해주세요"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              나의 인스타 *
            </label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <span className="mr-1 text-slate-500">@</span>
              <input
                value={insta}
                onChange={(e) => setInsta(e.target.value)}
                className="w-full border-none bg-transparent p-0 text-base outline-none"
                placeholder="your_handle"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              추천인 인스타 *
            </label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <span className="mr-1 text-slate-500">@</span>
              <input
                value={recommenderInsta}
                onChange={(e) => setRecommenderInsta(e.target.value)}
                className="w-full border-none bg-transparent p-0 text-base outline-none"
                placeholder="their_handle"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Q1. 올해를 대표하는 낱말은? *
            </label>
            <input
              value={q1Word}
              onChange={(e) => setQ1Word(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="낱말을 입력해주세요"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Q1-1. 낱말에 담긴 이야기를 적어주세요. *
            </label>
            <textarea
              value={q1Story}
              onChange={(e) => setQ1Story(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="이야기를 작성해주세요"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Q2. 올해 가장 기억에 장면 하나는? *
            </label>
            <textarea
              value={q2Memory}
              onChange={(e) => setQ2Memory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="기억에 남는 장면을 작성해주세요"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Q3. 올해 내가 살았던 도시는? *
            </label>
            <input
              value={q3City}
              onChange={(e) => setQ3City(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="도시 이름을 입력해주세요"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Q3-1. 올해 내가 살았던 도시에게 하고 싶은 말은? *
            </label>
            <textarea
              value={q3Message}
              onChange={(e) => setQ3Message(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="도시에게 전하고 싶은 말을 작성해주세요"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              마지막으로, 이 결산을 보게 될 누군가에게 남기고 싶은 아무말 *
            </label>
            <textarea
              value={finalMessage}
              onChange={(e) => setFinalMessage(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="마지막 메시지를 작성해주세요"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-blue-400"
            disabled={state.status === "loading"}
          >
            {state.status === "loading" ? "제출 중..." : "제출하기"}
          </button>

          {state.status === "error" && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}
        </div>
      </form>
    </>
  );
}

