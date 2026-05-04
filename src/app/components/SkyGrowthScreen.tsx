import { useState } from 'react';
import { motion } from 'motion/react';
import { Starfield } from './CosmicElements';

export default function SkyGrowthScreen({ onBack }: any) {
  const [timeRange, setTimeRange] = useState('Month');

  // Mock timeline data
  const monthData = [
    { month: 'Jan', stars: [] },
    { month: 'Feb', stars: [{ x: 80, y: -20 }, { x: 90, y: 15 }] },
    { month: 'Mar', stars: [{ x: 150, y: -30 }, { x: 160, y: 10 }, { x: 170, y: -15 }, { x: 180, y: 20 }] },
    { month: 'Apr', stars: [{ x: 240, y: -25 }, { x: 250, y: 18 }, { x: 260, y: -10 }] }
  ];

  const moodData = [
    { x: 0, y: 60 },
    { x: 25, y: 55 },
    { x: 50, y: 40 },
    { x: 75, y: 35 },
    { x: 100, y: 25 }
  ];

  return (
    <div className="bg-[#08080f] overflow-y-auto relative rounded-[36px] size-full">
      <Starfield density={40} />

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
      <div className="absolute left-[70px] top-[58px]">
        <p className="font-bold text-[#f0e6cc] text-[24px]">Your Journey</p>
      </div>

      {/* Time range tabs */}
      <div className="absolute left-[17px] top-[110px] flex gap-[24px]">
        {['Week', 'Month', 'Year'].map((range) => (
          <button
            key={range}
            className="relative"
            onClick={() => setTimeRange(range)}
          >
            <p className={`text-[14px] ${timeRange === range ? 'text-[#d4af78] font-bold' : 'text-[#8888a0] font-normal'}`}>
              {range}
            </p>
            {timeRange === range && (
              <motion.div
                className="absolute -bottom-[6px] left-0 right-0 h-[2px] bg-[#d4af78]"
                layoutId="timeRangeUnderline"
              />
            )}
          </button>
        ))}
      </div>

      <div className="absolute h-[1px] left-[17px] right-[17px] top-[142px] bg-gradient-to-r from-transparent via-[#333333] to-transparent" />

      {/* Timeline visualization */}
      <div className="absolute left-[17px] right-[17px] top-[170px] h-[180px]">
        <svg className="w-full h-full">
          {/* Timeline line */}
          <line
            x1="0"
            y1="90"
            x2="100%"
            y2="90"
            stroke="#333333"
            strokeWidth="2"
          />

          {/* Month markers and stars */}
          {monthData.map((month, i) => (
            <g key={i}>
              {/* Month label */}
              <text
                x={i * 90 + 40}
                y="105"
                fill="#666666"
                fontSize="11"
                textAnchor="middle"
              >
                {month.month}
              </text>

              {/* Stars for this month */}
              {month.stars.map((star, j) => (
                <motion.circle
                  key={j}
                  cx={star.x}
                  cy={90 + star.y}
                  r="4"
                  fill="#d4af78"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 + j * 0.05 }}
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.5))'
                  }}
                />
              ))}

              {/* Constellation lines for March (denser) */}
              {i === 2 && month.stars.length > 1 && (
                <>
                  <motion.line
                    x1={month.stars[0].x}
                    y1={90 + month.stars[0].y}
                    x2={month.stars[1].x}
                    y2={90 + month.stars[1].y}
                    stroke="#d4af78"
                    strokeWidth="1"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  />
                  <motion.line
                    x1={month.stars[1].x}
                    y1={90 + month.stars[1].y}
                    x2={month.stars[2].x}
                    y2={90 + month.stars[2].y}
                    stroke="#d4af78"
                    strokeWidth="1"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  />
                </>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Stats row */}
      <div className="absolute left-[17px] right-[17px] top-[370px] flex gap-[12px]">
        {[
          { value: '31', label: 'entries', icon: '✦' },
          { value: '5', label: 'constellations', icon: '⭐' },
          { value: '28', label: 'day streak', icon: '🔥' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[12px] py-[14px] text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <p className="text-[20px] mb-[4px]">{stat.icon}</p>
            <p className="font-bold text-[#d4af78] text-[20px] mb-[2px]">{stat.value}</p>
            <p className="text-[#888888] text-[10px]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Mood wave chart */}
      <div className="absolute left-[17px] right-[17px] top-[490px]">
        <p className="font-bold text-[#f0e6cc] text-[14px] mb-[12px]">Mood Over Time</p>
        <div className="bg-[#0b0a18] border border-[#333333] rounded-[12px] px-[16px] py-[16px] h-[120px]">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4af78" />
                <stop offset="100%" stopColor="#c4a0e0" />
              </linearGradient>
            </defs>

            <motion.path
              d={`M ${moodData.map((p, i) => `${(p.x / 100) * 310},${p.y}`).join(' L ')}`}
              stroke="url(#moodGradient)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(212, 175, 120, 0.4))'
              }}
            />

            {moodData.map((point, i) => (
              <motion.circle
                key={i}
                cx={(point.x / 100) * 310}
                cy={point.y}
                r="4"
                fill="#d4af78"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.2 }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Insight card */}
      <motion.div
        className="absolute left-[17px] right-[17px] top-[640px] bg-[#0b0a18] border-l-[3px] border-l-[#c4a0e0] border-y border-r border-[#333333] rounded-[12px] px-[16px] py-[14px]"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-[#c4a0e0] text-[13px] leading-relaxed">
          Your most reflective month was March. You wrote 12 entries about Creativity.
        </p>
      </motion.div>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px]" />
    </div>
  );
}
