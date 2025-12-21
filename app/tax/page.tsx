import Link from "next/link";

export default function TaxPage() {
  return (
    <div className="min-h-screen bg-[#eee] relative flex items-center justify-center py-12 px-4">
      {/* 전체 컨테이너 - Figma의 정확한 위치 기준 */}
      <div className="relative w-[479.094px] flex flex-col items-center gap-7">
        {/* 상단 로고 */}
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

        {/* 플로우차트 - Grid 레이아웃으로 정확한 위치 */}
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

          {/* 화살표들 - Figma의 정확한 위치 기준 (ml = left, mt = top) */}
          
          {/* 1. 첫 번째 질문에서 YES로 가는 대각선 화살표 (왼쪽) */}
          <div className="absolute top-[94.24px] left-[120.85px] w-[117.651px] h-[28.479px] flex items-center justify-center pointer-events-none">
            <div className="flex-none rotate-[166.393deg] skew-x-[6.608deg]">
              <div className="h-0 relative w-[121.049px]">
                <div className="absolute inset-[-4.57px_-0.51%_-4.57px_0]">
                  <img 
                    alt="" 
                    className="block max-w-none size-full" 
                    src="/assets/Arrow 7.svg" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. 첫 번째 질문에서 NO로 가는 대각선 화살표 (오른쪽) */}
          <div className="absolute top-[94.24px] left-[238.5px] w-[117.651px] h-[28.479px] flex items-center justify-center pointer-events-none">
            <div className="flex-none rotate-[13.607deg] scale-y-[-100%] skew-x-[6.608deg]">
              <div className="h-0 relative w-[121.049px]">
                <div className="absolute inset-[-4.57px_-0.51%_-4.57px_0]">
                  <img 
                    alt="" 
                    className="block max-w-none size-full" 
                    src="/assets/Arrow 8.svg" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. 두 번째 질문에서 YES/NO로 가는 대각선 화살표 */}
          <div className="absolute top-[311.29px] left-[112.85px] w-[249.481px] h-[27.569px] flex items-center justify-center pointer-events-none">
            <div className="flex-none rotate-[6.306deg]">
              <div className="h-0 relative w-[251px]">
                <div className="absolute inset-[-4.57px_-0.25%_-4.57px_0]">
                  <img 
                    alt="" 
                    className="block max-w-none size-full" 
                    src="/assets/Arrow 13.svg" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. 첫 번째 YES에서 두 번째 질문으로 가는 세로 화살표 */}
          <div className="absolute top-[184px] left-[113px] w-0 h-[27px] flex items-center justify-center pointer-events-none">
            <div className="flex-none rotate-[90deg]">
              <div className="h-0 relative w-[27px]">
                <div className="absolute inset-[-4.57px_-2.3%_-4.57px_0]">
                  <img 
                    alt="" 
                    className="block max-w-none size-full" 
                    src="/assets/Arrow 9.svg" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5. 두 번째 질문에서 YES로 가는 세로 화살표 */}
          <div className="absolute top-[311px] left-[113px] w-0 h-[26px] flex items-center justify-center pointer-events-none">
            <div className="flex-none rotate-[90deg]">
              <div className="h-0 relative w-[26px]">
                <div className="absolute inset-[-4.57px_-2.39%_-4.57px_0]">
                  <img 
                    alt="" 
                    className="block max-w-none size-full" 
                    src="/assets/Arrow 10.svg" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 6. 두 번째 YES에서 아래로 가는 세로 화살표 (모두의 정산으로) */}
          <div className="absolute top-[401px] left-[113px] w-0 h-[26px] flex items-center justify-center pointer-events-none">
            <div className="flex-none rotate-[90deg]">
              <div className="h-0 relative w-[26px]">
                <div className="absolute inset-[-4.57px_-2.39%_-4.57px_0]">
                  <img 
                    alt="" 
                    className="block max-w-none size-full" 
                    src="/assets/Arrow 10.svg" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 7. 두 번째 NO에서 아래로 가는 세로 화살표 (작성하기로) */}
          <div className="absolute top-[401px] left-[364px] w-0 h-[26px] flex items-center justify-center pointer-events-none">
            <div className="flex-none rotate-[90deg]">
              <div className="h-0 relative w-[26px]">
                <div className="absolute inset-[-4.57px_-2.39%_-4.57px_0]">
                  <img 
                    alt="" 
                    className="block max-w-none size-full" 
                    src="/assets/Arrow 10.svg" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 최종 액션 버튼들 */}
        <div className="flex gap-[29px] items-center w-full">
          {/* 모두의 정산 버튼 - 두 번째 YES에서 연결 */}
          <Link
            href="/submit"
            className="bg-[#95acac] border border-black flex flex-col gap-[11.258px] h-[88px] items-center justify-center px-0 text-base text-black w-[225px] hover:opacity-90 transition-opacity cursor-pointer no-underline hover:no-underline"
          >
            <p className="font-semibold text-center">모두의 정산</p>
            <p className="text-sm font-semibold">⠑⠥⠊⠍⠺⠀⠈⠳⠇⠒</p>
          </Link>

          {/* 작성하기 버튼 - 두 번째 NO에서 연결 */}
          <Link
            href="/board"
            className="bg-[#95acac] border border-black flex flex-col gap-[11.258px] h-[88px] items-center justify-center px-0 text-base text-black w-[225px] hover:opacity-90 transition-opacity cursor-pointer no-underline hover:no-underline"
          >
            <p className="font-semibold text-center">나의 결산</p>
            <p className="text-sm font-semibold">⠉⠣⠺⠈⠳⠇⠒</p>
          </Link>
        </div>

        {/* 하단 점자 텍스트 */}
        <p className="text-2xl text-black text-center font-normal">
          ⠡⠑⠂⠈⠳⠇⠒
        </p>
      </div>
    </div>
  );
}
