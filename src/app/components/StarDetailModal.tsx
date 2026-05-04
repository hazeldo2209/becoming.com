import { motion } from 'motion/react';

export default function StarDetailModal({ star, onClose }: any) {
  if (!star) return null;

  const categoryColors: any = {
    'Career': '#d4af78',
    'Creativity': '#c4a0e0',
    'Connection': '#88c8a8',
    'Health': '#88aac8'
  };

  const moodEmojis: any = {
    'Heavy': '😔',
    'Anxious': '😰',
    'Neutral': '😐',
    'Okay': '🙂',
    'Good': '😊',
    'Grateful': '✨'
  };

  return (
    <>
      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-[#08080f] z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.92 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal content */}
      <motion.div
        className="absolute left-0 right-0 bottom-0 bg-[#0b0a18] border-t border-[#333333] rounded-t-[24px] z-50 px-[24px] pt-[12px] pb-[36px]"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Swipe handle */}
        <div className="w-[40px] h-[4px] bg-[#333333] rounded-full mx-auto mb-[24px]" />

        {/* Header */}
        <div className="flex items-center gap-[8px] mb-[12px]">
          <div
            className="size-[8px] rounded-full"
            style={{ backgroundColor: categoryColors[star.category] }}
          />
          <p className="text-[#888888] text-[12px]">
            {star.date} · {star.category}
          </p>
          <span className="text-[16px]">{moodEmojis[star.mood]}</span>
        </div>

        {/* Prompt */}
        <p className="text-[#9898a8] text-[13px] italic mb-[16px] leading-relaxed">
          "{star.prompt}"
        </p>

        {/* Reflection text */}
        <p className="text-[#f0e6cc] text-[15px] leading-relaxed mb-[16px]">
          {star.reflection}
        </p>

        {/* Tags */}
        <div className="flex gap-[8px] mb-[20px] flex-wrap">
          {star.tags.map((tag: string, i: number) => (
            <div
              key={i}
              className="bg-[#1a1a1a] border border-[#333333] px-[10px] py-[6px] rounded-[12px]"
            >
              <p className="text-[#888888] text-[11px]">{tag}</p>
            </div>
          ))}
        </div>

        {/* Emotion scale */}
        <div className="mb-[24px]">
          <p className="text-[#888888] text-[11px] mb-[8px]">How you felt</p>
          <div className="flex items-center gap-[8px]">
            {['Heavy', 'Anxious', 'Neutral', 'Okay', 'Good', 'Grateful'].map((mood) => (
              <div
                key={mood}
                className={`size-[8px] rounded-full ${
                  star.mood === mood ? 'bg-[#d4af78]' : 'bg-[#333333]'
                }`}
                style={{
                  boxShadow: star.mood === mood ? '0 0 12px rgba(212, 175, 120, 0.6)' : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[12px] mb-[16px]">
          <button className="flex-1 bg-transparent border border-[#d4af78] h-[44px] rounded-[12px] text-[#d4af78] text-[14px] font-medium">
            ✦ Add to Constellation
          </button>
          <button className="flex-1 bg-transparent border border-[#333333] h-[44px] rounded-[12px] text-[#888888] text-[14px] font-medium">
            Share Anonymously
          </button>
        </div>

        {/* Timestamp */}
        <p className="text-[#8888a0] text-[11px] text-center">
          You wrote this {star.daysAgo} days ago
        </p>
      </motion.div>
    </>
  );
}
