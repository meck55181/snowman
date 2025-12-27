"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

// 상수 정의
const CARD_WIDTH = 612;
const CARD_HEIGHT = 792;
const FONT_FAMILY = "'Pretendard', 'Noto Sans Symbols 2', sans-serif";
const SCROLL_THRESHOLD = 300; // 이 값 이상 스크롤하면 PosterPage가 한번에 사라짐


export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [scale, setScale] = useState(0.85);
  const [logoHeight, setLogoHeight] = useState(92);
  const [isMobile, setIsMobile] = useState(false);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 화면 크기에 따른 scale 계산 및 로고 높이 계산
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // 모바일 여부 확인 (640px 미만)
      setIsMobile(width < 640);
      
      // 로고 높이 계산 (작은 화면: 이미지16px + 텍스트12px + 간격2px + top24px = 54px, 큰 화면: 이미지28px + 텍스트20px + 간격4px + top40px = 92px)
      setLogoHeight(width < 640 ? 54 : 92);
      
      // 모바일에서 padding 12px (좌우 24px, 상하 24px) 고려
      const padding = width < 640 ? 24 : 0; // sm breakpoint 미만이면 padding 적용
      const availableWidth = width - padding;
      const availableHeight = height - padding;
      
      if (width < 400) {
        setScale(Math.min(availableWidth / CARD_WIDTH, availableHeight / CARD_HEIGHT, 0.7));
      } 
      else {
        setScale(Math.min(availableWidth / CARD_WIDTH, availableHeight / CARD_HEIGHT, 0.8));
      }
    };
    
    updateScale();
    window.addEventListener("resize", updateScale, { passive: true });
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // 메모이제이션된 계산 값들
  const posterPageOffset = useMemo(() => {
    if (scrollY < SCROLL_THRESHOLD) {
      return 0;
    }
    return 500; // 한번에 위로 올라가는 거리
  }, [scrollY]);
  const posterPageOpacity = useMemo(() => {
    return scrollY < SCROLL_THRESHOLD ? 1 : 0;
  }, [scrollY]);
  const scrollDownOpacity = useMemo(() => Math.max(0, 1 - scrollY / 200), [scrollY]);

  // 메모이제이션된 스타일 객체들
  const linkerPageStyle = useMemo(() => {
    // 모바일일 때만 로고 영역을 피하기 위해 아래로 이동
    const logoOffset = isMobile ? logoHeight / 2 : 0;
    return {
      transform: `translate(-50%, calc(-50% + ${logoOffset}px)) scale(${scale})`,
    zIndex: 10,
    };
  }, [scale, logoHeight, isMobile]);

  const posterPageStyle = useMemo(() => {
    // 모바일일 때만 로고 영역을 피하기 위해 아래로 이동
    const logoOffset = isMobile ? logoHeight / 2 : 0;
    return {
      transform: `translate(calc(-50% + 8.12px), calc(-50% + ${logoOffset}px - ${posterPageOffset}px + 14.38px)) rotate(8deg) scale(${scale})`,
    opacity: posterPageOpacity,
    zIndex: 20,
      transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
    };
  }, [posterPageOffset, posterPageOpacity, scale, logoHeight, isMobile]);

  const scrollDownStyle = useMemo(() => ({
    opacity: scrollDownOpacity,
  }), [scrollDownOpacity]);

  return (
    <div className="min-h-[200vh] bg-black relative overflow-x-hidden p-3 sm:p-16">
      {/* 상단 왼쪽 로고 (축소 버전) */}
      <div className="fixed left-6 top-6 sm:left-[40px] sm:top-[40px] flex flex-col gap-[2px] sm:gap-[4px] items-center w-[60px] sm:w-[110px] z-30 pointer-events-none">
        <div className="h-[16px] w-[56px] sm:h-[28px] sm:w-[100px] relative">
          <img 
            alt="연말정산 로고" 
            className="block w-full h-full" 
            src="/assets/main_연말정산_로고.svg" 
          />
        </div>
        <p className="text-[12px] sm:text-[20px] text-white font-normal" style={{ fontFamily: FONT_FAMILY }}>
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
          <div className="bg-[#eee] border-2 border-black h-full w-full overflow-hidden relative">
            {/* LinkerPage 전체 내용 - Figma 디자인에 맞춘 absolute positioning */}
            
            {/* 로고 */}
            <div className="absolute h-[87px] left-[224.74px] top-[38.5px] w-[161.616px]">
                <img 
                  alt="연말정산 로고" 
                className="block max-w-none size-full" 
                src="/assets/tree_small.svg" 
                />
              </div>

                {/* 첫 번째 질문 박스 */}
            <div className="absolute bg-white border border-black border-solid flex h-[94px] items-center justify-center left-[67.05px] p-[6.212px] top-[153.5px] w-[477px]">
                  <div className="text-base font-medium text-black text-center leading-normal">
                    <p className="mb-0">이제 곧 2025년이 끝난다는 사실.</p>
                    <p>알고 계셨나요?</p>
                  </div>
                </div>

                {/* 첫 번째 YES 박스 */}
            <div className="absolute bg-white border border-black border-solid flex h-[52px] items-center justify-center left-[67.05px] p-[6.212px] top-[285.5px] w-[225px]">
                  <p className="text-base font-medium text-black">YES</p>
                </div>

                {/* 첫 번째 NO 박스 */}
            <div className="absolute bg-white border border-black border-solid flex h-[52px] items-center justify-center left-[318.05px] p-[6.212px] top-[285.5px] w-[225px]">
                  <p className="text-base font-medium text-black">NO</p>
                </div>

            {/* 두 번째 질문 박스 */}
            <div className="absolute bg-white border border-black border-solid flex h-[89px] items-center justify-center left-[67.05px] p-[6.212px] top-[375.5px] w-[225px]">
                  <div className="text-base font-medium text-black text-center leading-normal">
                <p className="mb-0">연말결산을</p>
                    <p>작성했나요?</p>
                  </div>
                </div>

                {/* 두 번째 YES 박스 */}
            <div className="absolute bg-white border border-black border-solid flex h-[53px] items-center justify-center left-[67.05px] p-[6.212px] top-[501.5px] w-[225px]">
                  <p className="text-base font-medium text-black">YES</p>
                </div>

                {/* 두 번째 NO 박스 */}
            <div className="absolute bg-white border border-black border-solid flex h-[53px] items-center justify-center left-[318.05px] p-[6.212px] top-[501.5px] w-[225px]">
                  <p className="text-base font-medium text-black">NO</p>
                </div>

                {/* 화살표들 */}
                {/* 1. 첫 번째 질문에서 YES로 가는 대각선 화살표 */}
            <div className="absolute flex h-[32px] items-center justify-center left-[187.22px] top-[247.08px] w-[117.651px] pointer-events-none">
              <div className="flex-none scale-x-[-100%]">
                <div className="relative w-[119px] h-[33px]">
                  <img alt="" className="block max-w-none w-full h-full" src="/assets/Arrow 2.svg" />
                </div>
              </div>
                </div>

                {/* 2. 첫 번째 질문에서 NO로 가는 대각선 화살표 */}
            <div className="absolute flex h-[32px] items-center justify-center left-[304.87px] top-[247.08px] w-[117.651px] pointer-events-none">
              <div className="flex-none">
                <div className="relative w-[119px] h-[33px]">
                  <img alt="" className="block max-w-none w-full h-full" src="/assets/Arrow 2.svg" />
                </div>
              </div>
                </div>

                {/* 3. 첫 번째 YES에서 두 번째 질문으로 가는 세로 화살표 */}
            <div className="absolute flex h-[24px] items-center justify-center left-[179.55px] top-[337.5px] w-0 pointer-events-none">
              <div className="flex-none rotate-[90deg]">
                <div className="h-0 relative w-[27px]">
                  <div className="absolute inset-[-4.57px_-2.3%_-4.57px_0]">
                    <img alt="" className="block max-w-none size-full" src="/assets/Arrow 9.svg" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 두 번째 질문에서 YES로 가는 세로 화살표 */}
            <div className="absolute flex h-[24px] items-center justify-center left-[179.89px] top-[464.5px] w-0 pointer-events-none">
              <div className="flex-none rotate-[90deg]">
                <div className="h-0 relative w-[26px]">
                  <div className="absolute inset-[-4.57px_-2.39%_-4.57px_0]">
                    <img alt="" className="block max-w-none size-full" src="/assets/Arrow 9.svg" />
                  </div>
                </div>
              </div>
                </div>

            {/* 5. 두 번째 질문에서 NO로 가는 대각선 화살표 */}
            <div className="absolute flex h-[38px] items-center justify-center left-[180px] top-[460px] w-[240px] pointer-events-none">
              <div className="flex-none rotate-[2deg]">
                <div className="relative w-[240px] h-[28px]">
                  <img alt="" className="block max-w-none w-full h-full" src="/assets/Arrow 5.svg" />
                </div>
              </div>
            </div>

                {/* 6. 두 번째 YES에서 아래로 가는 세로 화살표 */}
            <div className="absolute flex h-[24px] items-center justify-center left-[180.05px] top-[554.5px] w-0 pointer-events-none">
              <div className="flex-none rotate-[90deg]">
                <div className="h-0 relative w-[26px]">
                  <div className="absolute inset-[-4.57px_-2.39%_-4.57px_0]">
                    <img alt="" className="block max-w-none size-full" src="/assets/Arrow 9.svg" />
                  </div>
                </div>
              </div>
            </div>

                {/* 7. 두 번째 NO에서 아래로 가는 세로 화살표 */}
            <div className="absolute flex h-[24px] items-center justify-center left-[431.05px] top-[554.5px] w-0 pointer-events-none">
              <div className="flex-none rotate-[90deg]">
                <div className="h-0 relative w-[26px]">
                  <div className="absolute inset-[-4.57px_-2.39%_-4.57px_0]">
                    <img alt="" className="block max-w-none size-full" src="/assets/Arrow 9.svg" />
                  </div>
                </div>
              </div>
              </div>

            {/* 버튼들 */}
            <div className="absolute flex gap-[29px] items-center left-[66px] top-[608.5px] w-[479.094px]">
                <Link
                  href={"/All" as any}
                className="animate-pulse-bg bg-[#95acac] border border-black border-solid flex flex-col gap-[11.258px] h-[88px] items-center justify-center px-0 text-base text-black w-[225px] hover:opacity-90 transition-opacity cursor-pointer no-underline hover:no-underline"
                >
                  <p className="font-semibold text-center">모두의 결산</p>
                  <p className="text-sm font-semibold" style={{ fontFamily: FONT_FAMILY }}>⠑⠥⠊⠍⠺⠀⠈⠳⠇⠒</p>
                </Link>
                <Link
                  href={"/My" as any}
                className="animate-pulse-bg bg-[#95acac] border border-black border-solid flex flex-col gap-[11.258px] h-[88px] items-center justify-center p-0 text-base text-black w-[225px] hover:opacity-90 transition-opacity cursor-pointer no-underline hover:no-underline"
                >
                  <p className="font-semibold text-center">나의 결산</p>
                  <p className="text-sm font-semibold" style={{ fontFamily: FONT_FAMILY }}>⠉⠣⠺⠈⠳⠇⠒</p>
                </Link>
              </div>

            {/* 하단 텍스트 */}
            <p className="absolute text-[24px] text-black text-center font-normal left-[305.55px] top-[724.5px] translate-x-[-50%] w-[479.094px]" style={{ fontFamily: FONT_FAMILY }}>
                ⠡⠑⠂⠈⠳⠇⠒
              </p>
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
                          <img alt="man 1" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/man 1.png" />
                        </div>
                        <div className="absolute top-[0.02px] left-[34.61px] w-[58px] h-[58px]">
                          <img alt="man 1" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/man 1.png" />
                        </div>
                        <div className="absolute top-[0.02px] left-[69.61px] w-[58px] h-[58px]">
                          <img alt="man 1" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/man 1.png" />
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
                            <img alt="man (2) 1" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/man_2.png" />
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
        className={`fixed left-1/2 -translate-x-1/2 bottom-[24px] flex flex-col gap-[5px] items-center z-30 ${scrollDownOpacity > 0.5 ? 'animate-blink' : ''}`}
        style={scrollDownStyle}
      >
        <p className="text-[16px] font-medium text-white">scroll</p>
        <div className="w-[16px] h-[16px] flex items-center justify-center">
          <img alt="화살표" className="block max-w-none w-full h-full rotate-180" src="/assets/arrow_scroll.svg" />
        </div>
      </div>
    </div>
  );
}
