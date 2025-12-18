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
  const [content, setContent] = useState("");
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
    const trimmedContent = content.trim();

    if (!trimmedName || !trimmedInsta || !trimmedRecommender || !trimmedContent) {
      setState({
        status: "error",
        message: "All fields are required."
      });
      return;
    }

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmedName,
        insta: trimmedInsta,
        recommenderInsta: trimmedRecommender,
        content: trimmedContent
      })
    });

    if (!response.ok) {
      const json = await response.json().catch(() => null);
      setState({
        status: "error",
        message:
          (json && typeof json.error === "string" && json.error) ||
          "Something went wrong. Please try again."
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
        <span>←</span> Back to home
      </Link>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-blue-600">Submit your recap</p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Year-End Recap
        </h1>
        <p className="text-slate-600">
          Share your year-end recap and credit the person who brought you into
          the network.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              My Instagram *
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
              Recommender Instagram *
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
              Year-end recap content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Write your recap... (max 3000 characters)"
              rows={6}
              maxLength={3000}
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
            {state.status === "loading" ? "Submitting..." : "Submit"}
          </button>

          {state.status === "error" && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}
        </div>
      </form>
    </>
  );
}

