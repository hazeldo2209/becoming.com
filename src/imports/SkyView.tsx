import svgPaths from "./svg-ovar5acj3h";

function Group() {
  return (
    <div className="h-[17.417px] relative shrink-0 w-[16.5px]" data-name="Group">
      <div className="absolute inset-[-5.26%_-5.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 19.2504">
          <g id="Group">
            <path d={svgPaths.p3b706200} id="Vector" stroke="var(--stroke-0, #AAAAAA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
            <path d={svgPaths.p629d000} id="Vector_2" stroke="var(--stroke-0, #AAAAAA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center relative shrink-0 w-[60px]">
      <Group />
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] min-w-full not-italic relative shrink-0 text-[#aaa] text-[10px] text-center w-[min-content]">Today</p>
    </div>
  );
}

function GameIconsSeaStar() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="game-icons:sea-star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="game-icons:sea-star">
          <path d={svgPaths.p7a48580} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center relative shrink-0 w-[60px]">
      <GameIconsSeaStar />
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] min-w-full not-italic relative shrink-0 text-[10px] text-black text-center w-[min-content]">Sky</p>
    </div>
  );
}

function StreamlineStar2Remix() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="streamline:star-2-remix">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g clipPath="url(#clip0_1_605)" id="streamline:star-2-remix">
          <path d={svgPaths.p4739780} id="Vector" stroke="var(--stroke-0, #AAAAAA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.875" />
        </g>
        <defs>
          <clipPath id="clip0_1_605">
            <rect fill="white" height="21" width="21" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center relative shrink-0 w-[60px]">
      <StreamlineStar2Remix />
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] min-w-full not-italic relative shrink-0 text-[#aaa] text-[10px] text-center w-[min-content]">AI</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[4.17%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.25 19.25">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p3b8a5000} fill="var(--fill-0, #AAAAAA)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p7905800} fill="var(--fill-0, #AAAAAA)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function GgProfile() {
  return (
    <div className="overflow-clip relative shrink-0 size-[21px]" data-name="gg:profile">
      <Group1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center relative shrink-0 w-[60px]">
      <GgProfile />
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] min-w-full not-italic relative shrink-0 text-[#aaa] text-[10px] text-center w-[min-content]">Profile</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[31px] h-[94px] items-start left-[-3px] pb-[36px] pl-[28px] pr-[29px] pt-[12px] top-[745px] w-[390px]">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none" />
      <Frame />
      <Frame3 />
      <Frame1 />
      <Frame2 />
    </div>
  );
}

export default function SkyView() {
  return (
    <div className="bg-[#faf7f2] border-3 border-[#1a1a1a] border-solid overflow-clip relative rounded-[36px] size-full" data-name="Sky View">
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[44px] left-[-3px] top-[-3px] w-[390px]" data-name="Rectangle" />
      <Frame4 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[13px] not-italic text-[#1a1a1a] text-[13px] top-[10px] whitespace-nowrap">9:41</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[317px] not-italic text-[#1a1a1a] text-[11px] top-[11px] whitespace-pre">{`▶  ▶▶  ▊▊`}</p>
      <div className="absolute bg-[#1a1a1a] h-[4px] left-[142px] rounded-[2px] top-[817px] w-[100px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[17px] not-italic text-[#1a1a1a] text-[22px] top-[57px] whitespace-nowrap">Your Sky</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[197px] not-italic text-[#888] text-[11px] top-[63px] whitespace-pre">{`12 stars  ·  2 constellations`}</p>
      <div className="absolute h-0 left-[-3px] top-[89px] w-[390px]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 390 1">
            <path d="M0 0.5H390" id="Vector" stroke="var(--stroke-0, #CCCCCC)" />
          </svg>
        </div>
      </div>
      <div className="absolute bg-[#e4e0d8] border-[#1a1a1a] border-[1.5px] border-solid h-[340px] left-[17px] rounded-[12px] top-[101px] w-[350px]" data-name="Star Map" />
      <div className="absolute h-[340px] left-[17px] top-[101px] w-[350px]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 350.557 340.574">
          <path d={svgPaths.p3346ae80} id="Vector" stroke="var(--stroke-0, #AAAAAA)" strokeWidth="0.8" />
        </svg>
      </div>
      <div className="absolute h-[340px] left-[17px] top-[101px] w-[350px]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 350.557 340.574">
          <path d={svgPaths.p12c7300} id="Vector" stroke="var(--stroke-0, #AAAAAA)" strokeWidth="0.8" />
        </svg>
      </div>
      <div className="absolute left-[72px] size-[10px] top-[152px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[132px] size-[10px] top-[122px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[192px] size-[10px] top-[172px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[262px] size-[10px] top-[137px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[302px] size-[10px] top-[192px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[92px] size-[10px] top-[232px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[152px] size-[10px] top-[272px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[222px] size-[10px] top-[252px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[282px] size-[10px] top-[292px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[332px] size-[10px] top-[262px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[122px] size-[10px] top-[352px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute left-[242px] size-[10px] top-[372px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <circle cx="5" cy="5" fill="var(--fill-0, #1A1A1A)" id="Ellipse" r="5" />
        </svg>
      </div>
      <div className="absolute h-[30px] left-[77px] top-[127px] w-[60px]" data-name="Vector">
        <div className="absolute inset-[-1.49%_-0.37%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60.4472 30.8944">
            <path d={svgPaths.p4272e00} id="Vector" stroke="var(--stroke-0, #555555)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[50px] left-[137px] top-[127px] w-[60px]" data-name="Vector">
        <div className="absolute inset-[-0.77%_-0.53%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60.6402 50.7682">
            <path d={svgPaths.p2bb57900} id="Vector" stroke="var(--stroke-0, #555555)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[35px] left-[197px] top-[142px] w-[70px]" data-name="Vector">
        <div className="absolute inset-[-1.28%_-0.32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70.4472 35.8944">
            <path d={svgPaths.p10511804} id="Vector" stroke="var(--stroke-0, #555555)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[55px] left-[267px] top-[142px] w-[40px]" data-name="Vector">
        <div className="absolute inset-[-0.53%_-1.01%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.8087 55.5882">
            <path d={svgPaths.p38150e40} id="Vector" stroke="var(--stroke-0, #555555)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[40px] left-[97px] top-[237px] w-[60px]" data-name="Vector">
        <div className="absolute inset-[-1.04%_-0.46%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60.5547 40.832">
            <path d={svgPaths.p39170300} id="Vector" stroke="var(--stroke-0, #555555)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[20px] left-[157px] top-[257px] w-[70px]" data-name="Vector">
        <div className="absolute inset-[-2.4%_-0.2%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70.2747 20.9615">
            <path d={svgPaths.p211a8480} id="Vector" stroke="var(--stroke-0, #555555)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[40px] left-[227px] top-[257px] w-[60px]" data-name="Vector">
        <div className="absolute inset-[-1.04%_-0.46%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60.5547 40.832">
            <path d={svgPaths.p39170300} id="Vector" stroke="var(--stroke-0, #555555)" />
          </svg>
        </div>
      </div>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[197px] not-italic text-[#666] text-[11px] text-center top-[417px] w-[230px] whitespace-pre-wrap">{`Star Map  (tap star to view entry)`}</p>
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[17px] not-italic text-[#1a1a1a] text-[14px] top-[459px] whitespace-nowrap">Focus Areas</p>
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[28px] left-[17px] rounded-[14px] top-[479px] w-[78px]" data-name="Rectangle" />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[56px] not-italic text-[#444] text-[10px] text-center top-[487px] w-[70px]">Career</p>
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[28px] left-[105px] rounded-[14px] top-[479px] w-[78px]" data-name="Rectangle" />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[144px] not-italic text-[#444] text-[10px] text-center top-[487px] w-[70px]">Creativity</p>
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[28px] left-[193px] rounded-[14px] top-[479px] w-[78px]" data-name="Rectangle" />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[232px] not-italic text-[#444] text-[10px] text-center top-[487px] w-[70px]">Connection</p>
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[28px] left-[281px] rounded-[14px] top-[479px] w-[78px]" data-name="Rectangle" />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[320px] not-italic text-[#444] text-[10px] text-center top-[487px] w-[70px]">Health</p>
      <div className="absolute bg-[#f8f6f2] border border-[#ccc] border-solid h-[80px] left-[17px] rounded-[10px] top-[521px] w-[350px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[25px] not-italic text-[#1a1a1a] text-[12px] top-[531px] whitespace-nowrap">Progress This Month</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[25px] not-italic text-[#666] text-[11px] top-[552px] w-[320px] whitespace-pre-wrap">{`12 reflections  ·  3 actions completed  ·  5 days streak`}</p>
      <div className="absolute bg-[#e0ddd6] h-[12px] left-[25px] rounded-[6px] top-[571px] w-[314px]" data-name="Rectangle" />
      <div className="absolute bg-[#1a1a1a] h-[12px] left-[25px] rounded-[6px] top-[571px] w-[200px]" data-name="Rectangle" />
      <div className="absolute bg-white border-[#1a1a1a] border-[1.5px] border-solid h-[60px] left-[17px] rounded-[10px] top-[617px] w-[350px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Bold','Noto_Sans_Symbols2:Regular',sans-serif] font-bold leading-[normal] left-[29px] not-italic text-[#1a1a1a] text-[13px] top-[631px] whitespace-pre">{`✦  New constellation forming...`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[29px] not-italic text-[#666] text-[11px] top-[651px] w-[300px]">{`3 more entries to unlock "Brave Steps"`}</p>
    </div>
  );
}