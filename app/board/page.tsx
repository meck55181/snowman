"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ResponseRow = {
  id: string;
  name: string;
  insta: string;
  recommender_insta: string;
  content: string;
  created_at: string;
  pos_seed: number;
};

type PositionedNode = ResponseRow & {
  x: number;
  y: number;
};

type Edge = {
  from: PositionedNode;
  to: PositionedNode;
};

const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 700;
const ASTERISK_NORMAL_SRC = "/asterisk-regular.svg";
const ASTERISK_HEAVY_SRC = "/asterisk-bold.svg";
const HEAVY_THRESHOLD = 2; // 0–1: normal, 2+ : heavy

function lcg(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

export default function BoardPage() {
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<PositionedNode | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/board?limit=500", { cache: "no-store" });
      if (!res.ok) {
        setError("Failed to load network. Please refresh.");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setResponses(json.responses ?? []);
      setLoading(false);
    };

    load();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const { nodes, edges, outgoingCounts } = useMemo(() => {
    const nodes: PositionedNode[] = [];
    const byInsta = new Map<string, PositionedNode>();

    for (const row of responses) {
      const seed = row.pos_seed ?? 1;
      const rand = lcg(seed);
      const x = rand() * VIEW_WIDTH;
      const y = rand() * VIEW_HEIGHT;
      const node: PositionedNode = { ...row, x, y };
      nodes.push(node);
      byInsta.set(row.insta, node);
    }

    const edges: Edge[] = [];
    const outgoingCounts = new Map<string, number>();

    for (const node of nodes) {
      const from = byInsta.get(node.recommender_insta);
      if (from) {
        edges.push({ from, to: node });
        const prev = outgoingCounts.get(from.id) ?? 0;
        outgoingCounts.set(from.id, prev + 1);
      }
    }

    return { nodes, edges, outgoingCounts };
  }, [responses]);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
          <p className="text-slate-300">Loading network...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="relative h-full w-full bg-slate-950">
          <header className="absolute top-0 left-0 z-10 px-6 py-4 space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors pointer-events-auto"
            >
              <span>←</span> Back to home
            </Link>
            <div className="space-y-1 pointer-events-none">
              <p className="text-sm font-semibold text-blue-400">Board</p>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Year-End Recap Network
              </h1>
              <p className="text-sm text-slate-300">
                Each * is a recap. Lines show who recommended whom.
              </p>
            </div>
          </header>
          <svg
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <g stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1">
              {edges.map((edge, idx) => (
                <line
                  key={idx}
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                />
              ))}
            </g>
            <g>
              {nodes.map((node) => (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onClick={() => setSelected(node)}
                >
                  <circle
                    r={9}
                    fill="white"
                    className="opacity-0"
                  />
                  <image
                    href={
                      (outgoingCounts.get(node.id) ?? 0) >= HEAVY_THRESHOLD
                        ? ASTERISK_HEAVY_SRC
                        : ASTERISK_NORMAL_SRC
                    }
                    x={-10}
                    y={-10}
                    width={20}
                    height={20}
                    className="opacity-80 hover:opacity-100"
                  />
                  <text
                    x={0}
                    y={24}
                    textAnchor="middle"
                    className="text-xs fill-slate-300 pointer-events-none"
                  >
                    {node.name}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selected.name}
                </h2>
                <p className="text-xs text-slate-500">
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                ESC
              </button>
            </div>

            <dl className="mb-4 space-y-1 text-sm text-slate-700">
              <div className="flex gap-2">
                <dt className="w-32 font-medium">My Instagram</dt>
                <dd>@{selected.insta}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-32 font-medium">Recommender</dt>
                <dd>@{selected.recommender_insta}</dd>
              </div>
            </dl>

            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-800 ring-1 ring-slate-200">
              <p className="whitespace-pre-line">{selected.content}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

