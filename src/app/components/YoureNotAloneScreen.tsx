import { motion } from 'motion/react';
import { Starfield } from './CosmicElements';

export default function YoureNotAloneScreen({ onNavigate }: any) {
  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full">
      <Starfield density={100} />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>
      <p className="absolute font-normal left-[317px] text-[#888888] text-[11px] top-[11px] z-10">▶ ▶▶ ▊▊</p>

      {/* IF TOMORROW ENDS label */}
      <motion.p
        className="absolute font-bold left-1/2 -translate-x-1/2 text-[#888888] text-[11px] tracking-[0.15em] top-[160px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        IF TOMORROW ENDS
      </motion.p>

      {/* Main message */}
      <motion.p
        className="absolute left-1/2 -translate-x-1/2 text-[36px] font-bold text-[#f0e6cc] text-center top-[200px] w-[320px] leading-[1.2]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        you are not
      </motion.p>

      <motion.p
        className="absolute left-1/2 -translate-x-1/2 text-[36px] font-bold text-[#f0e6cc] text-center top-[250px] w-[320px] leading-[1.2]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        alone in this.
      </motion.p>

      {/* Supporting text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <p className="absolute left-1/2 -translate-x-1/2 text-[#888888] text-[14px] text-center top-[315px] w-[330px]">
          Others are sitting with the same
        </p>
        <p className="absolute left-1/2 -translate-x-1/2 text-[#888888] text-[14px] text-center top-[337px] w-[330px]">
          question right now.
        </p>
      </motion.div>

      <div className="absolute h-[1px] left-[120px] right-[120px] top-[375px] bg-[#222222]" />

      {/* Stats */}
      <motion.div
        className="flex items-start justify-center gap-[40px] absolute left-1/2 -translate-x-1/2 top-[395px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        {/* Felt This */}
        <div className="flex flex-col items-center">
          <p className="text-[54px] font-bold text-[#c4a0e0] mb-1">847</p>
          <p className="text-[11px] font-bold text-[#c4a0e0] tracking-wider">FELT THIS</p>
        </div>

        {/* Divider */}
        <div className="h-[80px] w-[1px] bg-[#222222] mt-2" />

        {/* Still Trying */}
        <div className="flex flex-col items-center">
          <p className="text-[54px] font-bold text-[#88c8a8] mb-1">312</p>
          <p className="text-[11px] font-bold text-[#88c8a8] tracking-wider">STILL TRYING</p>
        </div>
      </motion.div>

      {/* Live indicator */}
      <motion.button
        className="absolute left-[47px] top-[505px] flex items-center gap-[12px] cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('sharedReflections')}
      >
        <div className="size-[8px] rounded-full bg-[#c4a0e0]" style={{ boxShadow: '0 0 12px rgba(196, 160, 224, 0.6)' }} />
        <p className="text-[#888888] text-[12px]">
          214 people are sitting with this right now
        </p>
      </motion.button>

      {/* Reassurance box */}
      <motion.div
        className="absolute bg-[#0b0a18] bg-opacity-40 border border-[#222222] h-[76px] left-[27px] rounded-[16px] top-[543px] w-[330px] flex flex-col items-center justify-center gap-[4px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3, duration: 0.8 }}
      >
        <p className="text-[#888888] text-[13px] text-center leading-[1.5]">
          the app will wait for you.
        </p>
        <p className="text-[#888888] text-[13px] text-center leading-[1.5]">
          no notifications, no pressure.
        </p>
        <p className="text-[#888888] text-[13px] text-center leading-[1.5]">
          {`just come back when you're ready.`}
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.button
        className="absolute bg-[#f0e6cc] h-[52px] left-[80px] rounded-[26px] top-[641px] w-[230px] cursor-pointer"
        style={{
          boxShadow: '0 0 24px rgba(240, 230, 204, 0.2)'
        }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(240, 230, 204, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.6 }}
        onClick={() => onNavigate('sky')}
      >
        <p className="font-bold text-[#08080f] text-[17px]">go do it</p>
      </motion.button>

      <motion.button
        className="absolute left-1/2 -translate-x-1/2 text-[#9898a8] text-[14px] top-[713px] cursor-pointer"
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.6 }}
        onClick={() => onNavigate('today')}
      >
        not today
      </motion.button>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
