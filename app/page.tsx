"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

// 상수 정의
const CARD_WIDTH = 612;
const CARD_HEIGHT = 792;
const FONT_FAMILY = "'Pretendard', 'Noto Sans Symbols 2', sans-serif";

// 대각선 화살표 컴포넌트
interface DiagonalArrowProps {
  src: string;
  rotate: string;
  skew?: string;
  width: string;
  height?: string;
  insetStyle?: React.CSSProperties;
}

const DiagonalArrow = ({ src, rotate, skew, width, height, insetStyle }: DiagonalArrowProps) => {
  const transformStyle = useMemo(() => {
    if (skew) {
      return { transform: `skewX(${skew})` };
    }
    return undefined;
  }, [skew]);

  return (
    <div className={rotate} style={transformStyle}>
      <div className="relative" style={{ width, height: height || "100%" }}>
        <div className="absolute" style={insetStyle || { top: "-4.57px", bottom: "-4.57px", left: "-0.51%", right: "0" }}>
          <img alt="" className="block max-w-none w-full h-full" src={src} />
        </div>
      </div>
    </div>
  );
};

// 세로 화살표 컴포넌트
interface VerticalArrowProps {
  top: string;
  left: string;
  height: string;
  width?: string;
  insetStyle?: React.CSSProperties;
}

const VerticalArrow = ({ top, left, height, width = "0", insetStyle }: VerticalArrowProps) => (
  <div className="absolute flex items-center justify-center pointer-events-none" style={{ top, left, width, height }}>
    <div className="rotate-[90deg]">
      <div className="relative" style={{ width: width === "0" ? "26px" : width, height: "100%" }}>
        <div className="absolute" style={insetStyle || { top: "-4.57px", bottom: "-4.57px", left: "-2.39%", right: "0" }}>
          <img alt="" className="block max-w-none w-full h-full" src="/assets/Arrow 9.svg" />
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [scale, setScale] = useState(0.85);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 화면 크기에 따른 scale 계산
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width < 640) {
        setScale(Math.min(width / CARD_WIDTH, height / CARD_HEIGHT, 0.7));
      } else if (width < 768) {
        setScale(Math.min(width / CARD_WIDTH, height / CARD_HEIGHT, 0.7));
      } else {
        setScale(Math.min(width / CARD_WIDTH, height / CARD_HEIGHT, 0.85));
      }
    };
    
    updateScale();
    window.addEventListener("resize", updateScale, { passive: true });
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // 메모이제이션된 계산 값들
  const posterPageOffset = useMemo(() => scrollY * 1.2, [scrollY]);
  const posterPageOpacity = useMemo(() => Math.max(0, 1 - scrollY / 400), [scrollY]);
  const scrollDownOpacity = useMemo(() => Math.max(0, 1 - scrollY / 200), [scrollY]);

  // 메모이제이션된 스타일 객체들
  const linkerPageStyle = useMemo(() => ({
    transform: `translate(-50%, -50%) rotate(356deg) scale(${scale})`,
    zIndex: 10,
  }), [scale]);

  const posterPageStyle = useMemo(() => ({
    transform: `translate(calc(-50% + 8.12px), calc(-50% - ${posterPageOffset}px + 14.38px)) rotate(4deg) scale(${scale})`,
    opacity: posterPageOpacity,
    zIndex: 20,
  }), [posterPageOffset, posterPageOpacity, scale]);

  const scrollDownStyle = useMemo(() => ({
    opacity: scrollDownOpacity,
  }), [scrollDownOpacity]);

  return (
    <div className="min-h-[200vh] bg-black relative overflow-x-hidden p-16">
      {/* 상단 왼쪽 로고 (축소 버전) */}
      <div className="fixed left-[40px] top-[40px] flex flex-col gap-[4px] items-center w-[110px] z-30 pointer-events-none">
        <div className="h-[28px] w-[100px] relative">
          <img 
            alt="연말정산 로고" 
            className="block w-full h-full" 
            src="/assets/main_연말정산_로고.svg" 
          />
        </div>
        <p className="text-[20px] text-white font-normal" style={{ fontFamily: FONT_FAMILY }}>
          ⠡⠑⠂⠈⠳⠇⠒
        </p>
      </div>

      {/* 중앙 카드들 */}
      <div className="relative min-h-screen flex items-center justify-center py-[100vh]">
        {/* LinkerPage (뒤쪽, 회색) - 중앙에 고정 */}
        <div 
          className="fixed top-1/2 left-1/2 w-[612px] h-[792px] pointer-events-auto"
          style={linkerPageStyle}
        >
          <div className="bg-[#eee] border-2 border-black h-full w-full overflow-hidden relative flex items-center justify-center">
            <div className="relative w-[479.094px] flex flex-col items-center gap-7">
              {/* LinkerPage 전체 내용 */}
              <div className="h-[87px] w-[161.616px] relative">
                <img 
                  alt="연말정산 로고" 
                  className="block w-full h-full object-contain" 
                  src="/assets/d680040e57e3146b77c6e459b741b224b1bd5fcb.svg" 
                />
              </div>

              <div className="relative w-[477px] h-[401px]">
                {/* 첫 번째 질문 박스 */}
                <div className="absolute top-0 left-0 bg-white border border-black flex items-center justify-center p-[6.212px] h-[94px] w-[477px]">
                  <div className="text-base font-medium text-black text-center leading-normal">
                    <p className="mb-0">이제 곧 2025년이 끝난다는 사실.</p>
                    <p>알고 계셨나요?</p>
                  </div>
                </div>

                {/* 첫 번째 YES 박스 */}
                <div className="absolute top-[132px] left-0 bg-white border border-black flex items-center justify-center p-[6.212px] h-[52px] w-[225px]">
                  <p className="text-base font-medium text-black">YES</p>
                </div>

                {/* 첫 번째 NO 박스 */}
                <div className="absolute top-[132px] left-[251px] bg-white border border-black flex items-center justify-center p-[6.212px] h-[52px] w-[225px]">
                  <p className="text-base font-medium text-black">NO</p>
                </div>

                {/* 두 번째 질문 박스 (YES 아래) */}
                <div className="absolute top-[222px] left-0 bg-white border border-black flex items-center justify-center p-[6.212px] h-[89px] w-[225px]">
                  <div className="text-base font-medium text-black text-center leading-normal">
                    <p className="mb-0">연말정산을</p>
                    <p>작성했나요?</p>
                  </div>
                </div>

                {/* 두 번째 YES 박스 */}
                <div className="absolute top-[348px] left-0 bg-white border border-black flex items-center justify-center p-[6.212px] h-[53px] w-[225px]">
                  <p className="text-base font-medium text-black">YES</p>
                </div>

                {/* 두 번째 NO 박스 */}
                <div className="absolute top-[348px] left-[251px] bg-white border border-black flex items-center justify-center p-[6.212px] h-[53px] w-[225px]">
                  <p className="text-base font-medium text-black">NO</p>
                </div>

                {/* 화살표들 */}
                {/* 1. 첫 번째 질문에서 YES로 가는 대각선 화살표 */}
                <div className="absolute top-[94.24px] left-[120.85px] w-[117.651px] h-[28.479px] flex items-center justify-center pointer-events-none">
                  <DiagonalArrow 
                    src="/assets/Arrow 1.svg"
                    rotate="rotate-[0deg]"
                    skew="0deg"
                    width="121.049px"
                  />
                </div>

                {/* 2. 첫 번째 질문에서 NO로 가는 대각선 화살표 */}
                <div className="absolute top-[94.24px] left-[120.85px] w-[117.651px] h-[28.479px] flex items-center justify-center pointer-events-none">
                  <DiagonalArrow 
                    src="/assets/Arrow 2.svg"
                    rotate="rotate-[90deg]"
                    skew="0deg"
                    width="121.049px"
                  />
                </div>

                {/* 3. 첫 번째 YES에서 두 번째 질문으로 가는 세로 화살표 */}
                <VerticalArrow top="184px" left="113px" height="27px" width="0" insetStyle={{ top: "-4.57px", bottom: "-4.57px", left: "-2.3%", right: "0" }} />

                {/* 4. 두 번째 질문에서 NO로 가는 대각선 화살표 */}
                <div className="absolute top-[311.29px] left-[112.85px] w-[249.481px] h-[27.569px] flex items-center justify-center pointer-events-none">
                  <DiagonalArrow 
                    src="/assets/Arrow 5.svg"
                    rotate="rotate-[6.306deg]"
                    width="251px"
                    insetStyle={{ top: "-4.57px", bottom: "-4.57px", left: "-0.25%", right: "0" }}
                  />
                </div>

                {/* 5. 두 번째 질문에서 YES로 가는 세로 화살표 */}
                <VerticalArrow top="311px" left="113px" height="26px" />

                {/* 6. 두 번째 YES에서 아래로 가는 세로 화살표 */}
                <VerticalArrow top="401px" left="113px" height="26px" />

                {/* 7. 두 번째 NO에서 아래로 가는 세로 화살표 */}
                <VerticalArrow top="401px" left="364px" height="26px" />
              </div>

              <div className="flex gap-[29px] items-center w-full">
                <Link
                  href={"/All" as any}
                  className="bg-[#95acac] border border-black flex flex-col gap-[11.258px] h-[88px] items-center justify-center px-0 text-base text-black w-[225px] hover:opacity-90 transition-opacity cursor-pointer no-underline hover:no-underline"
                >
                  <p className="font-semibold text-center">모두의 결산</p>
                  <p className="text-sm font-semibold" style={{ fontFamily: FONT_FAMILY }}>⠑⠥⠊⠍⠺⠀⠈⠳⠇⠒</p>
                </Link>
                <Link
                  href={"/My" as any}
                  className="bg-[#95acac] border border-black flex flex-col gap-[11.258px] h-[88px] items-center justify-center px-0 text-base text-black w-[225px] hover:opacity-90 transition-opacity cursor-pointer no-underline hover:no-underline"
                >
                  <p className="font-semibold text-center">나의 결산</p>
                  <p className="text-sm font-semibold" style={{ fontFamily: FONT_FAMILY }}>⠉⠣⠺⠈⠳⠇⠒</p>
                </Link>
              </div>

              <p className="text-[24px] text-black text-center font-normal" style={{ fontFamily: FONT_FAMILY }}>
                ⠡⠑⠂⠈⠳⠇⠒
              </p>
            </div>
          </div>
        </div>

        {/* PosterPage (앞쪽, 연한 파란색) - 스크롤하면 위로 올라가며 사라짐 */}
        <div 
          className="fixed top-1/2 left-1/2 w-[612px] h-[792px]"
          style={posterPageStyle}
        >
          <div className="bg-[#95acac] border-0 border-black h-full w-full overflow-hidden relative flex items-center justify-center">
            <div className="relative w-[430px] flex flex-col items-center gap-[80px]">
              <div className="flex flex-col items-center gap-[84px] w-full">
                <div className="flex items-end gap-[9.209px]">
                  <img 
                    alt="tree" 
                    className="block h-auto object-contain" 
                    src="/assets/tree.svg" 
                  />
                  <div className="relative" style={{ width: '142px', height: '185px' }}>
                    <img 
                      alt="연말정산 로고" 
                      className="block w-full h-full object-contain" 
                      src="/assets/연말정산_로고세로.svg"
                      onError={(e) => {
                        console.error('이미지 로드 실패:', e);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[16px] items-start w-full">
                  {/* 첫 번째 섹션 */}
                  <div className="flex gap-[16px] items-start w-full">
                    <div className="flex flex-col gap-[4px] h-[80px] items-center w-[128px] relative">
                      <div className="h-[49.088px] w-[121.549px] relative">
                        <img alt="집 아이콘" className="block w-full h-full" src="/assets/house.svg" />
                      </div>
                      <p className="text-[16.905px] font-semibold text-black text-center">(집이면 어때)</p>
                    </div>
                    <div className="bg-black flex h-[52px] items-center justify-center p-[7.044px] w-[280px]">
                      <p className="text-[24px] font-medium text-white whitespace-nowrap">어디서든 괜찮아요</p>
                    </div>
                  </div>

                  {/* 두 번째 섹션 */}
                  <div className="flex gap-[16px] items-start w-full">
                    <div className="flex flex-col gap-[4px] h-[80px] items-center w-[128px] relative">
                      <div className="relative w-[128px] h-[58px]">
                        <div className="absolute top-[0.02px] left-0 w-[58px] h-[58px]">
                          <img alt="man 1" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png" />
                        </div>
                        <div className="absolute top-[0.02px] left-[34.61px] w-[58px] h-[58px]">
                          <img alt="man 1" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png" />
                        </div>
                        <div className="absolute top-[0.02px] left-[69.61px] w-[58px] h-[58px]">
                          <img alt="man 1" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png" />
                        </div>
                      </div>
                      <p className="text-[16.905px] font-semibold text-black text-center">(모두가 궁금해)</p>
                    </div>
                    <div className="bg-black flex h-[52px] items-center justify-center p-[7.044px] w-[280px]">
                      <p className="text-[24px] font-medium text-white whitespace-nowrap">누구라도 괜찮아요</p>
                    </div>
                  </div>

                  {/* 세 번째 섹션 */}
                  <div className="flex gap-[16px] items-start w-full">
                    <div className="relative w-[128px] h-[80px]">
                      <div className="absolute top-0 left-0 w-[76.671px] h-[76.671px] flex items-center justify-center">
                        <div className="rotate-[5.754deg]">
                          <div className="relative w-[70.005px] h-[70.005px]">
                            <img alt="man (2) 1" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/8518a8fe65a2e7beedb844a206042ab586e2fc05.png" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-[0.25px] left-[66.02px] w-[13.495px] h-[14.603px]">
                        <img alt="asterisk" className="block w-full h-full" src="/assets/asterisk.svg" />
                      </div>
                      <div className="absolute top-[30.97px] left-[63.62px] w-[64.377px] h-[43.645px]">
                        <p className="text-[16.905px] font-semibold text-black leading-normal">
                          <span className="block mb-0">(tell me</span>
                          <span>more)</span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-black flex h-[52px] items-center justify-center p-[7.044px] w-[280px]">
                      <p className="text-[24px] font-medium text-white whitespace-nowrap">어떤 답변도 좋아요</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[40px] text-black text-center font-normal w-full" style={{ fontFamily: FONT_FAMILY }}>
                ⠡⠑⠂⠈⠳⠇⠒
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 "scroll down" 텍스트 - 스크롤하면 사라짐 */}
      <div 
        className="fixed left-[659px] top-[943px] flex flex-col gap-[5px] items-center z-30"
        style={scrollDownStyle}
      >
        <p className="text-[20px] font-medium text-white">scroll down</p>
        <div className="w-0 h-[16px] flex items-center justify-center">
          <div className="rotate-[90deg]">
            <div className="relative w-[16px] h-full">
              <div className="absolute inset-[-7.36px_-6.25%_-7.36px_0]">
                <img alt="화살표" className="block max-w-none w-full h-full" src="/assets/Arrow 9.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
