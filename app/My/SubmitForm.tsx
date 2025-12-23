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
  const [q1Word, setQ1Word] = useState("");
  const [q1Story, setQ1Story] = useState("");
  const [q2Memory, setQ2Memory] = useState("");
  const [q3City, setQ3City] = useState("");
  const [q3Message, setQ3Message] = useState("");
  const [q4EndingSong, setQ4EndingSong] = useState("");
  const [q5FinalMessage, setQ5FinalMessage] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

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
    const trimmedQ4EndingSong = q4EndingSong.trim();
    const trimmedQ5FinalMessage = q5FinalMessage.trim();

    if (!trimmedName || !trimmedInsta || !trimmedRecommender || !trimmedQ1Word || 
        !trimmedQ1Story || !trimmedQ2Memory || !trimmedQ3City || !trimmedQ3Message || !trimmedQ5FinalMessage) {
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
        word: trimmedQ1Word,
        story: trimmedQ1Story,
        memory: trimmedQ2Memory,
        city: trimmedQ3City,
        cityMessage: trimmedQ3Message,
        endingSong: trimmedQ4EndingSong,
        finalMessage: trimmedQ5FinalMessage
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

    router.push("/All");
  };

  return (
    <div className="bg-[#eee] relative min-h-screen w-full">
      {/* 왼쪽 상단 로고 - 반응형 */}
      <div className="absolute left-4 top-16 sm:left-[72px] sm:top-[92px] flex flex-col gap-[13.973px] items-center w-[100px] sm:w-[142px] z-10">
        <div className="h-[26px] w-[94px] sm:h-[36.977px] sm:w-[132.525px] relative">
          <img 
            alt="나의결산 로고" 
            className="block w-full h-full" 
            src="/assets/나의결산_로고.svg" 
          />
        </div>
        <p className="text-[20px] sm:text-[27.947px] text-black font-normal" style={{ fontFamily: "'Pretendard', 'Noto Sans Symbols 2', sans-serif" }}>
          ⠉⠣⠺⠈⠳⠇⠒
        </p>
      </div>

      {/* 이전으로 링크 - 반응형 */}
      <Link
        href="/"
        className="absolute left-4 top-8 sm:left-[72px] sm:top-[40px] text-[14px] sm:text-[16px] text-black font-normal hover:opacity-70 transition-opacity z-10"
      >
        ← 이전으로
      </Link>

      {/* 메인 폼 카드 - 반응형 */}
      <div className="absolute left-1/2 top-16 sm:top-[64px] -translate-x-1/2 bg-white border border-black flex flex-col gap-6 sm:gap-[36px] p-4 sm:p-[40px] w-[calc(100%-32px)] sm:w-[596px] max-w-[596px] min-h-[800px] sm:min-h-[1271px]">
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

            {/* Q1. 올해를 대표하는 낱말은? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q1. 올해를 대표하는 낱말은? *</p>
              <input
                type="text"
                value={q1Word}
                onChange={(e) => setQ1Word(e.target.value)}
                className="border border-[#999] flex h-[38px] sm:h-[41px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black"
                placeholder="낱말을 입력해주세요"
                required
              />
            </div>

            {/* Q1-1. 낱말에 담긴 이야기를 적어주세요. */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q1-1. 낱말에 담긴 이야기를 적어주세요. *</p>
              <textarea
                value={q1Story}
                onChange={(e) => setQ1Story(e.target.value)}
                className="border border-[#999] flex h-[100px] sm:h-[121px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black resize-none"
                placeholder="이야기를 입력해주세요"
                required
              />
            </div>

            {/* Q2. 올해 가장 기억에 장면 하나는? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q2. 올해 가장 기억에 장면 하나는? *</p>
              <textarea
                value={q2Memory}
                onChange={(e) => setQ2Memory(e.target.value)}
                className="border border-[#999] flex h-[100px] sm:h-[129px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black resize-none"
                placeholder="기억에 남는 장면을 작성해주세요"
                required
              />
            </div>

            {/* Q3. 올해 내가 살았던 도시는? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q3. 올해 내가 살았던 도시는? *</p>
              <input
                type="text"
                value={q3City}
                onChange={(e) => setQ3City(e.target.value)}
                className="border border-[#999] flex h-[34px] sm:h-[36px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black"
                placeholder="도시를 입력해주세요"
                required
              />
            </div>

            {/* Q3-1. 올해 내가 살았던 도시에게 하고 싶은 말은? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q3-1. 올해 내가 살았던 도시에게 하고 싶은 말은? *</p>
              <textarea
                value={q3Message}
                onChange={(e) => setQ3Message(e.target.value)}
                className="border border-[#999] flex h-[100px] sm:h-[129px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black resize-none"
                placeholder="도시에게 전하고 싶은 말을 작성해주세요"
                required
              />
            </div>

            {/* Q4. 2025년, 나의 엔딩곡은? */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q4. 2025년, 나의 엔딩곡은?</p>
              <input
                type="text"
                value={q4EndingSong}
                onChange={(e) => setQ4EndingSong(e.target.value)}
                className="border border-[#999] flex h-[34px] sm:h-[36px] items-start p-2 sm:p-[10px] w-full text-[14px] sm:text-[16px] font-medium text-black placeholder:text-[#999] focus:outline-none focus:border-black"
                placeholder="엔딩곡을 입력해주세요"
              />
            </div>

            {/* Q5. 이 결산을 보게 될 누군가에게 남기고 싶은 아무말 */}
            <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
              <p className="text-[14px] sm:text-[16px] text-black font-medium w-full">Q5. 이 결산을 보게 될 누군가에게 남기고 싶은 아무말 *</p>
              <textarea
                value={q5FinalMessage}
                onChange={(e) => setQ5FinalMessage(e.target.value)}
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
