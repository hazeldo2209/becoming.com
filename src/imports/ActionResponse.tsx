import svgPaths from "./svg-96vgjg3kdh";

function Group() {
  return (
    <div className="h-[17.417px] relative shrink-0 w-[16.5px]" data-name="Group">
      <div className="absolute inset-[-5.26%_-5.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 19.2504">
          <g id="Group">
            <path d={svgPaths.p3b706200} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
            <path d={svgPaths.p629d000} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83333" />
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
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] min-w-full not-italic relative shrink-0 text-[#1a1a1a] text-[10px] text-center w-[min-content]">Today</p>
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
        <g clipPath="url(#clip0_1_583)" id="streamline:star-2-remix">
          <path d={svgPaths.p4739780} id="Vector" stroke="var(--stroke-0, #AAAAAA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.875" />
        </g>
        <defs>
          <clipPath id="clip0_1_583">
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

export default function ActionResponse() {
  return (
    <div className="bg-[#faf7f2] border-3 border-[#1a1a1a] border-solid overflow-clip relative rounded-[36px] size-full" data-name="Action Response">
      <Frame4 />
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[44px] left-[-3px] top-[-3px] w-[390px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[13px] not-italic text-[#1a1a1a] text-[13px] top-[10px] whitespace-nowrap">9:41</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[317px] not-italic text-[#1a1a1a] text-[11px] top-[11px] whitespace-pre">{`▶  ▶▶  ▊▊`}</p>
      <div className="absolute bg-[#1a1a1a] h-[4px] left-[142px] rounded-[2px] top-[817px] w-[100px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[17px] not-italic text-[#555] text-[14px] top-[55px] whitespace-pre">{`←  Back`}</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold h-[20px] leading-[normal] left-[252px] not-italic text-[#1a1a1a] text-[18px] text-center top-[53px] w-[190px]">Respond</p>
      <div className="absolute h-0 left-[-3px] top-[83px] w-[390px]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 390 1">
            <path d="M0 0.5H390" id="Vector" stroke="var(--stroke-0, #CCCCCC)" />
          </svg>
        </div>
      </div>
      <div className="absolute bg-[#f0ede8] border border-[#ccc] border-solid h-[72px] left-[17px] rounded-[10px] top-[97px] w-[350px]" data-name="Rectangle" />
      <div className="absolute font-['Inter:Medium',sans-serif] font-medium h-[20px] leading-[0] left-[29px] not-italic text-[#444] text-[13px] top-[109px] w-[306px]">
        <p className="leading-[normal] mb-0">{`"What's one thing you've been putting`}</p>
        <p className="leading-[normal]">{`off because of fear?"`}</p>
      </div>
      <div className="absolute bg-[#1a1a1a] border-[#1a1a1a] border-[1.5px] border-solid h-[34px] left-[15px] rounded-[6px] top-[185px] w-[108px]" data-name="Rectangle" />
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold h-[20px] leading-[normal] left-[69px] not-italic text-[13px] text-center text-white top-[195px] w-[88px]">Reflect</p>
      <div className="absolute bg-[#f0ede8] border-[#1a1a1a] border-[1.5px] border-solid h-[34px] left-[123px] rounded-[6px] top-[185px] w-[108px]" data-name="Rectangle" />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[177px] not-italic text-[#555] text-[13px] text-center top-[195px] w-[88px]">Action</p>
      <div className="absolute bg-[#f0ede8] border-[#1a1a1a] border-[1.5px] border-solid h-[34px] left-[231px] rounded-[6px] top-[185px] w-[108px]" data-name="Rectangle" />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[285px] not-italic text-[#555] text-[13px] text-center top-[195px] w-[88px]">Share</p>
      <div className="absolute bg-white border-2 border-[#1a1a1a] border-solid h-[200px] left-[17px] rounded-[10px] top-[233px] w-[350px]" data-name="Text input" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[normal] left-[31px] not-italic text-[#aaa] text-[13px] top-[247px] w-[290px]">Write your reflection here...</p>
      <div className="absolute h-0 left-[31px] top-[275px] w-[322px]" data-name="Vector">
        <div className="absolute inset-[-0.4px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 322 0.8">
            <path d="M0 0.4H322" id="Vector" stroke="var(--stroke-0, #E8E8E8)" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[31px] top-[297px] w-[322px]" data-name="Vector">
        <div className="absolute inset-[-0.4px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 322 0.8">
            <path d="M0 0.4H322" id="Vector" stroke="var(--stroke-0, #E8E8E8)" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[31px] top-[319px] w-[322px]" data-name="Vector">
        <div className="absolute inset-[-0.4px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 322 0.8">
            <path d="M0 0.4H322" id="Vector" stroke="var(--stroke-0, #E8E8E8)" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[31px] top-[341px] w-[322px]" data-name="Vector">
        <div className="absolute inset-[-0.4px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 322 0.8">
            <path d="M0 0.4H322" id="Vector" stroke="var(--stroke-0, #E8E8E8)" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[31px] top-[363px] w-[322px]" data-name="Vector">
        <div className="absolute inset-[-0.4px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 322 0.8">
            <path d="M0 0.4H322" id="Vector" stroke="var(--stroke-0, #E8E8E8)" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[31px] top-[385px] w-[322px]" data-name="Vector">
        <div className="absolute inset-[-0.4px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 322 0.8">
            <path d="M0 0.4H322" id="Vector" stroke="var(--stroke-0, #E8E8E8)" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[31px] top-[407px] w-[322px]" data-name="Vector">
        <div className="absolute inset-[-0.4px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 322 0.8">
            <path d="M0 0.4H322" id="Vector" stroke="var(--stroke-0, #E8E8E8)" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[297px] not-italic text-[#aaa] text-[11px] top-[423px] whitespace-nowrap">0 / 280</p>
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[17px] not-italic text-[#1a1a1a] text-[13px] top-[449px] whitespace-nowrap">Tag this moment:</p>
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[28px] left-[17px] rounded-[14px] top-[469px] w-[61px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[25px] not-italic text-[#444] text-[11px] top-[477px] whitespace-nowrap">#fear</p>
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[28px] left-[86px] rounded-[14px] top-[469px] w-[88px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[94px] not-italic text-[#444] text-[11px] top-[477px] whitespace-nowrap">#courage</p>
      <div className="absolute bg-[#f0ede8] border border-[#1a1a1a] border-solid h-[28px] left-[182px] rounded-[14px] top-[469px] w-[79px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[190px] not-italic text-[#444] text-[11px] top-[477px] whitespace-nowrap">#growth</p>
      <div className="absolute bg-white border border-[#1a1a1a] border-solid h-[28px] left-[269px] rounded-[14px] top-[469px] w-[61px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[277px] not-italic text-[#444] text-[11px] top-[477px] whitespace-nowrap">+ Add</p>
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[17px] not-italic text-[#1a1a1a] text-[13px] top-[513px] whitespace-nowrap">How do you feel?</p>
      <div className="absolute bg-[#f8f6f2] border border-[#ccc] border-solid left-[17px] rounded-[10px] size-[54px] top-[535px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[31px] not-italic text-[#1a1a1a] text-[22px] top-[549px] whitespace-nowrap">😔</p>
      <div className="absolute bg-[#f8f6f2] border border-[#ccc] border-solid left-[83px] rounded-[10px] size-[54px] top-[535px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[97px] not-italic text-[#1a1a1a] text-[22px] top-[549px] whitespace-nowrap">😐</p>
      <div className="absolute bg-[#f8f6f2] border border-[#ccc] border-solid left-[149px] rounded-[10px] size-[54px] top-[535px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[163px] not-italic text-[#1a1a1a] text-[22px] top-[549px] whitespace-nowrap">🙂</p>
      <div className="absolute bg-[#f8f6f2] border border-[#ccc] border-solid left-[215px] rounded-[10px] size-[54px] top-[535px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[229px] not-italic text-[#1a1a1a] text-[22px] top-[549px] whitespace-nowrap">😊</p>
      <div className="absolute bg-[#f8f6f2] border border-[#ccc] border-solid left-[281px] rounded-[10px] size-[54px] top-[535px]" data-name="Rectangle" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[295px] not-italic text-[#1a1a1a] text-[22px] top-[549px] whitespace-nowrap">🌟</p>
      <div className="absolute bg-[#1a1a1a] h-[54px] left-[17px] rounded-[27px] top-[607px] w-[350px]" data-name="Save Entry" />
      <p className="-translate-x-1/2 absolute font-['Inter:Bold','Noto_Sans_Symbols2:Regular',sans-serif] font-bold h-[20px] leading-[normal] left-[192px] not-italic text-[16px] text-center text-white top-[624px] w-[230px] whitespace-pre-wrap">{`Save to Your Sky  ✦`}</p>
    </div>
  );
}