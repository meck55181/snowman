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
                        y={16}
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
      {selected && (() => {
        // content를 JSON으로 파싱 시도
        let contentData: any = {};
        try {
          contentData = JSON.parse(selected.content);
        } catch {
          // JSON이 아니면 기존 형식으로 처리
          contentData = { content: selected.content };
        }

        return (
          <div
            className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="relative bg-[#eee] border border-black w-full max-w-[506px] overflow-y-auto"
              style={{ maxHeight: '80vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 상단 점자 텍스트 */}
              <p className="absolute left-1/2 -translate-x-1/2 top-[32px] text-[19.879px] text-black font-normal text-nowrap" style={{ fontFamily: "'Noto Sans Symbols 2', 'Pretendard', sans-serif" }}>
                ⠡⠑⠂⠨⠻⠇⠒
              </p>

              {/* X 버튼 */}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-[32.91px] top-[32px] w-[12px] h-[12px]"
              >
                <div className="absolute inset-[-5.89%]">
                  <img alt="닫기" className="block w-full h-full" src="/assets/X.svg" />
                </div>
              </button>

              {/* 메인 컨텐츠 */}
              <div className="flex flex-col gap-[8px] items-end pt-[96px] pb-[32px] px-[55px]">
                <div className="flex flex-col gap-[24px] items-start w-full">
                  {/* Q1: 올해의 나를 대표하는 낱말은? */}
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <div className="flex gap-[8px] items-center w-full">
                      <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-[5.145px] w-[52px]">
                        <p className="text-[12px] text-black font-medium text-nowrap">1</p>
                      </div>
                      <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-[5.145px] w-[336px]">
                        <p className="text-[12px] text-black font-medium text-nowrap">올해의 나를 대표하는 낱말은?</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start w-full">
                      <div className="bg-white border border-black flex gap-[5.145px] h-[36px] items-center justify-center p-[5.145px] w-full relative">
                        <p className="text-[12px] text-black font-medium text-nowrap">{contentData.q1Word || '낱말 답변'}</p>
                        <div className="absolute left-[15px] top-[14px] w-[8px] h-[6px]">
                          <img alt="toggle" className="block w-full h-full" src="/assets/toggle.svg" />
                        </div>
                      </div>
                      <div className="bg-white border-x border-b border-black flex h-[72px] items-center justify-center p-[5.145px] w-full">
                        <p className="text-[12px] text-black font-medium text-nowrap">{contentData.q1Story || '낱말 스토리 답변'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Q2: 올해 가장 기억에 장면 하나는? */}
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <div className="flex gap-[8px] h-[35px] items-center w-full">
                      <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-[5.145px] w-[52px]">
                        <p className="text-[12px] text-black font-medium text-nowrap">2</p>
                      </div>
                      <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-[5.145px] w-[336px]">
                        <p className="text-[12px] text-black font-medium text-nowrap">올해 가장 기억에 장면 하나는?</p>
                      </div>
                    </div>
                    <div className="bg-white border border-black flex h-[36px] items-center justify-center p-[5.145px] w-full">
                      <p className="text-[12px] text-black font-medium text-nowrap">{contentData.q2Memory || '올해 가장 기억에 장면 답변'}</p>
                    </div>
                  </div>

                  {/* Q3: 올해 내가 살았던 도시에게 하고 싶은 말은? */}
                  <div className="flex flex-col gap-[8px] items-start w-full">
                    <div className="flex gap-[8px] items-center w-full">
                      <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-[5.145px] w-[52px]">
                        <p className="text-[12px] text-black font-medium text-nowrap">3</p>
                      </div>
                      <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-[5.145px] w-[336px]">
                        <p className="text-[12px] text-black font-medium text-nowrap">올해 내가 살았던 도시에게 하고 싶은 말은?</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start w-full">
                      <div className="bg-white border border-black flex gap-[5.145px] h-[36px] items-center justify-center p-[5.145px] w-full relative">
                        <p className="text-[12px] text-black font-medium text-nowrap">{contentData.q3City || '도시 답변'}</p>
                        <div className="absolute left-[15px] top-[14px] w-[8px] h-[6px]">
                          <img alt="toggle" className="block w-full h-full" src="/assets/toggle.svg" />
                        </div>
                      </div>
                      <div className="bg-white border-x border-b border-black flex h-[73px] items-center justify-center p-[5.145px] w-full">
                        <p className="text-[12px] text-black font-medium text-nowrap">{contentData.q3Message || '도시에게 하고 싶은 말 답변'}</p>
                      </div>
                    </div>
                  </div>

                  {/* 모두에게 하고 싶은 말 */}
                  <div className="bg-[#f7e982] border border-black flex h-[41.414px] items-center justify-center p-[5.145px] w-full">
                    <p className="text-[12px] text-black font-medium text-nowrap">{contentData.finalMessage || '모두에게 하고 싶은 말 답변'}</p>
                  </div>
                </div>

                {/* 엔딩송 */}
                <div className="flex gap-[7px] items-center text-[12px] text-black text-nowrap">
                  <p className="font-medium" style={{ fontFamily: "'Noto Sans Symbols', 'Pretendard', sans-serif" }}>♫ 엔딩송: </p>
                  <p className="font-medium">good goodbye - 화사</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}
