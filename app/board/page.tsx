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

// Asterisk 아이콘 경로 (추천인 수에 따라)
const ASTERISK_1_SRC = "/assets/asterisk_1.svg"; // 0명
const ASTERISK_2_SRC = "/assets/asterisk_2.svg"; // 2명 이상
const ASTERISK_3_SRC = "/assets/asterisk_3.svg"; // 5명 이상

function lcg(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function getAsteriskSrc(count: number): string {
  // 0명: asterisk_1, 2명 이상: asterisk_2, 5명 이상: asterisk_3
  if (count >= 5) return ASTERISK_3_SRC;
  if (count >= 2) return ASTERISK_2_SRC;
  return ASTERISK_1_SRC; // 0명 또는 1명
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
    <main className="relative h-screen w-full overflow-hidden bg-[#181818]">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#181818]">
          <p className="text-white">Loading network...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#181818]">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* 상단 왼쪽 돌아가기 링크 */}
          <div className="absolute left-4 top-4 sm:left-8 sm:top-8 z-20 pointer-events-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white hover:text-slate-300 transition-colors"
            >
              <span>←</span> 돌아가기
            </Link>
          </div>

          {/* 상단 왼쪽 로고 */}
          <div className="absolute left-[72px] top-[64px] z-10 flex flex-col gap-[13.123px] items-center w-[166px] pointer-events-none">
            <div className="h-[34.775px] w-[151.565px] relative">
              <img 
                alt="로고" 
                className="block w-full h-full" 
                src="/assets/모두의결산_로고.svg" 
              />
            </div>
            <p className="text-[26.245px] text-white font-semibold" style={{ fontFamily: "'Noto Sans Symbols 2', 'Pretendard', sans-serif" }}>
              ⠑⠥⠊⠍⠺⠨⠻⠇⠒
            </p>
          </div>

          {/* 네트워크 그래프 */}
          <div className="relative h-full w-full">
            <svg
              viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* 연결선 */}
              <g stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1">
                {edges.map((edge, idx) => {
                  const dx = edge.to.x - edge.from.x;
                  const dy = edge.to.y - edge.from.y;
                  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                  const length = Math.sqrt(dx * dx + dy * dy);
                  
                  return (
                    <g key={idx} transform={`translate(${edge.from.x}, ${edge.from.y})`}>
                      <line
                        x1={0}
                        y1={0}
                        x2={length}
                        y2={0}
                        transform={`rotate(${angle})`}
                      />
                    </g>
                  );
                })}
              </g>

              {/* 노드들 */}
              <g>
                {nodes.map((node) => {
                  const count = outgoingCounts.get(node.id) ?? 0;
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer"
                      onClick={() => setSelected(node)}
                    >
                      {/* Asterisk 아이콘 */}
                      <image
                        href={getAsteriskSrc(count)}
                        x={-11}
                        y={-19}
                        width={22}
                        height={count >= 5 ? 19 : 22}
                        className="opacity-100"
                      />
                      {/* 이름 */}
                      <text
                        x={0}
                        y={8}
                        textAnchor="middle"
                        className="text-[12px] fill-white pointer-events-none font-normal"
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* 하단 오른쪽 범례 */}
          <div className="absolute bottom-[64px] right-[64.6px] z-10 flex gap-[12px] items-center pointer-events-none">
            <div className="flex flex-col gap-[8px] items-center w-[22px]">
              <div className="h-[22px] w-[22px] relative">
                <img 
                  alt="asterisk_1" 
                  className="block w-full h-full" 
                  src={ASTERISK_1_SRC} 
                />
              </div>
              <p className="text-[12px] text-white text-center w-full font-normal">
                ≥0
              </p>
            </div>
            <div className="flex flex-col gap-[8px] items-start w-[19.395px]">
              <div className="h-[20.576px] w-[18.057px] relative">
                <img 
                  alt="asterisk_2" 
                  className="block w-full h-full" 
                  src={ASTERISK_2_SRC} 
                />
              </div>
              <p className="text-[12px] text-white w-full font-normal">
                ≥2
              </p>
            </div>
            <div className="flex flex-col gap-[8px] items-start w-[18px]">
              <div className="h-[19px] w-[18px] relative">
                <img 
                  alt="asterisk_3" 
                  className="block w-full h-full" 
                  src={ASTERISK_3_SRC} 
                />
              </div>
              <p className="text-[12px] text-white w-full font-normal">
                ≥5
              </p>
            </div>
          </div>
        </>
      )}

      {/* 선택된 노드 상세 정보 모달 */}
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
