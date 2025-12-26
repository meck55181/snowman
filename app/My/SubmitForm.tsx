"use client";

import { FormEvent, useState } from "react";
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
  
  // Q1: 올해의 낱말
  const [q1Word, setQ1Word] = useState("");
  const [q1WordDesc, setQ1WordDesc] = useState("");
  
  // Q2: 올해의 깨달음
  const [q2Insight, setQ2Insight] = useState("");
  const [q2InsightDesc, setQ2InsightDesc] = useState("");
  
  // Q3: 올해의 콘텐츠
  const [q3Content, setQ3Content] = useState("");
  const [q3ContentDesc, setQ3ContentDesc] = useState("");
  
  // Q4: 내년 1월 1일에 들을 노래
  const [q4Song, setQ4Song] = useState("");
  const [q4SongReason, setQ4SongReason] = useState("");
  
  // Q5: 내년의 다짐
  const [q5Resolution, setQ5Resolution] = useState("");
  
  // 마지막 메시지
  const [finalMessage, setFinalMessage] = useState("");
  
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: "loading" });

    const trimmedName = name.trim();
    const trimmedInsta = insta.trim();
    const trimmedRecommender = recommenderInsta.trim();
    const trimmedQ1Word = q1Word.trim();
    const trimmedQ1WordDesc = q1WordDesc.trim();
    const trimmedQ2Insight = q2Insight.trim();
    const trimmedQ2InsightDesc = q2InsightDesc.trim();
    const trimmedQ3Content = q3Content.trim();
    const trimmedQ3ContentDesc = q3ContentDesc.trim();
    const trimmedQ4Song = q4Song.trim();
    const trimmedQ4SongReason = q4SongReason.trim();
    const trimmedQ5Resolution = q5Resolution.trim();
    const trimmedFinalMessage = finalMessage.trim();

    if (!trimmedName || !trimmedInsta || !trimmedRecommender || 
        !trimmedQ1Word || !trimmedQ1WordDesc ||
        !trimmedQ2Insight || !trimmedQ2InsightDesc ||
        !trimmedQ3Content || !trimmedQ3ContentDesc ||
        !trimmedQ5Resolution || !trimmedFinalMessage) {
      setState({
        status: "error",
        message: "모든 필수 필드를 입력해주세요."
      });
      return;
    }

    const response = await fetch("/api/My", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmedName,
        insta: trimmedInsta,
        recommenderInsta: trimmedRecommender,
        q1Word: trimmedQ1Word,
        q1WordDesc: trimmedQ1WordDesc,
        q2Insight: trimmedQ2Insight,
        q2InsightDesc: trimmedQ2InsightDesc,
        q3Content: trimmedQ3Content,
        q3ContentDesc: trimmedQ3ContentDesc,
        endingSong: trimmedQ4Song,
        q4SongReason: trimmedQ4SongReason,
        q5Resolution: trimmedQ5Resolution,
        qFinalMessage: trimmedFinalMessage
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

    // All 페이지로 완전히 새로고침하여 최신 데이터 표시
    window.location.href = `/All?t=${Date.now()}`;
  };

  return (
    <div className="bg-[#eee] relative min-h-screen w-full">
      {/* 이전으로 링크 - 반응형 */}
      <Link
        href="/"
        className="absolute left-8 top-8 sm:left-16 sm:top-[40px] text-[14px] sm:text-[16px] text-black font-normal hover:opacity-70 transition-opacity z-10"
      >
        ← 이전으로
      </Link>

      {/* 왼쪽 상단 로고 - 반응형 (축소 버전) */}
      <div className="absolute left-8 top-16 sm:left-16 sm:top-[72px] flex flex-col gap-[8px] items-center w-[80px] sm:w-[110px] z-10 pointer-events-none">
        <div className="h-[20px] w-[72px] sm:h-[26px] sm:w-[94px] relative">
          <img 
            alt="나의결산 로고" 
            className="block w-full h-full" 
            src="/assets/나의결산_로고.svg" 
          />
        </div>
        <p className="text-[16px] sm:text-[20px] text-black font-normal" style={{ fontFamily: "'Pretendard', 'Noto Sans Symbols 2', sans-serif" }}>
          ⠉⠣⠺⠈⠳⠇⠒
        </p>
      </div>

      {/* 메인 폼 카드 - 반응형 */}
      <div className="absolute left-1/2 top-[132px] sm:top-[160px] -translate-x-1/2 bg-white border border-black flex flex-col gap-6 sm:gap-[36px] p-4 sm:p-[24px] w-[calc(100%-48px)] sm:w-[596px] max-w-[596px] min-h-[800px] sm:min-h-[1271px]">
        <div className="flex flex-col gap-6 sm:gap-[36px] items-start w-full">
          {/* 제목 섹션 - 반응형 */}
          <div className="flex flex-col gap-3 sm:gap-[12px] items-start w-full sm:w-[391px]">
            <div className="flex gap-2 sm:gap-[12px] items-end">
              <div className="h-[22px] w-[78px] sm:h-[30px] sm:w-[106px] relative">
                <img 
                  alt="나의결산 로고" 
                  className="block w-full h-full" 
                  src="/assets/나의결산_로고.svg" 
                />
              </div>
              <p className="text-[20px] sm:text-[27.947px] text-black font-semibold">작성하기</p>
            </div>
            <p className="text-[14px] sm:text-[16px] text-black font-light w-full">
              가벼운 답변도, 깊은 생각도 다 좋아요! 부담 없이 작성해주세요
            </p>
          </div>

          {/* 입력 필드들 - 반응형 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-[20px] items-center justify-center w-full">
            {/* 이름 */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">이름 *</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-[#999] flex h-[38px] sm:h-[41px] items-center p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black"
                placeholder="이름"
                required
              />
            </div>

            {/* 나의 인스타 */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">나의 인스타 *</p>
              <div className="border border-[#999] flex h-[38px] sm:h-[41px] items-center p-2 sm:p-[10px] w-full">
                <span className="text-[14px] sm:text-[16px] font-medium text-[#999]">@</span>
                <input
                  type="text"
                  value={insta}
                  onChange={(e) => setInsta(e.target.value)}
                  className="flex-1 border-none outline-none text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] bg-transparent"
                  placeholder=""
                  required
                />
              </div>
            </div>

            {/* 추천인 인스타 */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">추천인 인스타 *</p>
              <div className="border border-[#999] flex h-[38px] sm:h-[41px] items-center p-2 sm:p-[10px] w-full">
                <span className="text-[14px] sm:text-[16px] font-medium text-[#999]">@</span>
                <input
                  type="text"
                  value={recommenderInsta}
                  onChange={(e) => setRecommenderInsta(e.target.value)}
                  className="flex-1 border-none outline-none text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] bg-transparent"
                  placeholder=""
                  required
                />
              </div>
            </div>

            {/* Q1. 올해의 낱말은? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q1. 올해의 낱말은? *</p>
              <input
                type="text"
                value={q1Word}
                onChange={(e) => setQ1Word(e.target.value)}
                className="border border-[#999] flex h-[38px] sm:h-[41px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black"
                placeholder="낱말을 입력해주세요"
                required
              />
            </div>

            {/* Q1-1. 올해의 낱말에 대한 설명을 적어주세요. */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q1-1. 올해의 낱말에 대한 설명을 적어주세요. *</p>
              <textarea
                value={q1WordDesc}
                onChange={(e) => setQ1WordDesc(e.target.value)}
                className="border border-[#999] flex h-[100px] sm:h-[121px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black resize-none"
                placeholder="설명을 입력해주세요"
                required
              />
            </div>

            {/* Q2. 올해의 깨달음은? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q2. 올해의 깨달음은? *</p>
              <input
                type="text"
                value={q2Insight}
                onChange={(e) => setQ2Insight(e.target.value)}
                className="border border-[#999] flex h-[38px] sm:h-[41px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black"
                placeholder="깨달음을 입력해주세요"
                required
              />
            </div>

            {/* Q2-1. 올해의 깨달음에 대한 설명을 적어주세요. */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q2-1. 올해의 깨달음으로 선정한 이유를 적어주세요. *</p>
              <textarea
                value={q2InsightDesc}
                onChange={(e) => setQ2InsightDesc(e.target.value)}
                className="border border-[#999] flex h-[100px] sm:h-[121px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black resize-none"
                placeholder="설명을 입력해주세요"
                required
              />
            </div>

            {/* Q3. 올해의 콘텐츠는? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q3. 올해의 콘텐츠는? *</p>
              <input
                type="text"
                value={q3Content}
                onChange={(e) => setQ3Content(e.target.value)}
                className="border border-[#999] flex h-[38px] sm:h-[41px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black"
                placeholder="콘텐츠를 입력해주세요"
                required
              />
            </div>

            {/* Q3-1. 올해의 콘텐츠에 대한 설명을 적어주세요. */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q3-1. 올해의 콘텐츠에 대한 설명을 적어주세요. *</p>
              <textarea
                value={q3ContentDesc}
                onChange={(e) => setQ3ContentDesc(e.target.value)}
                className="border border-[#999] flex h-[100px] sm:h-[121px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black resize-none"
                placeholder="설명을 입력해주세요"
                required
              />
            </div>

            {/* Q4. 내년 1월 1일에 들을 노래는? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q4. 내년 1월 1일에 들을 노래는? (노래 제목 - 가수)</p>
              <input
                type="text"
                value={q4Song}
                onChange={(e) => setQ4Song(e.target.value)}
                className="border border-[#999] flex h-[38px] sm:h-[41px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black"
                placeholder="노래를 입력해주세요"
              />
            </div>

            {/* Q4-1. 왜 이 노래를 선택하셨나요? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q4-1. 왜 이 노래를 선택하셨나요?</p>
              <textarea
                value={q4SongReason}
                onChange={(e) => setQ4SongReason(e.target.value)}
                className="border border-[#999] flex h-[100px] sm:h-[121px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black resize-none"
                placeholder="이유를 입력해주세요"
              />
            </div>

            {/* Q5. 내년의 다짐은? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q5. 내년의 다짐은? *</p>
              <textarea
                value={q5Resolution}
                onChange={(e) => setQ5Resolution(e.target.value)}
                className="border border-[#999] flex h-[100px] sm:h-[129px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black resize-none"
                placeholder="다짐을 입력해주세요"
                required
              />
            </div>

            {/* 마지막 메시지 */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q. 마지막으로 이 결산을 볼 사람들에게 남기고 싶은 아무 말! *</p>
              <textarea
                value={finalMessage}
                onChange={(e) => setFinalMessage(e.target.value)}
                className="border border-[#999] flex h-[100px] sm:h-[129px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black resize-none"
                placeholder="마지막 메시지를 작성해주세요"
                required
              />
            </div>

            {/* 에러 메시지 */}
            {state.status === "error" && (
              <p className="text-sm text-red-600 w-full">{state.message}</p>
            )}

            {/* 제출하기 버튼 - 반응형 */}
            <button
              type="submit"
              className="bg-[#95acac] border border-black flex items-center justify-center px-8 sm:px-[72px] py-2 sm:py-[10px] text-[14px] sm:text-[16px] text-black font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              disabled={state.status === "loading"}
            >
              {state.status === "loading" ? "제출 중..." : "제출하기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
