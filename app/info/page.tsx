export default function InfoPage() {
  return (
    <div className="min-h-screen bg-[#95acac] border border-black relative flex items-center justify-center p-4">
      <div className="relative w-[430px] flex flex-col items-center gap-[80px]">
        {/* 메인 컨텐츠 */}
        <div className="flex flex-col items-center gap-[84px] w-full">
          {/* 상단 로고 */}
          <div className="h-[188.947px] w-[350.999px] relative">
            <img 
              alt="연말 결산 로고" 
              className="block w-full h-full object-contain" 
              src="/assets/4b737a59b34927c932bd0bcc16fbcd62978292b6.svg" 
            />
          </div>

          {/* 3개의 섹션 */}
          <div className="flex flex-col gap-[16px] items-start w-full">
            {/* 첫 번째 섹션 */}
            <div className="flex gap-[16px] items-start w-full">
              <div className="flex flex-col gap-[4px] h-[80px] items-center w-[128px] relative">
                <div className="relative w-[121.549px] h-[44.376px]">
                  <div className="absolute top-0 left-[15.5px] w-[12.367px] h-[13.383px]">
                    <img 
                      alt="" 
                      className="block w-full h-full" 
                      src="/assets/10f6f129c67e5cdbc9e02af1dd96f1719624de84.svg" 
                    />
                  </div>
                  <div className="absolute top-[4.23px] left-0 w-[121.549px] h-[44.376px]">
                    <img 
                      alt="" 
                      className="block w-full h-full" 
                      src="/assets/house.svg" 
                    />
                  </div>
                </div>
                <p className="text-[16.905px] font-semibold text-black text-center">
                  (집이면 어때)
                </p>
              </div>
              <div className="bg-black flex h-[52px] items-center justify-center p-[7.044px] w-[280px]">
                <p className="text-[24px] font-medium text-white whitespace-nowrap">
                  어디서든 괜찮아요
                </p>
              </div>
            </div>

            {/* 두 번째 섹션 */}
            <div className="flex gap-[16px] items-start w-full">
              <div className="flex flex-col gap-[4px] h-[80px] items-center w-[128px] relative">
                <div className="relative w-[128px] h-[58px]">
                  <div className="absolute top-[0.02px] left-0 w-[58px] h-[58px]">
                    <img 
                      alt="man 3" 
                      className="absolute inset-0 w-full h-full object-cover object-center" 
                      src="/assets/c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png" 
                    />
                  </div>
                  <div className="absolute top-[0.02px] left-[34.61px] w-[58px] h-[58px]">
                    <img 
                      alt="man 1" 
                      className="absolute inset-0 w-full h-full object-cover object-center" 
                      src="/assets/c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png" 
                    />
                  </div>
                  <div className="absolute top-[0.02px] left-[69.61px] w-[58px] h-[58px]">
                    <img 
                      alt="man 2" 
                      className="absolute inset-0 w-full h-full object-cover object-center" 
                      src="/assets/c8bdd116d3c4a84abefc09e8666ed38e8991bd15.png" 
                    />
                  </div>
                </div>
                <p className="text-[16.905px] font-semibold text-black text-center">
                  (모두가 궁금해)
                </p>
              </div>
              <div className="bg-black flex h-[52px] items-center justify-center p-[7.044px] w-[280px]">
                <p className="text-[24px] font-medium text-white whitespace-nowrap">
                  누구라도 괜찮아요
                </p>
              </div>
            </div>

            {/* 세 번째 섹션 */}
            <div className="flex gap-[16px] items-start w-full">
              <div className="relative w-[128px] h-[80px]">
                <div className="absolute top-0 left-0 w-[76.671px] h-[76.671px] flex items-center justify-center">
                  <div className="rotate-[5.754deg]">
                    <div className="relative w-[70.005px] h-[70.005px]">
                      <img 
                        alt="man (2) 1" 
                        className="absolute inset-0 w-full h-full object-cover object-center" 
                        src="/assets/8518a8fe65a2e7beedb844a206042ab586e2fc05.png" 
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute top-[0.25px] left-[66.02px] w-[13.495px] h-[14.603px]">
                  <img 
                    alt="" 
                    className="block w-full h-full" 
                    src="/assets/09f01a3d3a3014f6124c040de9397d511a27f10a.svg" 
                  />
                </div>
                <div className="absolute top-[30.97px] left-[63.62px] w-[64.377px] h-[43.645px]">
                  <p className="text-[16.905px] font-semibold text-black leading-normal">
                    <span className="block mb-0">(tell me</span>
                    <span>more)</span>
                  </p>
                </div>
              </div>
              <div className="bg-black flex h-[52px] items-center justify-center p-[7.044px] w-[280px]">
                <p className="text-[24px] font-medium text-white whitespace-nowrap">
                  어떤 답변도 좋아요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 점자 텍스트 */}
        <p className="text-[40px] text-black text-center font-normal w-full">
          ⠡⠑⠂⠈⠳⠇⠒
        </p>
      </div>
    </div>
  );
}

