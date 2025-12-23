"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ResponseRow = {
  id: string;
  name: string;
  insta: string;
  recommender_insta: string;
  word: string;
  story: string;
  memory: string;
  city: string;
  city_message: string;
  ending_song: string | null;
  final_message: string;
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
  // 1명 이상: asterisk_1, 3명 이상: asterisk_2, 5명 이상: asterisk_3
  if (count >= 5) return ASTERISK_3_SRC;
  if (count >= 3) return ASTERISK_2_SRC;
  return ASTERISK_1_SRC; // 0명 또는 1-2명
}

export default function BoardPage() {
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ResponseRow | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [toggleQ1, setToggleQ1] = useState(true); // 질문 1 토글 상태
  const [toggleQ3, setToggleQ3] = useState(true); // 질문 3 토글 상태

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/All?limit=500&t=" + Date.now(), { cache: "no-store" });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error:", res.status, errorText);
        setError(`Failed to load network (${res.status}). Please refresh.`);
        setLoading(false);
        return;
      }
      const json = await res.json();
      console.log("API response:", json);
      const data = json.responses ?? [];
      console.log("Loaded responses:", data.length);
      if (data.length > 0) {
        console.log("First response sample:", data[0]);
        console.log("Response fields:", Object.keys(data[0]));
      } else {
        console.warn("No responses found in API response");
      }
      setResponses(data);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load network. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 페이지가 포커스되거나 보일 때 데이터 다시 로드 (새 데이터 반영)
  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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

  // 개별 노드 데이터 로드
  const loadNodeData = async (nodeId: string) => {
    setSelectedLoading(true);
    // 모달 열릴 때 토글 상태 초기화
    setToggleQ1(true);
    setToggleQ3(true);
    try {
      const res = await fetch(`/api/All?id=${nodeId}`, { cache: "no-store" });
      if (!res.ok) {
        setError("Failed to load node data. Please try again.");
        setSelectedLoading(false);
        return;
      }
      const json = await res.json();
      if (json.ok && json.response) {
        setSelected(json.response);
      } else {
        setError("Node data not found.");
      }
    } catch (err) {
      setError("Failed to load node data. Please try again.");
    } finally {
      setSelectedLoading(false);
    }
  };

  const { nodes, edges, outgoingCounts } = useMemo(() => {
    console.log("Computing nodes from responses:", responses.length);
    console.log("Response IDs:", responses.map(r => r?.id));
    console.log("Response names:", responses.map(r => r?.name));
    
    const nodes: PositionedNode[] = [];
    const byInsta = new Map<string, PositionedNode>();

    for (const row of responses) {
      if (!row || !row.id) {
        console.warn("Invalid row skipped:", row);
        continue;
      }
      const seed = row.pos_seed ?? 1;
      const rand = lcg(seed);
      const x = rand() * VIEW_WIDTH;
      const y = rand() * VIEW_HEIGHT;
      const node: PositionedNode = { ...row, x, y };
      nodes.push(node);
      byInsta.set(row.insta, node);
    }
    
    console.log("Created nodes:", nodes.length);
    console.log("Node IDs:", nodes.map(n => n.id));
    console.log("Node names:", nodes.map(n => n.name));

    // 엣지 생성: 추천인 → 작성자 체인 연결
    const edges: Edge[] = [];
    const outgoingCounts = new Map<string, number>();

    for (const node of nodes) {
      // 추천인 노드 찾기 (recommender_insta로 검색)
      const from = byInsta.get(node.recommender_insta);
      
      // 추천인 노드가 존재하는 경우에만 엣지 생성
      // MVP: 추천인 핸들이 데이터에 있지만 submission 노드가 없는 경우 무시
      if (from) {
        edges.push({ from, to: node });
        // 추천인 노드의 추천 횟수 증가 (asterisk 아이콘 선택에 사용)
        const prev = outgoingCounts.get(from.id) ?? 0;
        outgoingCounts.set(from.id, prev + 1);
      }
    }

    console.log("Computed nodes:", nodes.length, "edges:", edges.length);
    if (nodes.length > 0) {
      console.log("First node sample:", nodes[0]);
      console.log("Node position:", { x: nodes[0].x, y: nodes[0].y });
      console.log("Node name:", nodes[0].name);
    }
    return { nodes, edges, outgoingCounts };
  }, [responses]);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#181818] p-16">
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
          <div className="absolute left-[72px] top-[40px] z-20 pointer-events-auto">
            <Link
              href="/"
              className="text-[16px] text-white hover:text-slate-300 transition-colors"
            >
              ← 이전으로
            </Link>
          </div>

          {/* 상단 왼쪽 로고 (축소 버전) */}
          <div className="absolute left-[64px] top-[80px] z-10 flex flex-col gap-[8px] items-center w-[130px] pointer-events-none">
            <div className="h-[26px] w-[118px] relative">
              <img 
                alt="로고" 
                className="block w-full h-full" 
                src="/assets/모두의결산_로고.svg" 
              />
            </div>
            <p className="text-[20px] text-white font-semibold" style={{ fontFamily: "'Noto Sans Symbols 2', 'Pretendard', sans-serif" }}>
              ⠑⠥⠊⠍⠺⠨⠻⠇⠒
            </p>
          </div>

          {/* 네트워크 그래프 */}
          <div className="relative h-full w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              style={{ width: '100%', height: '100%' }}
            >
              {/* 연결선 */}
              <g stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1">
                {edges.map((edge, idx) => {
                  // 각 노드의 asterisk 중심 좌표 계산
                  const getAsteriskCenter = (node: PositionedNode) => {
                    const count = outgoingCounts.get(node.id) ?? 0;
                    let imgWidth = 22;
                    let imgHeight = 22;
                    let imgX = -11;
                    let imgY = -19;
                    
                    if (count >= 5) {
                      imgWidth = 18;
                      imgHeight = 19;
                      imgX = -9;
                      imgY = -19;
                    } else if (count >= 3) {
                      imgWidth = 18.057;
                      imgHeight = 20.576;
                      imgX = -9.0285;
                      imgY = -20.576;
                    }
                    
                    // asterisk 이미지의 중심 좌표
                    const centerX = node.x + imgX + imgWidth / 2;
                    const centerY = node.y + imgY + imgHeight / 2;
                    return { x: centerX, y: centerY };
                  };
                  
                  const fromCenter = getAsteriskCenter(edge.from);
                  const toCenter = getAsteriskCenter(edge.to);
                  
                  return (
                    <line
                      key={idx}
                      x1={fromCenter.x}
                      y1={fromCenter.y}
                      x2={toCenter.x}
                      y2={toCenter.y}
                    />
                  );
                })}
              </g>

              {/* 노드들 */}
              <g>
                {nodes.length === 0 && !loading && (
                  <text
                    x={VIEW_WIDTH / 2}
                    y={VIEW_HEIGHT / 2}
                    textAnchor="middle"
                    className="text-[16px] fill-white"
                  >
                    데이터가 없습니다 (노드 수: {nodes.length}, 응답 수: {responses.length})
                  </text>
                )}
                {nodes.map((node, idx) => {
                  const count = outgoingCounts.get(node.id) ?? 0;
                  const asteriskSrc = getAsteriskSrc(count);
                  // 이미지 크기 결정
                  let imgWidth = 22;
                  let imgHeight = 22;
                  let imgX = -11;
                  let imgY = -19;
                  
                  if (count >= 5) {
                    imgWidth = 18;
                    imgHeight = 19;
                    imgX = -9;
                    imgY = -19;
                  } else if (count >= 3) {
                    imgWidth = 18.057;
                    imgHeight = 20.576;
                    imgX = -9.0285;
                    imgY = -20.576;
                  }
                  
                  // 첫 번째 노드만 로그 출력
                  if (idx === 0) {
                    console.log("Rendering first node:", {
                      id: node.id,
                      name: node.name,
                      x: node.x,
                      y: node.y,
                      asteriskSrc,
                      count
                    });
                  }
                  
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer"
                      onClick={() => loadNodeData(node.id)}
                    >
                      {/* Asterisk 노드 */}
                      <image
                        href={asteriskSrc}
                        x={imgX}
                        y={imgY}
                        width={imgWidth}
                        height={imgHeight}
                        className="opacity-100"
                        style={{ imageRendering: "auto" }}
                        onError={(e) => {
                          console.error("Image failed to load:", asteriskSrc, "for node:", node.name, "at", { x: node.x, y: node.y });
                        }}
                        onLoad={() => {
                          if (idx === 0) {
                            console.log("Image loaded successfully:", asteriskSrc);
                          }
                        }}
                      />
                      {/* 이름 텍스트 */}
                      <text
                        x={0}
                        y={16}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[12px] fill-white pointer-events-none font-normal"
                        style={{ fill: "white", fontFamily: "'Pretendard', sans-serif" }}
                      >
                        {node.name || "이름 없음"}
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
              <p className="text-[12px] text-white text-center w-full font-normal" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                ≥1
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
              <p className="text-[12px] text-white w-full font-normal" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                ≥3
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
              <p className="text-[12px] text-white w-full font-normal" style={{ fontFamily: "'Pretendard', sans-serif" }}>
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

              {/* 로딩 상태 */}
              {selectedLoading && (
                <div className="flex items-center justify-center pt-[96px] pb-[32px] px-[55px]">
                  <p className="text-black">Loading...</p>
                </div>
              )}

              {/* 메인 컨텐츠 - Figma 질문 카드 스타일 */}
              {!selectedLoading && (
                <div className="flex flex-col gap-[8px] items-end pt-[96px] pb-[32px] px-[55px] w-full">
                  <div className="flex flex-col gap-[24px] items-start w-[396px]">
                    {/* 질문 1: 올해의 나를 대표하는 낱말은? */}
                    <div className="flex flex-col gap-[8px] items-start w-full">
                      <div className="flex gap-[8px] items-center w-full">
                        <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-5 w-[52px] shrink-0">
                          <p className="text-[12px] text-black font-medium">1</p>
                        </div>
                        <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-5 w-[336px] shrink-0">
                          <p className="text-[12px] text-black font-medium">올해의 나를 대표하는 낱말은?</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start w-full">
                        <button
                          type="button"
                          onClick={() => setToggleQ1(!toggleQ1)}
                          className="bg-white border border-black flex h-[36px] items-center justify-center p-5 w-full relative cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <p className="text-[12px] text-black font-medium text-center">
                            {selected.word || '낱말 답변'}
                          </p>
                          <div
                            className={`absolute h-[6px] left-[15px] top-[14px] w-[8px] transition-transform ${
                              toggleQ1 ? '-rotate-90' : ''
                            }`}
                          >
                            <img alt="toggle" className="block w-full h-full" src="/assets/toggle.svg" />
                          </div>
                        </button>
                        {toggleQ1 && (
                          <div className="bg-white border-t-0 border-r border-b border-l border-black flex min-h-[72px] items-center justify-center p-5 w-full">
                            <p className="text-[12px] text-black font-medium whitespace-pre-wrap text-center w-full">
                              {selected.story || '낱말 스토리 답변'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 질문 2: 올해 가장 기억에 장면 하나는? */}
                    <div className="flex flex-col gap-[8px] items-start w-full">
                      <div className="flex gap-[8px] items-center w-full">
                        <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-5 w-[52px] shrink-0">
                          <p className="text-[12px] text-black font-medium">2</p>
                        </div>
                        <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-5 w-[336px] shrink-0">
                          <p className="text-[12px] text-black font-medium">올해 가장 기억에 장면 하나는?</p>
                        </div>
                      </div>
                      <div className="bg-white border border-black flex min-h-[36px] items-center justify-center p-5 w-full">
                        <p className="text-[12px] text-black font-medium whitespace-pre-wrap text-center w-full">
                          {selected.memory || '올해 가장 기억에 장면 답변'}
                        </p>
                      </div>
                    </div>

                    {/* 질문 3: 올해 내가 살았던 도시에게 하고 싶은 말은? */}
                    <div className="flex flex-col gap-[8px] items-start w-full">
                      <div className="flex gap-[8px] items-center w-full">
                        <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-5 w-[52px] shrink-0">
                          <p className="text-[12px] text-black font-medium">3</p>
                        </div>
                        <div className="bg-[#95acac] border border-black flex h-[36px] items-center justify-center p-5 w-[336px] shrink-0">
                          <p className="text-[12px] text-black font-medium">
                            올해 내가 살았던 도시에게 하고 싶은 말은?
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start w-full">
                        <button
                          type="button"
                          onClick={() => setToggleQ3(!toggleQ3)}
                          className="bg-white border border-black flex h-[36px] items-center justify-center p-5 w-full relative cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <p className="text-[12px] text-black font-medium text-center">
                            {selected.city || '도시 답변'}
                          </p>
                          <div
                            className={`absolute h-[6px] left-[15px] top-[14px] w-[8px] transition-transform ${
                              toggleQ3 ? '-rotate-90' : ''
                            }`}
                          >
                            <img alt="toggle" className="block w-full h-full" src="/assets/toggle.svg" />
                          </div>
                        </button>
                        {toggleQ3 && (
                          <div className="bg-white border-t-0 border-r border-b border-l border-black flex min-h-[73px] items-center justify-center p-5 w-full">
                            <p className="text-[12px] text-black font-medium whitespace-pre-wrap text-center w-full">
                              {selected.city_message || '도시에게 하고 싶은 말 답변'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 모두에게 하고 싶은 말 */}
                    <div className="bg-[#f7e982] border border-black flex min-h-[41.414px] items-center justify-center p-5 w-full">
                      <p className="text-[12px] text-black font-medium whitespace-pre-wrap text-center w-full">
                        {selected.final_message || '모두에게 하고 싶은 말 답변'}
                      </p>
                    </div>
                  </div>

                  {/* 엔딩송 */}
                  <div className="flex gap-[7px] items-center text-[12px] text-black w-[396px]">
                    <p
                      className="font-medium"
                      style={{ fontFamily: "'Pretendard', 'Noto Sans Symbols', sans-serif" }}
                    >
                      ♫ 엔딩송:
                    </p>
                    <p className="font-medium">{selected.ending_song || '엔딩송 답변'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
      )}
    </main>
  );
}
