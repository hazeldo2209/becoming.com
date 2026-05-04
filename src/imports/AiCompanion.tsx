import svgPaths from "./svg-c9cprv3j5f";

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
          <path d={svgPaths.p7a48580} fill="var(--fill-0, #AAAAAA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center relative shrink-0 w-[60px]">
      <GameIconsSeaStar />
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] min-w-full not-italic relative shrink-0 text-[#aaa] text-[10px] text-center w-[min-content]">Sky</p>
    </div>
  );
}

function StreamlineStar2Remix() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="streamline:star-2-remix">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g clipPath="url(#clip0_1_633)" id="streamline:star-2-remix">
          <path d={svgPaths.p4739780} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.875" />
        </g>
        <defs>
          <clipPath id="clip0_1_633">
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
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] min-w-full not-italic relative shrink-0 text-[10px] text-black text-center w-[min-content]">AI</p>
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

export default function AiCompanion() {
  return (
    <div className="bg-[#faf7f2] border-3 border-[#1a1a1a] border-solid overflow-clip relative rounded-[36px] size-full" data-name="AI Companion">
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[44px] left-[-3px] top-[-3px] w-[390px]" data-name="Rectangle" />
      <Frame4 />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[13px] not-italic text-[#1a1a1a] text-[13px] top-[10px] whitespace-nowrap">9:41</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[317px] not-italic text-[#1a1a1a] text-[11px] top-[11px] whitespace-pre">{`▶  ▶▶  ▊▊`}</p>
      <div className="absolute bg-[#1a1a1a] h-[4px] left-[142px] rounded-[2px] top-[817px] w-[100px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Bold','Noto_Sans_Symbols2:Regular',sans-serif] font-bold leading-[normal] left-[17px] not-italic text-[#1a1a1a] text-[20px] top-[55px] whitespace-nowrap">✦ AI Companion</p>
      <p className="absolute font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-[351px] not-italic text-[#555] text-[20px] top-[57px] whitespace-nowrap">⋯</p>
      <div className="absolute h-0 left-[-3px] top-[87px] w-[390px]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 390 1">
            <path d="M0 0.5H390" id="Vector" stroke="var(--stroke-0, #CCCCCC)" />
          </svg>
        </div>
      </div>
      <div className="absolute bg-[#f0ede8] border border-[#ccc] border-solid h-[34px] left-[17px] rounded-[17px] top-[101px] w-[350px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[25px] not-italic text-[#666] text-[11px] top-[112px] w-[320px] whitespace-pre-wrap">{`💭  Based on your prompt: "fear"  ·  Career focus`}</p>
      <div className="absolute bg-[#1a1a1a] h-[76px] left-[17px] rounded-[16px] top-[147px] w-[280px]" data-name="AI bubble 1" />
      <div className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[0] left-[29px] not-italic text-[12px] text-white top-[157px] w-[250px]">
        <p className="leading-[normal] mb-0">{`I noticed you've been reflecting`}</p>
        <p className="leading-[normal] mb-0">{`on fear a lot this week. Let's`}</p>
        <p className="leading-[normal]">{`explore what's holding you back.`}</p>
      </div>
      <div className="absolute bg-[#f0ede8] border-[#1a1a1a] border-[1.5px] border-solid h-[44px] left-[97px] rounded-[16px] top-[239px] w-[270px]" data-name="User bubble 1" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[111px] not-italic text-[#1a1a1a] text-[12px] top-[250px] w-[235px]">{`I want to change careers but I'm scared.`}</p>
      <div className="absolute bg-[#1a1a1a] h-[88px] left-[17px] rounded-[16px] top-[299px] w-[300px]" data-name="AI bubble 2" />
      <div className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[0] left-[29px] not-italic text-[12px] text-white top-[309px] w-[270px]">
        <p className="leading-[normal] mb-0">{`That's a big step. Let's break it down.`}</p>
        <p className="leading-[normal] mb-0">{`What's your dream career? Let's map`}</p>
        <p className="leading-[normal] mb-0">out 3 small actions you can take</p>
        <p className="leading-[normal]">this week.</p>
      </div>
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[17px] not-italic text-[#1a1a1a] text-[13px] top-[403px] whitespace-nowrap">Suggested Actions:</p>
      <div className="absolute bg-white border border-[#ccc] border-solid h-[38px] left-[17px] rounded-[8px] top-[423px] w-[350px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[29px] not-italic text-[#333] text-[12px] top-[433px] w-[310px] whitespace-pre-wrap">{`☐  1. Research 1 role for 15 min`}</p>
      <div className="absolute bg-white border border-[#ccc] border-solid h-[38px] left-[17px] rounded-[8px] top-[469px] w-[350px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[29px] not-italic text-[#333] text-[12px] top-[479px] w-[310px] whitespace-pre-wrap">{`☐  2. Message 1 person in that field`}</p>
      <div className="absolute bg-white border border-[#ccc] border-solid h-[38px] left-[17px] rounded-[8px] top-[515px] w-[350px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular','Noto_Sans_Symbols2:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[29px] not-italic text-[#333] text-[12px] top-[525px] w-[310px] whitespace-pre-wrap">{`☐  3. Write what excites you about it`}</p>
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[17px] not-italic text-[#1a1a1a] text-[12px] top-[567px] whitespace-nowrap">Dive deeper:</p>
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[30px] left-[17px] rounded-[15px] top-[587px] w-[92px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[27px] not-italic text-[#333] text-[12px] top-[596px] whitespace-nowrap">Goal Map</p>
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[30px] left-[119px] rounded-[15px] top-[587px] w-[128px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[129px] not-italic text-[#333] text-[12px] top-[596px] whitespace-nowrap">Values Check</p>
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[30px] left-[257px] rounded-[15px] top-[587px] w-[110px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[267px] not-italic text-[#333] text-[12px] top-[596px] whitespace-nowrap">Fear Audit</p>
      <div className="absolute bg-white border-[#ccc] border-[1.5px] border-solid h-[48px] left-[17px] rounded-[24px] top-[629px] w-[310px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[35px] not-italic text-[#aaa] text-[13px] top-[646px] whitespace-nowrap">Ask anything...</p>
      <div className="absolute bg-[#1a1a1a] left-[333px] rounded-[24px] size-[48px] top-[629px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[351px] not-italic text-[18px] text-white top-[645px] whitespace-nowrap">↑</p>
    </div>
  );
}