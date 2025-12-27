"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ResponseRow = {
  id: string;
  name: string;
  insta: string;
  recommender_insta: string;
  q1_word: string;
  q1_word_desc: string;
  q2_insight: string;
  q2_insight_desc: string;
  q3_content: string;
  q3_content_desc: string;
  ending_song: string | null;
  q4_song_reason: string | null;
  q5_resolution: string;
  q_final_message: string;
  created_at: string;
  pos_seed: number;
  // Legacy fields (for backward compatibility)
  word?: string;
  story?: string;
  memory?: string;
  city?: string;
  city_message?: string;
  final_message?: string;
};

type PositionedNode = ResponseRow & {
  x: number;
  y: number;
};

type Edge = {
  from: PositionedNode;
  to: PositionedNode;
};

const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 600;

// Asterisk 아이콘 경로 (추천인 수에 따라)
const ASTERISK_1_SRC = "/assets/asterisk_1.svg"; // 0명
const ASTERISK_2_SRC = "/assets/asterisk_2.svg"; // 1명 이상
const ASTERISK_3_SRC = "/assets/asterisk_3.svg"; // 2명 이상

function lcg(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function getAsteriskSrc(count: number): string {
  // 2명 이상: asterisk_3, 1명 이상: asterisk_2, 0명: asterisk_1
  if (count >= 2) return ASTERISK_3_SRC;
  if (count >= 1) return ASTERISK_2_SRC;
  return ASTERISK_1_SRC; // 0명
}

export default function BoardPage() {
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ResponseRow | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [toggleQ1, setToggleQ1] = useState(false); // 질문 1 토글 상태 (초기값: 닫힘)
  const [toggleQ2, setToggleQ2] = useState(false); // 질문 2 토글 상태 (초기값: 닫힘)
  const [toggleQ3, setToggleQ3] = useState(false); // 질문 3 토글 상태 (초기값: 닫힘)
  const [toggleQ4, setToggleQ4] = useState(false); // 질문 4 토글 상태 (초기값: 닫힘)
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 모달이 열릴 때 토글 상태 초기화
  useEffect(() => {
    if (selected) {
      setToggleQ1(false);
      setToggleQ2(false);
      setToggleQ3(false);
      setToggleQ4(false);
    }
  }, [selected]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    const timestamp = Date.now();
    try {
      console.log(`[${new Date().toISOString()}] Loading data with timestamp: ${timestamp}`);
      const res = await fetch(`/api/All?limit=500&t=${timestamp}`, { 
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error:", res.status, errorText);
        setError(`Failed to load network (${res.status}). Please refresh.`);
        setLoading(false);
        return;
      }
      const json = await res.json();
      console.log(`[${new Date().toISOString()}] API response:`, {
        ok: json.ok,
        count: json.responses?.length ?? 0,
        responseIds: json.responses?.map((r: any) => r.id) ?? []
      });
      const data = json.responses ?? [];
      console.log(`Loaded ${data.length} responses`);
      if (data.length > 0) {
        console.log("First response:", {
          id: data[0].id,
          name: data[0].name,
          insta: data[0].insta,
          created_at: data[0].created_at
        });
      } else {
        console.warn("⚠️ No responses found in API response");
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
    
    // 페이지 포커스 시 데이터 새로고침 (다른 탭에서 제출 후 돌아왔을 때)
    const handleFocus = () => {
      loadData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
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
    console.log("All responses:", responses);
    
    const nodes: PositionedNode[] = [];
    const byInsta = new Map<string, PositionedNode>();

    for (const row of responses) {
      console.log("Processing row:", { id: row?.id, name: row?.name, insta: row?.insta, hasPosSeed: row?.pos_seed !== null && row?.pos_seed !== undefined });
      if (!row) {
        console.warn("Row is null or undefined, skipping");
        continue;
      }
      if (!row.id) {
        console.warn("Row missing id, skipping:", { row, keys: Object.keys(row || {}) });
        continue;
      }
      // pos_seed가 없으면 랜덤으로 생성 (기존 데이터 호환성)
      const seed = row.pos_seed ?? Math.floor(Math.random() * 2147483647);
      const rand = lcg(seed);
      const x = rand() * VIEW_WIDTH;
      const y = rand() * VIEW_HEIGHT;
      const node: PositionedNode = { ...row, x, y };
      nodes.push(node);
      byInsta.set(row.insta, node);
      console.log("Added node:", { id: node.id, name: node.name, insta: node.insta });
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
    <main className="relative h-screen w-full overflow-hidden bg-[#181818] p-4">
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
          <div className="absolute left-8 top-8 sm:left-[72px] sm:top-[40px] z-20 pointer-events-auto">
            <Link
              href="/"
              className="text-[14px] sm:text-[16px] text-white hover:text-slate-300 transition-colors"
            >
              ← 이전으로
            </Link>
          </div>

          {/* 상단 왼쪽 로고 (축소 버전) */}
          <div className="absolute left-10 top-16 sm:left-[64px] sm:top-[80px] z-10 flex flex-col gap-[8px] items-center w-[80px] sm:w-[130px] pointer-events-none">
            <div className="h-[20px] w-[72px] sm:h-[26px] sm:w-[118px] relative">
              <img 
                alt="로고" 
                className="block w-full h-full" 
                src="/assets/모두의결산_로고.svg" 
              />
            </div>
            <p className="text-[16px] sm:text-[20px] text-white font-semibold" style={{ fontFamily: "'Noto Sans Symbols 2', 'Pretendard', sans-serif" }}>
              ⠑⠥⠊⠍⠺⠨⠻⠇⠒
            </p>
          </div>

          {/* 네트워크 그래프 */}
          <div className="relative h-full w-full overflow-hidden pt-[100px] sm:pt-[120px]">
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
                    const scale = isMobile ? 1 : 0.5; // 데스크톱에서만 작게
                    let imgWidth = 28;
                    let imgHeight = 28;
                    let imgX = -14;
                    let imgY = -24;
                    
                    if (count >= 5) {
                      imgWidth = 24;
                      imgHeight = 25;
                      imgX = -12;
                      imgY = -24;
                    } else if (count >= 3) {
                      imgWidth = 24;
                      imgHeight = 26;
                      imgX = -12;
                      imgY = -26;
                    }
                    
                    // scale 적용
                    imgWidth *= scale;
                    imgHeight *= scale;
                    imgX *= scale;
                    imgY *= scale;
                    
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
                  const scale = isMobile ? 1 : 0.75; // 데스크톱에서만 작게
                  // 이미지 크기 결정
                  let imgWidth = 28;
                  let imgHeight = 28;
                  let imgX = -14;
                  let imgY = -24;
                  
                  if (count >= 5) {
                    imgWidth = 24;
                    imgHeight = 25;
                    imgX = -12;
                    imgY = -24;
                  } else if (count >= 3) {
                    imgWidth = 24;
                    imgHeight = 26;
                    imgX = -12;
                    imgY = -26;
                  }
                  
                  // scale 적용
                  imgWidth *= scale;
                  imgHeight *= scale;
                  imgX *= scale;
                  imgY *= scale;
                  
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
                        y={20}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[14px] fill-white pointer-events-none font-normal"
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
          <div className="absolute bottom-[40px] right-[40px] sm:bottom-[64px] sm:right-[64.6px] z-10 flex gap-[8px] sm:gap-[12px] items-center pointer-events-none">
            <div className="flex flex-col gap-[4px] sm:gap-[8px] items-center w-[18px] sm:w-[22px]">
              <div className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] relative">
                <img 
                  alt="asterisk_1" 
                  className="block w-full h-full" 
                  src={ASTERISK_1_SRC} 
                />
              </div>
              <p className="text-[10px] sm:text-[12px] text-white text-center w-full font-normal" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                0
              </p>
            </div>
            <div className="flex flex-col gap-[4px] sm:gap-[8px] items-start w-[16px] sm:w-[19.395px]">
              <div className="h-[16px] w-[15px] sm:h-[20.576px] sm:w-[18.057px] relative">
                <img 
                  alt="asterisk_2" 
                  className="block w-full h-full" 
                  src={ASTERISK_2_SRC} 
                />
              </div>
              <p className="text-[10px] sm:text-[12px] text-white w-full font-normal" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                ≥1
              </p>
            </div>
            <div className="flex flex-col gap-[4px] sm:gap-[8px] items-start w-[15px] sm:w-[18px]">
              <div className="h-[15px] w-[15px] sm:h-[19px] sm:w-[18px] relative">
                <img 
                  alt="asterisk_3" 
                  className="block w-full h-full" 
                  src={ASTERISK_3_SRC} 
                />
              </div>
              <p className="text-[10px] sm:text-[12px] text-white w-full font-normal" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                ≥2
              </p>
            </div>
          </div>
        </>
      )}

      {/* 선택된 노드 상세 정보 모달 */}
      {selected && (
          <div
            className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4 sm:px-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="relative bg-[#eee] border border-black w-full max-w-[506px] sm:max-w-[506px] overflow-y-auto"
              style={{ maxHeight: '80vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 상단 점자 텍스트 */}
              <p className="absolute left-1/2 -translate-x-1/2 top-[16px] sm:top-[32px] text-[14px] sm:text-[19.879px] text-black font-normal text-nowrap" style={{ fontFamily: "'Noto Sans Symbols 2', 'Pretendard', sans-serif" }}>
                ⠡⠑⠂⠨⠻⠇⠒
              </p>

              {/* X 버튼 */}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-[16px] sm:right-[32.91px] top-[16px] sm:top-[32px] w-[12px] h-[12px]"
              >
                <div className="absolute inset-[-5.89%]">
                  <img alt="닫기" className="block w-full h-full" src="/assets/X.svg" />
                </div>
              </button>

              {/* 로딩 상태 */}
              {selectedLoading && (
                <div className="flex items-center justify-center pt-[60px] sm:pt-[96px] pb-[24px] sm:pb-[32px] px-[40px] sm:px-[64px]">
                  <p className="text-black text-[14px] sm:text-base">Loading...</p>
                </div>
              )}

              {/* 메인 컨텐츠 - Figma 질문 카드 스타일 */}
              {!selectedLoading && (
                <div className="flex flex-col gap-[8px] items-end pt-[60px] sm:pt-[96px] pb-[24px] sm:pb-[32px] px-[40px] sm:px-[64px] w-full">
                  <div className="flex flex-col gap-[16px] sm:gap-[24px] items-start w-full sm:w-[396px]">
                    {/* 질문 1: 올해의 낱말은? */}
                    <div className="flex flex-col gap-[6px] sm:gap-[8px] items-start w-full">
                      <div className="flex gap-[6px] sm:gap-[8px] items-center w-full">
                        <div className="bg-[#95acac] border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 w-[40px] sm:w-[52px] shrink-0">
                          <p className="text-[10px] sm:text-[12px] text-black font-medium">1</p>
                        </div>
                        <div className="bg-[#95acac] border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 flex-1 min-w-0">
                          <p className="text-[10px] sm:text-[12px] text-black font-medium truncate">올해의 낱말은?</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start w-full">
                        <button
                          type="button"
                          onClick={() => setToggleQ1(!toggleQ1)}
                          className="bg-white border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 w-full relative cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <p className="text-[10px] sm:text-[12px] text-black font-medium text-center truncate px-[20px] sm:px-0">
                            {selected.q1_word || selected.word || '낱말 답변'}
                          </p>
                          <div
                            className={`absolute h-[5px] sm:h-[6px] left-[10px] sm:left-[15px] top-1/2 -translate-y-1/2 w-[7px] sm:w-[8px] transition-transform ${
                              toggleQ1 ? '' : '-rotate-90'
                            }`}
                          >
                            <img alt="toggle" className="block w-full h-full" src="/assets/toggle.svg" />
                          </div>
                        </button>
                        {toggleQ1 && (
                          <div className="bg-white border-t-0 border-r border-b border-l border-black flex min-h-[60px] sm:min-h-[72px] items-center justify-center p-3 sm:p-5 w-full">
                            <p className="text-[10px] sm:text-[12px] text-black font-medium whitespace-pre-wrap text-center w-full">
                              {selected.q1_word_desc || selected.story || '낱말 설명 답변'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 질문 2: 올해 나의 삶의 낙은? */}
                    <div className="flex flex-col gap-[6px] sm:gap-[8px] items-start w-full">
                      <div className="flex gap-[6px] sm:gap-[8px] items-center w-full">
                        <div className="bg-[#95acac] border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 w-[40px] sm:w-[52px] shrink-0">
                          <p className="text-[10px] sm:text-[12px] text-black font-medium">2</p>
                        </div>
                        <div className="bg-[#95acac] border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 flex-1 min-w-0">
                          <p className="text-[10px] sm:text-[12px] text-black font-medium truncate">올해 나의 삶의 낙은?</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start w-full">
                        <button
                          type="button"
                          onClick={() => setToggleQ2(!toggleQ2)}
                          className="bg-white border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 w-full relative cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <p className="text-[10px] sm:text-[12px] text-black font-medium text-center truncate px-[20px] sm:px-0">
                            {selected.q2_insight || selected.memory || '삶의 낙 답변'}
                          </p>
                          <div
                            className={`absolute h-[5px] sm:h-[6px] left-[10px] sm:left-[15px] top-1/2 -translate-y-1/2 w-[7px] sm:w-[8px] transition-transform ${
                              toggleQ2 ? '' : '-rotate-90'
                            }`}
                          >
                            <img alt="toggle" className="block w-full h-full" src="/assets/toggle.svg" />
                          </div>
                        </button>
                        {toggleQ2 && (
                          <div className="bg-white border-t-0 border-r border-b border-l border-black flex min-h-[60px] sm:min-h-[72px] items-center justify-center p-3 sm:p-5 w-full">
                            <p className="text-[10px] sm:text-[12px] text-black font-medium whitespace-pre-wrap text-center w-full">
                              {selected.q2_insight_desc || '삶의 낙 설명 답변'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 질문 3: 올해의 콘텐츠는? */}
                    <div className="flex flex-col gap-[6px] sm:gap-[8px] items-start w-full">
                      <div className="flex gap-[6px] sm:gap-[8px] items-center w-full">
                        <div className="bg-[#95acac] border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 w-[40px] sm:w-[52px] shrink-0">
                          <p className="text-[10px] sm:text-[12px] text-black font-medium">3</p>
                        </div>
                        <div className="bg-[#95acac] border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 flex-1 min-w-0">
                          <p className="text-[10px] sm:text-[12px] text-black font-medium truncate">올해의 콘텐츠는?</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start w-full">
                        <button
                          type="button"
                          onClick={() => setToggleQ3(!toggleQ3)}
                          className="bg-white border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 w-full relative cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <p className="text-[10px] sm:text-[12px] text-black font-medium text-center truncate px-[20px] sm:px-0">
                            {selected.q3_content || selected.city || '콘텐츠 답변'}
                          </p>
                          <div
                            className={`absolute h-[5px] sm:h-[6px] left-[10px] sm:left-[15px] top-1/2 -translate-y-1/2 w-[7px] sm:w-[8px] transition-transform ${
                              toggleQ3 ? '' : '-rotate-90'
                            }`}
                          >
                            <img alt="toggle" className="block w-full h-full" src="/assets/toggle.svg" />
                          </div>
                        </button>
                        {toggleQ3 && (
                          <div className="bg-white border-t-0 border-r border-b border-l border-black flex min-h-[60px] sm:min-h-[73px] items-center justify-center p-3 sm:p-5 w-full">
                            <p className="text-[10px] sm:text-[12px] text-black font-medium whitespace-pre-wrap text-center w-full">
                              {selected.q3_content_desc || selected.city_message || '콘텐츠 설명 답변'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 질문 4: 내년 1월 1일에 들을 노래는? */}
                    {selected.ending_song && (
                      <div className="flex flex-col gap-[6px] sm:gap-[8px] items-start w-full">
                        <div className="flex gap-[6px] sm:gap-[8px] items-center w-full">
                          <div className="bg-[#95acac] border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 w-[40px] sm:w-[52px] shrink-0">
                            <p className="text-[10px] sm:text-[12px] text-black font-medium">4</p>
                          </div>
                          <div className="bg-[#95acac] border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 flex-1 min-w-0">
                            <p className="text-[10px] sm:text-[12px] text-black font-medium truncate">내년 1월 1일에 들을 노래는?</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <button
                            type="button"
                            onClick={() => setToggleQ4(!toggleQ4)}
                            className="bg-white border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 w-full relative cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            <p className="text-[10px] sm:text-[12px] text-black font-medium text-center truncate px-[20px] sm:px-0">
                              {selected.ending_song || '노래 답변'}
                            </p>
                            <div
                              className={`absolute h-[5px] sm:h-[6px] left-[10px] sm:left-[15px] top-1/2 -translate-y-1/2 w-[7px] sm:w-[8px] transition-transform ${
                                toggleQ4 ? '' : '-rotate-90'
                              }`}
                            >
                              <img alt="toggle" className="block w-full h-full" src="/assets/toggle.svg" />
                            </div>
                          </button>
                          {toggleQ4 && (
                            <div className="bg-white border-t-0 border-r border-b border-l border-black flex min-h-[60px] sm:min-h-[72px] items-center justify-center p-3 sm:p-5 w-full">
                              <p className="text-[10px] sm:text-[12px] text-black font-medium whitespace-pre-wrap text-center w-full">
                                {selected.q4_song_reason || '노래 선택 이유 답변'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 질문 5: 내년의 다짐은? */}
                    <div className="flex flex-col gap-[6px] sm:gap-[8px] items-start w-full">
                      <div className="flex gap-[6px] sm:gap-[8px] items-center w-full">
                        <div className="bg-[#95acac] border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 w-[40px] sm:w-[52px] shrink-0">
                          <p className="text-[10px] sm:text-[12px] text-black font-medium">5</p>
                        </div>
                        <div className="bg-[#95acac] border border-black flex h-[32px] sm:h-[36px] items-center justify-center p-3 sm:p-5 flex-1 min-w-0">
                          <p className="text-[10px] sm:text-[12px] text-black font-medium truncate">내년의 다짐은?</p>
                        </div>
                      </div>
                      <div className="bg-white border border-black flex min-h-[32px] sm:min-h-[36px] items-center justify-center p-3 sm:p-5 w-full">
                        <p className="text-[10px] sm:text-[12px] text-black font-medium whitespace-pre-wrap text-center w-full">
                          {selected.q5_resolution || '내년의 다짐 답변'}
                        </p>
                      </div>
                    </div>

                    {/* 마지막 메시지 */}
                    <div className="bg-[#f7e982] border border-black flex min-h-[36px] sm:min-h-[41.414px] items-center justify-center p-3 sm:p-5 w-full">
                      <p className="text-[10px] sm:text-[12px] text-black font-medium whitespace-pre-wrap text-center w-full">
                        {selected.q_final_message || selected.final_message || '마지막 메시지 답변'}
                      </p>
                    </div>

                    {/* 인스타 핸들 */}
                    <p className="text-[10px] sm:text-[12px] text-black font-normal text-center w-full mt-[2px] sm:mt-[4px]">
                      @{selected.insta || '인스타 핸들'}
                    </p>
                  </div>

                </div>
              )}
            </div>
          </div>
      )}
    </main>
  );
}
