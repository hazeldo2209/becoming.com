import { motion } from 'motion/react';
import { Starfield } from './CosmicElements';

export default function EmotionalWeatherScreen({ onBack, onNavigate }: any) {
  const emotions = [
    { name: 'Anxious', percent: 34, color: '#c4a0e0', angle: 0 },
    { name: 'Hopeful', percent: 28, color: '#d4af78', angle: 122 },
    { name: 'Tired', percent: 22, color: '#88aac8', angle: 223 },
    { name: 'Grateful', percent: 16, color: '#88c8a8', angle: 302 }
  ];

  return (
    <div className="bg-[#08080f] overflow-y-auto relative rounded-[36px] size-full">
      <Starfield density={50} />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>

      {/* Back button */}
      <motion.button
        className="absolute left-[17px] top-[55px] z-10 text-[#d4af78] text-[28px]"
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
      >
        ←
      </motion.button>

      {/* Header */}
      <div className="absolute left-[17px] right-[17px] top-[110px]">
        <p className="font-bold text-[#f0e6cc] text-[22px] text-center mb-[4px]">
          How the world feels today
        </p>
        <p className="text-[#888888] text-[12px] text-center">April 9, 2026</p>
      </div>

      {/* Emotional orb with animated blending gradients */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[200px] w-[260px] h-[260px]">
        {/* Background base */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#1a1a1a]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Animated gradient blobs */}
        <div className="absolute inset-0 rounded-full overflow-hidden" style={{ filter: 'blur(40px)' }}>
          {/* Anxious - Purple blob */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '164px',
              height: '164px',
              background: 'radial-gradient(circle, rgba(196, 160, 224, 0.9) 0%, rgba(196, 160, 224, 0.4) 50%, transparent 100%)'
            }}
            animate={{
              x: [65, 85, 55, 65],
              y: [47, 67, 57, 47],
              scale: [1, 1.2, 0.9, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Hopeful - Gold blob */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '140px',
              height: '140px',
              background: 'radial-gradient(circle, rgba(212, 175, 120, 0.9) 0%, rgba(212, 175, 120, 0.4) 50%, transparent 100%)'
            }}
            animate={{
              x: [129, 149, 119, 129],
              y: [71, 51, 81, 71],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Tired - Blue blob */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '121px',
              height: '121px',
              background: 'radial-gradient(circle, rgba(136, 170, 200, 0.9) 0%, rgba(136, 170, 200, 0.4) 50%, transparent 100%)'
            }}
            animate={{
              x: [88, 68, 98, 88],
              y: [143, 163, 153, 143],
              scale: [1, 1.1, 0.95, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Grateful - Mint blob */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '124px',
              height: '124px',
              background: 'radial-gradient(circle, rgba(136, 200, 168, 0.9) 0%, rgba(136, 200, 168, 0.4) 50%, transparent 100%)'
            }}
            animate={{
              x: [134, 154, 124, 134],
              y: [104, 114, 94, 104],
              scale: [1, 0.95, 1.15, 1]
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-[#333333] opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* Legend - positioned exactly like Figma */}
      <div className="absolute left-[17px] right-[17px] top-[482px]">
        <motion.div
          className="flex items-center gap-[8px] absolute left-[60.5px] top-0"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div className="size-[10px] rounded-full bg-[#c4a0e0]" />
          <p className="text-[#f0e6cc] text-[12px] font-medium">Anxious</p>
          <p className="text-[#888888] text-[12px]">34%</p>
        </motion.div>

        <motion.div
          className="flex items-center gap-[8px] absolute left-[208.84px] top-0"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="size-[10px] rounded-full bg-[#d4af78]" />
          <p className="text-[#f0e6cc] text-[12px] font-medium">Hopeful</p>
          <p className="text-[#888888] text-[12px]">28%</p>
        </motion.div>

        <motion.div
          className="flex items-center gap-[8px] absolute left-[60.5px] top-[30px]"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <div className="size-[10px] rounded-full bg-[#88aac8]" />
          <p className="text-[#f0e6cc] text-[12px] font-medium">Tired</p>
          <p className="text-[#888888] text-[12px]">22%</p>
        </motion.div>

        <motion.div
          className="flex items-center gap-[8px] absolute left-[208.84px] top-[30px]"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <div className="size-[10px] rounded-full bg-[#88c8a8]" />
          <p className="text-[#f0e6cc] text-[12px] font-medium">Grateful</p>
          <p className="text-[#888888] text-[12px]">16%</p>
        </motion.div>
      </div>

      {/* Delta comparison */}
      <motion.div
        className="absolute left-[17px] right-[17px] top-[541px] bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[17px] py-[13px]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-[#888888] text-[11px] mb-[8px]">Compared to yesterday</p>
        <div className="flex gap-[16px]">
          <div className="flex items-center gap-[6px]">
            <span className="text-[#88c8a8] text-[16px]">↑</span>
            <p className="text-[#f0e6cc] text-[12px]">Hope +6%</p>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="text-[#c4a0e0] text-[16px]">↓</span>
            <p className="text-[#f0e6cc] text-[12px]">Anxiety -3%</p>
          </div>
        </div>
      </motion.div>

      {/* Message card */}
      <motion.div
        className="absolute left-[17px] right-[17px] top-[632px] bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[19px] py-[17px]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.7 }}
      >
        <p className="text-[#f0e6cc] text-[14px] leading-[22.75px] text-center mb-[6px]">
          More people feel hopeful today than any day this week. You are not alone in whatever you're carrying.
        </p>
        <motion.button
          className="text-[#d4af78] text-[13px] underline mx-auto block"
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('sharedReflections')}
        >
          See what people are saying →
        </motion.button>
      </motion.div>

      {/* Footnote */}
      <p className="absolute left-1/2 -translate-x-1/2 top-[775px] text-[#555555] text-[10px]">
        Based on 8,432 anonymous check-ins today
      </p>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
