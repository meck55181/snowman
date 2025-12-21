"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // InfoPage가 위로 올라가면서 사라지는 효과
  const infoPageOffset = scrollY * 1.2; // 더 빠르게 위로 올라감
  const infoPageOpacity = Math.max(0, 1 - scrollY / 400); // 스크롤하면 투명해짐
  
  // TaxPage는 중앙에 고정 (변화 없음)
  
  // scroll down 텍스트가 사라지는 효과
  const scrollDownOpacity = Math.max(0, 1 - scrollY / 200);

  // 화면 크기에 따른 scale 계산 (딱딱 끊기는 느낌)
  const [scale, setScale] = useState(0.85);
  
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // 화면 크기에 따라 scale 결정 (딱딱 끊기는 느낌)
      if (width <640) {
        // 모바일
        setScale(Math.min(width / 612, height / 792, 0.5));
      } else if (width < 768) {
        // 작은 태블릿
        setScale(Math.min(width / 612, height / 792, 0.7));
      } else {
        // 태블릿 이상 (데스크톱 포함)
        setScale(Math.min(width / 612, height / 792, 0.85));
      }
    };
    
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="min-h-[200vh] bg-black relative overflow-x-hidden">
      {/* 상단 왼쪽 로고 */}
      <div className="fixed left-[72px] top-[64px] flex flex-col gap-[5.753px] items-center w-[146.149px] z-30">
        <div className="h-[38.801px] w-[136.471px] relative">
          <img 
            alt="연말정산 로고" 
            className="block w-full h-full" 
            src="/assets/main_연말정산_로고.svg" 
          />
        </div>
        <p className="text-[28.763px] text-white font-normal" style={{ fontFamily: "'Pretendard', 'Noto Sans Symbols 2', sans-serif" }}>
          ⠡⠑⠂⠈⠳⠇⠒
        </p>
      </div>

      {/* 중앙 카드들 */}
      <div className="relative min-h-screen flex items-center justify-center py-[100vh]">
        {/* TaxPage (뒤쪽, 회색) - 중앙에 고정 */}
        <div 
          className="fixed top-1/2 left-1/2 w-[612px] h-[792px] pointer-events-auto"
          style={{
            transform: `translate(-50%, -50%) rotate(356deg) scale(${scale})`,
            zIndex: 10,
          }}
        >
          <div className="bg-[#eee] border border-black h-full w-full overflow-hidden relative flex items-center justify-center">
            <div className="relative w-[479.094px] flex flex-col items-center gap-[28px]">
              {/* TaxPage 전체 내용 */}
              <div className="flex flex-col gap-[12px] items-start w-full">
                <div className="flex flex-col gap-[37px] items-center w-full">
                  <div className="flex items-end gap-[9.209px]">
                    <img 
                      alt="tree" 
                      className="block h-auto object-contain" 
                      src="/assets/stree.svg" 
                    />
                    <img 
                      alt="연말정산 로고" 
                      className="block h-auto object-contain" 
                      src="/assets/s연말정산_로고세로.svg" 
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

                    {/* 첫 번째 YES/NO 박스 */}
                    <div className="absolute top-[132px] left-0 bg-white border border-black flex items-center justify-center p-[6.212px] h-[52px] w-[225px]">
                      <p className="text-base font-medium text-black">YES</p>
                    </div>
                    <div className="absolute top-[132px] left-[251px] bg-white border border-black flex items-center justify-center p-[6.212px] h-[52px] w-[225px]">
                      <p className="text-base font-medium text-black">NO</p>
                    </div>

                    {/* 두 번째 질문 박스 */}
                    <div className="absolute top-[222px] left-0 bg-white border border-black flex items-center justify-center p-[6.212px] h-[89px] w-[225px]">
                      <div className="text-base font-medium text-black text-center leading-normal">
                        <p className="mb-0">연말결산을</p>
                        <p>작성했나요?</p>
                      </div>
                    </div>

                    {/* 두 번째 YES/NO 박스 */}
                    <div className="absolute top-[348px] left-0 bg-white border border-black flex items-center justify-center p-[6.212px] h-[53px] w-[225px]">
                      <p className="text-base font-medium text-black">YES</p>
                    </div>
                    <div className="absolute top-[348px] left-[251px] bg-white border border-black flex items-center justify-center p-[6.212px] h-[53px] w-[225px]">
                      <p className="text-base font-medium text-black">NO</p>
                    </div>

                    {/* 화살표들 */}
                    <div className="absolute top-[94.24px] left-[120.85px] w-[117.651px] h-[28.479px] flex items-center justify-center pointer-events-none">
                      <div className="flex-none rotate-[166.393deg] skew-x-[6.608deg]">
                        <div className="h-0 relative w-[121.049px]">
                          <div className="absolute inset-[-4.57px_-0.51%_-4.57px_0]">
                            <img alt="" className="block max-w-none size-full" src="/assets/Arrow 7.svg" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-[94.24px] left-[238.5px] w-[117.651px] h-[28.479px] flex items-center justify-center pointer-events-none">
                      <div className="flex-none rotate-[13.607deg] scale-y-[-100%] skew-x-[6.608deg]">
                        <div className="h-0 relative w-[121.049px]">
                          <div className="absolute inset-[-4.57px_-0.51%_-4.57px_0]">
                            <img alt="" className="block max-w-none size-full" src="/assets/Arrow 8.svg" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-[311.29px] left-[112.85px] w-[249.481px] h-[27.569px] flex items-center justify-center pointer-events-none">
                      <div className="flex-none rotate-[6.306deg]">
                        <div className="h-0 relative w-[251px]">
                          <div className="absolute inset-[-4.57px_-0.25%_-4.57px_0]">
                            <img alt="" className="block max-w-none size-full" src="/assets/Arrow 13.svg" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-[184px] left-[113px] w-0 h-[27px] flex items-center justify-center pointer-events-none">
                      <div className="flex-none rotate-[90deg]">
                        <div className="h-0 relative w-[27px]">
                          <div className="absolute inset-[-4.57px_-2.3%_-4.57px_0]">
                            <img alt="" className="block max-w-none size-full" src="/assets/Arrow 9.svg" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-[311px] left-[113px] w-0 h-[26px] flex items-center justify-center pointer-events-none">
                      <div className="flex-none rotate-[90deg]">
                        <div className="h-0 relative w-[26px]">
                          <div className="absolute inset-[-4.57px_-2.39%_-4.57px_0]">
                            <img alt="" className="block max-w-none size-full" src="/assets/Arrow 10.svg" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-[401px] left-[113px] w-0 h-[26px] flex items-center justify-center pointer-events-none">
                      <div className="flex-none rotate-[90deg]">
                        <div className="h-0 relative w-[26px]">
                          <div className="absolute inset-[-4.57px_-2.39%_-4.57px_0]">
                            <img alt="" className="block max-w-none size-full" src="/assets/Arrow 10.svg" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-[401px] left-[364px] w-0 h-[26px] flex items-center justify-center pointer-events-none">
                      <div className="flex-none rotate-[90deg]">
                        <div className="h-0 relative w-[26px]">
                          <div className="absolute inset-[-4.57px_-2.39%_-4.57px_0]">
                            <img alt="" className="block max-w-none size-full" src="/assets/Arrow 10.svg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-[29px] items-center w-full">
                <Link
                  href="/board"
                  className="bg-[#95acac] border border-black flex flex-col gap-[11.258px] h-[88px] items-center justify-center px-0 text-base text-black w-[225px] hover:opacity-90 transition-opacity cursor-pointer no-underline hover:no-underline"
                >
                  <p className="font-semibold text-center">모두의 결산</p>
                  <p className="text-sm font-semibold" style={{ fontFamily: "'Pretendard', 'Noto Sans Symbols 2', sans-serif" }}>⠑⠥⠊⠍⠺⠀⠈⠳⠇⠒</p>
                </Link>
                <Link
                  href="/submit"
                  className="bg-[#95acac] border border-black flex flex-col gap-[11.258px] h-[88px] items-center justify-center px-0 text-base text-black w-[225px] hover:opacity-90 transition-opacity cursor-pointer no-underline hover:no-underline"
                >
                  <p className="font-semibold text-center">나의 결산</p>
                  <p className="text-sm font-semibold" style={{ fontFamily: "'Pretendard', 'Noto Sans Symbols 2', sans-serif" }}>⠉⠣⠺⠈⠳⠇⠒</p>
                </Link>
              </div>

              <p className="text-[24px] text-black text-center font-normal" style={{ fontFamily: "'Pretendard', 'Noto Sans Symbols 2', sans-serif" }}>
                ⠡⠑⠂⠈⠳⠇⠒
              </p>
            </div>
          </div>
        </div>

        {/* InfoPage (앞쪽, 연한 파란색) - 스크롤하면 위로 올라가며 사라짐 */}
        <div 
          className="fixed top-1/2 left-1/2 w-[612px] h-[792px]"
          style={{
            transform: `translate(calc(-50% + 8.12px), calc(-50% - ${infoPageOffset}px + 14.38px)) rotate(4deg) scale(${scale})`,
            opacity: infoPageOpacity,
            zIndex: 20,
          }}
        >
          <div className="bg-[#95acac] border border-black h-full w-full overflow-hidden relative flex items-center justify-center">
            <div className="relative w-[430px] flex flex-col items-center gap-[80px]">
              <div className="flex flex-col items-center gap-[84px] w-full">
                <div className="flex items-end gap-[9.209px]">
                  <img 
                    alt="tree" 
                    className="block h-auto object-contain" 
                    src="/assets/tree.svg" 
                  />
                  <img 
                    alt="연말정산 로고" 
                    className="block h-auto object-contain" 
                    src="/assets/연말정산_로고세로.svg" 
                  />
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
                          <img alt="man 3" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png" />
                        </div>
                        <div className="absolute top-[0.02px] left-[34.61px] w-[58px] h-[58px]">
                          <img alt="man 1" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png" />
                        </div>
                        <div className="absolute top-[0.02px] left-[69.61px] w-[58px] h-[58px]">
                          <img alt="man 2" className="absolute inset-0 w-full h-full object-cover object-center" src="/assets/c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png" />
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
              <p className="text-[40px] text-black text-center font-normal w-full" style={{ fontFamily: "'Pretendard', 'Noto Sans Symbols 2', sans-serif" }}>
                ⠡⠑⠂⠈⠳⠇⠒
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 "scroll down" 텍스트 - 스크롤하면 사라짐 */}
      <div 
        className="fixed left-[659px] top-[943px] flex flex-col gap-[5px] items-center z-30"
        style={{ opacity: scrollDownOpacity }}
      >
        <p className="text-[20px] font-medium text-white">scroll down</p>
        <div className="w-0 h-[16px] flex items-center justify-center">
          <div className="rotate-[90deg]">
            <div className="relative w-[16px] h-full">
              <div className="absolute inset-[-7.36px_-6.25%_-7.36px_0]">
                <img alt="화살표" className="block max-w-none w-full h-full" src="/assets/Arrow 14.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
