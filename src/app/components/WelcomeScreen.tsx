import React from 'react';
import { motion } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';
import svgPaths from '../../imports/svg-enakyo375k';

// Shared SVG constellation paths component
function ConstellationSVG({ className }: { className: string }) {
  return (
    <motion.svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 572 513"
      fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 1.5 }}
    >
      <motion.path
        d={svgPaths.p128b0880}
        stroke="#D4AF78"
        strokeWidth="0.583333"
        strokeDasharray="0.58 0.58"
        fill="none"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
      />
      <motion.path d={svgPaths.p1268030} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.1, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.pc875900} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.2, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.p3378f330} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.3, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.p2167db00} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.4, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.pb2ea300} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.5, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.p22eb9400} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.6, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.p2ef4dc00} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.7, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.p1581b300} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.8, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.pab1e800} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.9, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.p3e010000} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.0, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.pee1c000} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.1, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.p652bc00} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.2, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
      <motion.path d={svgPaths.p1c019680} fill="#D4AF78" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.3, duration: 0.4 }} style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.8))' }} />
    </motion.svg>
  );
}

function BecomingLogo() {
  return (
    <svg
      width="200"
      height="129"
      viewBox="0 0 488 314"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0 0 20px rgba(240, 230, 204, 0.5)) drop-shadow(0 0 40px rgba(240, 230, 204, 0.3))'
      }}
    >
      <path d="M242.09 0.0282706C251.716 -0.221211 261.316 1.18205 270.471 4.17714C291.599 11.0188 309.178 25.9132 319.395 45.6303C322.259 44.1405 338.096 36.4798 332.546 31.1243C329.795 28.4692 320.522 29.0097 316.531 29.3013C315.449 27.8533 310.43 22.4672 310.849 21.1414C312.844 20.1411 319.037 19.7538 321.432 19.6489C331.882 19.1913 344.244 18.4256 353.658 23.7421C355.695 24.8917 357.604 27.1932 358.01 29.4762C358.601 32.4099 357.238 35.5454 355.633 37.9264C349.134 47.5765 333.245 56.3156 322.057 58.4713C306.958 61.3816 288.176 56.7327 276.188 47.0312C273.437 44.8042 269.849 39.5366 268.084 38.3613L267.668 38.5188C267.265 39.3608 267.681 42.33 267.762 43.4409C269.203 62.8322 254.535 77.2485 239.399 86.9111C211.969 103.882 166.403 115.08 134.159 111.335C107.848 108.279 121.429 89.4627 134.857 80.878C137.634 79.1021 151.026 69.2968 153.751 69.7217C154.295 71.2848 153.519 77.5898 153.129 79.2996L153.064 79.5749C149.839 81.7965 136.322 90.3202 142.972 95.1137C146.947 97.979 155.302 97.6226 160.174 96.8532C159.884 94.1076 159.604 91.3014 159.499 88.5435C158.526 66.0156 166.547 44.0249 181.793 27.4116C197.97 10.0339 218.436 0.859876 242.09 0.0282706Z" fill="#F0E6CC"/>
      <path d="M326.043 63.4512C326.187 63.5913 326.43 63.811 326.482 64.0152C330.339 79.2218 329.863 95.7951 325.127 110.627C318.43 131.707 303.613 149.251 283.953 159.384C261.219 171.05 219.806 175.062 206.093 148.008C198.423 131.749 205.504 115.293 219.446 105.415C232.906 95.8785 248.999 93.0409 265.113 95.8744C276.672 97.9068 288.009 102.916 294.138 113.484C294.528 114.144 295.035 114.551 295.783 114.676C296.393 113.074 295.336 107.39 295.422 105.158C296.178 85.7259 309.779 71.8786 326.043 63.4512Z" fill="#F0E6CC"/>
      <path d="M40.7148 216.628C52.3629 218.338 61.0188 228.383 60.9119 240.138C60.9119 253.71 51.4011 267.495 31.3109 267.495C29.0667 267.495 23.1893 267.495 21.2657 267.495C21.2657 267.495 21.2657 262.473 21.2657 260.442C21.2657 264.823 16.5638 268.35 10.7932 268.35H0.427452C6.30492 268.35 8.12159 264.717 8.12159 260.335V201.774C8.12159 197.286 6.30492 193.76 0.427452 193.76H10.7932C16.5638 193.76 21.2657 197.286 21.2657 201.774V259.587C21.2657 264.396 23.7236 266.64 26.9295 266.64C33.9824 266.64 45.0962 256.274 45.0962 240.138C45.0962 229.559 40.3942 221.651 30.9903 221.651C28.2118 221.651 25.0059 222.399 21.3726 223.895C21.2657 223.895 21.3726 223.681 21.3726 223.681C23.0824 221.758 25.2197 220.155 27.4638 218.872C32.9138 217.056 36.8677 211.392 37.1883 205.728C37.1883 200.385 34.0893 196.431 27.7844 196.431C25.8609 196.431 23.8305 196.752 21.3726 197.5C21.2657 197.607 21.3726 197.393 21.3726 197.393C24.4716 194.828 28.3187 193.76 32.1658 193.76C39.9668 193.76 47.6609 198.568 47.6609 205.728C47.554 210.43 44.8825 214.598 40.7148 216.628ZM98.506 266.854C103.635 265.678 106.734 258.839 106.948 250.183L115.818 255.099C111.009 263.327 102.139 268.35 92.6285 268.35C81.3011 268.35 70.9353 260.976 67.6226 249.756C63.5618 236.505 70.5079 222.399 83.5452 217.483C86.5373 216.415 89.6364 215.88 92.6285 215.88C102.674 215.88 112.291 221.651 116.673 231.375L116.886 231.803L81.8354 251.466C85.5756 261.618 92.4148 268.243 98.506 266.854ZM80.0187 245.695C80.4461 247.405 80.8736 249.008 81.5148 250.611L105.132 237.36C101.712 225.391 94.0177 217.163 87.3922 218.659C80.2324 220.262 77.0265 232.444 80.0187 245.695ZM154.651 266.854C159.78 265.678 162.879 258.839 163.093 250.183L171.963 255.099C167.154 263.327 158.284 268.35 148.773 268.35C137.446 268.35 127.08 260.976 123.767 249.649C119.707 236.398 126.653 222.292 139.69 217.483C142.682 216.415 145.781 215.88 148.773 215.88C158.818 215.88 168.436 221.651 172.818 231.375L161.383 237.787C157.964 225.605 150.269 217.163 143.537 218.659C136.377 220.262 133.171 232.444 136.164 245.695C139.263 259.053 147.491 268.457 154.651 266.854ZM322.47 260.335C322.47 264.823 324.394 268.35 330.164 268.35H319.798C314.028 268.35 309.326 264.823 309.326 260.442V233.299C309.326 227.421 306.227 225.07 302.38 225.07C295.541 225.07 286.137 232.444 286.137 240.993V260.335C286.137 264.717 287.953 268.35 293.831 268.35H283.465C277.694 268.35 272.992 264.823 272.992 260.442V233.299C272.992 227.421 269.893 225.07 266.046 225.07C260.917 225.07 254.291 229.238 251.406 234.902C251.085 235.543 250.765 236.291 250.444 237.039C250.017 238.321 249.803 239.604 249.803 240.993V260.335C249.803 264.717 251.62 268.35 257.497 268.35H247.132C241.361 268.35 236.659 264.823 236.552 260.442V256.595C229.072 264.075 218.92 268.243 208.34 268.35C208.02 268.35 207.699 268.243 207.379 268.243C207.379 268.35 207.379 268.35 207.272 268.35H205.241C191.67 268.457 180.342 258.305 178.846 244.947C177.243 231.482 186.113 219.086 199.364 216.201C201.287 215.773 203.211 215.56 205.028 215.56C216.141 215.56 226.4 222.613 230.033 233.513C234.308 246.336 228.324 260.335 216.034 265.892C214.431 266.213 212.935 266.426 211.332 266.64C217.958 264.396 220.95 252.641 217.958 239.818C214.966 226.46 206.63 217.056 199.578 218.659C192.525 220.262 189.212 232.444 192.311 245.695C194.769 256.702 202.356 267.495 207.913 267.495C228.217 267.495 243.712 252.214 250.658 234.154C250.872 233.833 250.979 233.619 251.085 233.299C255.36 223.574 265.191 217.163 273.42 217.163C280.366 217.163 286.137 221.865 286.137 233.299V240.138C286.137 226.46 298.533 217.163 308.792 217.163C316.165 217.163 322.47 221.971 322.47 233.299V260.335ZM236.552 225.177C236.552 220.796 234.735 217.163 228.858 217.163H239.224C244.994 217.163 249.803 220.796 249.803 225.177V234.581C246.704 242.062 242.216 248.794 236.552 254.458V225.177ZM211.546 241.207C207.806 242.489 206.417 247.619 207.272 251.893C206.203 247.619 202.677 243.665 198.723 244.199C202.463 243.023 203.959 237.894 203.104 233.619C204.173 237.787 207.699 241.848 211.546 241.207ZM341.761 210.751C341.868 206.797 339.09 203.377 335.243 202.629C339.09 201.988 341.868 198.568 341.761 194.614C341.654 198.568 344.433 201.988 348.28 202.629C344.433 203.377 341.654 206.797 341.761 210.751ZM348.387 260.335C348.387 264.717 350.203 268.35 355.974 268.35H345.715C339.945 268.35 335.243 264.823 335.136 260.442V225.177C335.136 220.689 333.319 217.163 327.442 217.163H337.807C343.578 217.163 348.387 220.689 348.387 225.177V260.335ZM410.914 260.335C410.914 264.717 412.731 268.35 418.608 268.35H408.243C402.472 268.35 397.77 264.823 397.663 260.442V233.299C397.663 227.421 394.564 225.07 390.717 225.07C383.878 225.07 374.474 232.444 374.474 240.993V260.335C374.474 264.717 376.397 268.35 382.168 268.35H371.909C366.139 268.35 361.437 264.823 361.33 260.442V225.177C361.33 220.689 359.513 217.163 353.636 217.163H364.001C369.772 217.163 374.581 220.689 374.581 225.177V240.138C374.581 226.46 386.977 217.163 397.236 217.163C404.609 217.163 410.914 221.971 410.914 233.299V260.335ZM461.881 270.38C480.262 270.38 487.101 295.493 465.194 308.958C460.599 311.736 453.76 313.232 446.813 313.232C434.417 313.232 421.701 308.53 421.273 298.699C421.059 292.822 423.838 287.265 428.647 283.952C420.953 282.456 421.701 276.044 424.052 271.663C425.761 268.777 427.792 265.999 430.036 263.541L430.57 262.793C426.082 259.267 422.876 254.244 421.594 248.687C418.495 234.688 427.471 220.903 441.47 217.804C443.501 217.376 445.424 217.163 447.455 217.163C453.118 217.163 458.675 218.872 463.27 222.292L464.018 221.437L467.438 213.957H475.56L464.873 221.758L464.018 222.826C468.507 226.353 471.606 231.269 472.888 236.825C475.88 250.824 467.011 264.61 453.012 267.709C450.981 268.136 449.058 268.35 447.027 268.35C441.363 268.35 435.913 266.64 431.318 263.327C429.288 265.785 423.838 273.052 434.631 272.945C444.035 272.945 447.989 270.38 461.881 270.38ZM434.311 245.695C435.059 248.794 436.02 251.679 437.303 254.458L456.752 230.414C452.798 222.399 446.92 217.483 441.577 218.659C434.524 220.368 431.211 232.444 434.311 245.695ZM460.064 239.818C459.316 236.932 458.355 234.047 457.179 231.375L437.73 255.313C441.684 263.221 447.562 268.029 452.691 266.854C459.851 265.251 463.057 253.069 460.064 239.818ZM436.341 310.775V310.668C438.371 310.988 442.005 311.416 446.065 311.416C456.645 311.416 470.43 308.317 468.934 290.791C468.4 284.059 464.339 282.242 458.568 282.242C450.874 282.242 440.081 285.341 429.929 284.273C424.479 287.478 421.487 293.677 422.342 299.981C423.838 306.607 431.105 310.027 436.341 310.775Z" fill="#F0E6CC"/>
    </svg>
  );
}

export default function WelcomeScreen({ onNavigate, isDesktop }: any) {
  // ── Desktop layout ─────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="bg-[#08080f] overflow-hidden relative size-full">
        <Starfield density={80} />
        <NebulaGlow color="gold" className="w-[400px] h-[400px] left-1/2 -translate-x-1/2 top-[180px]" />

        <motion.p
          className="absolute font-bold left-1/2 -translate-x-1/2 text-[#888888] text-[11px] tracking-[0.15em] top-[133px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
        >
          IF TOMORROW ENDS
        </motion.p>

        <ConstellationSVG className="absolute left-1/2 -translate-x-1/2 top-[-58px]" />

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-[439px]"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }}
        >
          <BecomingLogo />
        </motion.div>

        <motion.p
          className="absolute left-1/2 -translate-x-1/2 top-[594px] text-[14px] italic text-[#888888] text-center w-[300px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
        >
          what would you regret not doing today?
        </motion.p>

        <motion.button
          className="absolute left-1/2 -translate-x-1/2 top-[650px] bg-[#d4af78] h-[54px] w-[280px] rounded-[27px] cursor-pointer"
          style={{ boxShadow: '0 0 24px rgba(212, 175, 120, 0.3)' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 0.8 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(212, 175, 120, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('signup')}
        >
          <p className="font-bold text-[#08080f] text-[16px]">Begin Becoming</p>
        </motion.button>

        <motion.button
          className="absolute left-1/2 -translate-x-1/2 top-[727px] cursor-pointer whitespace-nowrap font-normal text-[#9898a8] text-[12px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5, duration: 1 }}
          onClick={() => onNavigate('login')}
        >
          Already have an account?{' '}<span className="text-[#888888]">Sign in →</span>
        </motion.button>
      </div>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────
  return (
    <div className="bg-[#08080f] overflow-hidden relative size-full flex flex-col items-center">
      {/* Background layers */}
      <Starfield density={80} />
      <NebulaGlow color="gold" className="w-[300px] h-[300px] left-1/2 -translate-x-1/2 top-[5vh]" />

      {/* ── Eyebrow ── */}
      <motion.p
        className="relative z-[1] font-bold text-[#888888] text-[11px] tracking-[0.15em] whitespace-nowrap"
        style={{ marginTop: '13vh' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        IF TOMORROW ENDS
      </motion.p>

      {/* ── Constellation — fills a vh-based container so it scales on any phone ── */}
      <div className="relative z-[1] w-full shrink-0" style={{ height: '40vh' }}>
        <ConstellationSVG className="absolute inset-0 w-full h-full" />
      </div>

      {/* ── Logo ── */}
      <motion.div
        className="relative z-[1] shrink-0"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <BecomingLogo />
      </motion.div>

      {/* ── Tagline ── */}
      <motion.p
        className="relative z-[1] text-[14px] italic text-[#888888] text-center px-[32px] mt-[10px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        what would you regret not doing today?
      </motion.p>

      {/* Spacer — pushes buttons toward bottom */}
      <div className="flex-1" />

      {/* ── CTA button ── */}
      <motion.button
        className="relative z-[1] bg-[#d4af78] h-[54px] w-full max-w-[320px] rounded-[27px] cursor-pointer mx-[24px]"
        style={{ boxShadow: '0 0 24px rgba(212, 175, 120, 0.3)' }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.7 }}
        whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(212, 175, 120, 0.5)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('signup')}
      >
        <p className="font-bold text-[#08080f] text-[16px]">Begin Becoming</p>
      </motion.button>

      {/* ── Sign in link ── */}
      <motion.button
        className="relative z-[1] cursor-pointer font-normal text-[#9898a8] text-[13px] mt-[12px] mb-[48px]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.8 }}
        onClick={() => onNavigate('login')}
      >
        Already have an account?{' '}<span className="text-[#d4af78]">Sign in →</span>
      </motion.button>
    </div>
  );
}
