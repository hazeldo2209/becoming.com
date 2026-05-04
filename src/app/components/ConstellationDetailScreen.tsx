import { motion } from 'motion/react';
import { Starfield } from './CosmicElements';

export default function ConstellationDetailScreen({ constellation, onBack }: any) {
  return (
    <div className="bg-[#08080f] overflow-y-auto relative rounded-[36px] size-full">
      <Starfield density={60} />

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

      {/* Constellation visualization */}
      <div className="absolute left-[17px] right-[17px] top-[110px] h-[300px]">
        <svg className="w-full h-full">
          {/* Constellation stars */}
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
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(212, 175, 120, 0.6))'
                }}
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

      {/* Constellation name */}
      <div className="absolute left-[17px] right-[17px] top-[450px]">
        <p className="font-bold text-[#d4af78] text-[28px] text-center mb-[8px]">
          {constellation.name} ✦
        </p>
        <p className="text-[#888888] text-[12px] text-center mb-[24px]">
          Unlocked {constellation.unlockDate} · {constellation.entryCount} entries · {constellation.category}
        </p>
      </div>

      {/* Entry cards scroll */}
      <div className="absolute left-[17px] top-[560px] right-0">
        <div className="flex gap-[12px] overflow-x-auto pb-[12px] pr-[17px]">
          {constellation.entries.map((entry: any, i: number) => (
            <motion.div
              key={i}
              className="bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[14px] py-[12px] min-w-[240px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-[#888888] text-[10px] mb-[6px]">{entry.date}</p>
              <p className="text-[#f0e6cc] text-[13px] mb-[8px] line-clamp-2">{entry.excerpt}</p>
              <span className="text-[14px]">{entry.emoji}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="absolute left-[17px] right-[17px] top-[700px]">
        <p className="font-bold text-[#f0e6cc] text-[14px] mb-[12px]">
          What this constellation means
        </p>
        <div className="bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[16px] py-[14px] mb-[16px]">
          <p className="text-[#c4a0e0] text-[13px] leading-relaxed">
            {constellation.insight}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute left-[17px] right-[17px] top-[840px] flex flex-col gap-[12px]">
        <button className="bg-transparent border border-[#333333] h-[44px] rounded-[12px] text-[#888888] text-[14px] font-medium">
          Share your constellation
        </button>
        <button className="bg-[#d4af78] h-[48px] rounded-[12px] text-[#08080f] text-[14px] font-bold">
          Add another star
        </button>
      </div>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
