import { motion } from 'motion/react';
import { Starfield } from './CosmicElements';

export default function YoureNotAloneScreen({ onNavigate, isDesktop }: any) {

  // ── Shared content blocks ──────────────────────────────────────────────────
  const eyebrow = (
    <motion.p
      className="font-bold text-[#888888] text-[11px] tracking-[0.15em]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 1 }}
    >
      IF TOMORROW ENDS
    </motion.p>
  );

  const headline = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 1 }}
    >
      <p className="text-[36px] font-bold text-[#f0e6cc] text-center leading-[1.2]">
        you are not<br />alone in this.
      </p>
    </motion.div>
  );

  const subtext = (
    <motion.p
      className="text-[#888888] text-[14px] text-center leading-[1.6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 1 }}
    >
      Others are sitting with the same<br />question right now.
    </motion.p>
  );

  const stats = (
    <motion.div
      className="flex items-center gap-[40px]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      <div className="flex flex-col items-center">
        <p className="text-[54px] font-bold text-[#c4a0e0] mb-1">847</p>
        <p className="text-[11px] font-bold text-[#c4a0e0] tracking-wider">FELT THIS</p>
      </div>
      <div className="h-[80px] w-[1px] bg-[#222222]" />
      <div className="flex flex-col items-center">
        <p className="text-[54px] font-bold text-[#88c8a8] mb-1">312</p>
        <p className="text-[11px] font-bold text-[#88c8a8] tracking-wider">STILL TRYING</p>
      </div>
    </motion.div>
  );

  const liveIndicator = (
    <motion.button
      className="flex items-center gap-[12px] cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onNavigate('sharedReflections')}
    >
      <div
        className="size-[8px] rounded-full bg-[#c4a0e0] shrink-0"
        style={{ boxShadow: '0 0 12px rgba(196, 160, 224, 0.6)' }}
      />
      <p className="text-[#888888] text-[12px]">
        214 people are sitting with this right now
      </p>
    </motion.button>
  );

  const reassurance = (
    <motion.div
      className="w-full rounded-[16px] px-[20px] py-[16px] flex flex-col items-center gap-[4px]"
      style={{ background: 'rgba(11,10,24,0.4)', border: '1px solid #222222' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.3, duration: 0.8 }}
    >
      <p className="text-[#888888] text-[13px] text-center leading-[1.5]">the app will wait for you.</p>
      <p className="text-[#888888] text-[13px] text-center leading-[1.5]">no notifications, no pressure.</p>
      <p className="text-[#888888] text-[13px] text-center leading-[1.5]">{`just come back when you're ready.`}</p>
    </motion.div>
  );

  const ctaButtons = (
    <motion.div
      className="w-full flex flex-col items-center gap-[10px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.6, duration: 0.6 }}
    >
      <motion.button
        className="w-full max-w-[280px] h-[52px] rounded-[26px] cursor-pointer"
        style={{ background: '#f0e6cc', boxShadow: '0 0 24px rgba(240, 230, 204, 0.2)' }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(240, 230, 204, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onNavigate('sky')}
      >
        <p className="font-bold text-[#08080f] text-[17px]">I showed up</p>
      </motion.button>

      <motion.button
        className="text-[#9898a8] text-[14px] cursor-pointer py-[4px]"
        whileTap={{ scale: 0.95 }}
        onClick={() => onNavigate('today')}
      >
        Today is heavy
      </motion.button>
    </motion.div>
  );

  // ── Desktop layout ─────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div
        className="bg-[#08080f] relative size-full overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        <Starfield density={100} />
        <div className="relative z-[1] min-h-full flex items-center justify-center py-[48px]">
          <div className="w-full max-w-[480px] px-[24px] flex flex-col items-center gap-[24px]">
            {eyebrow}
            {headline}
            {subtext}
            <div className="w-full h-[1px] bg-[#222222]" />
            {stats}
            {liveIndicator}
            {reassurance}
            {ctaButtons}
          </div>
        </div>
      </div>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────
  return (
    <div
      className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full"
    >
      <Starfield density={100} />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>
      <p className="absolute font-normal left-[317px] text-[#888888] text-[11px] top-[11px] z-10">▶ ▶▶ ▊▊</p>

      {/* All content centered via absolute anchor */}
      <div className="absolute inset-x-[17px] top-[140px] flex flex-col items-center gap-[20px]">
        {eyebrow}
        {headline}
        {subtext}
        <div className="w-full h-[1px] bg-[#222222]" />
        {stats}
        {liveIndicator}
        {reassurance}
        {ctaButtons}
      </div>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
