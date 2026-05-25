import { motion } from 'motion/react';
import { Starfield } from './CosmicElements';

export default function ConstellationDetailScreen({ constellation, onBack }: any) {
  return (
    <div
      className="bg-[#08080f] relative rounded-[36px] size-full overflow-y-auto"
      style={{ scrollbarWidth: 'none' }}
    >
      <Starfield density={60} />

      {/* Status bar overlay — stays visually on top of content */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent pointer-events-none" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10 pointer-events-none">9:41</p>

      {/* ── Normal-flow content (creates scrollable height) ─────────────── */}
      <div className="relative z-[1] pt-[44px] pb-[40px]">

        {/* Back button */}
        <div className="px-[17px] pt-[11px] pb-[4px]">
          <motion.button
            className="text-[#d4af78] text-[28px]"
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
          >
            ←
          </motion.button>
        </div>

        {/* Constellation visualization */}
        <div className="px-[17px]" style={{ height: 280 }}>
          <svg className="w-full h-full">
            {constellation.stars.map((star: any, i: number) => (
              <g key={i}>
                <motion.circle
                  cx={star.x}
                  cy={star.y}
                  r={star.size}
                  fill="#d4af78"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(212, 175, 120, 0.6))' }}
                />
                {i > 0 && (
                  <motion.line
                    x1={constellation.stars[i - 1].x}
                    y1={constellation.stars[i - 1].y}
                    x2={star.x}
                    y2={star.y}
                    stroke="#d4af78"
                    strokeWidth="1.5"
                    opacity="0.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                  />
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Constellation name + meta */}
        <div className="px-[17px] text-center mt-[10px] mb-[20px]">
          <p className="font-bold text-[#d4af78] text-[28px] mb-[8px]">
            {constellation.name} ✦
          </p>
          <p className="text-[#888888] text-[12px]">
            Unlocked {constellation.unlockDate} · {constellation.entryCount} entries · {constellation.category}
          </p>
        </div>

        {/* Entry cards — horizontal scroll, no scrollbar */}
        <div
          className="flex gap-[12px] pb-[12px] pl-[17px]"
          style={{ overflowX: 'scroll', scrollbarWidth: 'none' }}
        >
          {constellation.entries.map((entry: any, i: number) => (
            <motion.div
              key={i}
              className="bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[14px] py-[12px] min-w-[220px] shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-[#888888] text-[10px] mb-[6px]">{entry.date}</p>
              <p className="text-[#f0e6cc] text-[13px] mb-[8px] line-clamp-2">{entry.excerpt}</p>
              <span className="text-[14px]">{entry.emoji}</span>
            </motion.div>
          ))}
          {/* Trailing spacer so last card clears the edge */}
          <div className="w-[17px] shrink-0" />
        </div>

        {/* AI Insight */}
        <div className="px-[17px] mt-[16px]">
          <p className="font-bold text-[#f0e6cc] text-[14px] mb-[12px]">
            What this constellation means
          </p>
          <div className="bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[16px] py-[14px]">
            <p className="text-[#c4a0e0] text-[13px] leading-relaxed">
              {constellation.insight}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-[17px] mt-[20px] flex flex-col gap-[12px]">
          <button className="bg-transparent border border-[#333333] h-[44px] rounded-[12px] text-[#888888] text-[14px] font-medium">
            Share your constellation
          </button>
          <button className="bg-[#d4af78] h-[48px] rounded-[12px] text-[#08080f] text-[14px] font-bold">
            Add another star
          </button>
        </div>

      </div>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
