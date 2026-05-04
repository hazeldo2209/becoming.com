import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Starfield, NebulaGlow } from './CosmicElements';

interface Reflection {
  id: number;
  text: string;
  emotion: string;
  position: { x: number; y: number };
  delay: number;
}

const mockReflections: Reflection[] = [
  { id: 1, text: "Today I realized I'm stronger than I thought. Small steps still count.", emotion: "hopeful", position: { x: 45, y: 180 }, delay: 0.1 },
  { id: 2, text: "Struggling with change but trying to stay open to what comes next.", emotion: "uncertain", position: { x: 280, y: 140 }, delay: 0.15 },
  { id: 3, text: "Found peace in just being present. Not every day needs to be perfect.", emotion: "calm", position: { x: 150, y: 240 }, delay: 0.2 },
  { id: 4, text: "Feeling grateful for the people who see me even when I can't see myself.", emotion: "grateful", position: { x: 320, y: 250 }, delay: 0.25 },
  { id: 5, text: "Learning that it's okay to not have all the answers right now.", emotion: "accepting", position: { x: 90, y: 320 }, delay: 0.3 },
  { id: 6, text: "Today was hard but I showed up anyway. That matters.", emotion: "resilient", position: { x: 240, y: 300 }, delay: 0.35 },
  { id: 7, text: "Scared about the future but choosing to focus on today.", emotion: "anxious", position: { x: 170, y: 420 }, delay: 0.4 },
  { id: 8, text: "Finally starting to believe I deserve good things too.", emotion: "hopeful", position: { x: 60, y: 460 }, delay: 0.45 },
  { id: 9, text: "Sometimes just surviving the day is enough. And that's okay.", emotion: "tired", position: { x: 300, y: 380 }, delay: 0.5 },
  { id: 10, text: "Reminded myself that growth isn't linear. Bad days don't erase progress.", emotion: "reflective", position: { x: 200, y: 520 }, delay: 0.55 },
  { id: 11, text: "Found beauty in something small today. It helped.", emotion: "grateful", position: { x: 120, y: 580 }, delay: 0.6 },
  { id: 12, text: "Learning to trust my own voice again, even when it's quiet.", emotion: "growing", position: { x: 280, y: 500 }, delay: 0.65 },
];

function Star({ reflection, onClick }: { reflection: Reflection; onClick: () => void }) {
  return (
    <motion.button
      className="absolute cursor-pointer"
      style={{
        left: `${reflection.position.x}px`,
        top: `${reflection.position.y}px`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: reflection.delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ scale: 1.4 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      <motion.div
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 0l1.2 3.6h3.8l-3.1 2.25 1.2 3.65-3.1-2.25-3.1 2.25 1.2-3.65-3.1-2.25h3.8z"
            fill="#d4af78"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(212, 175, 120, 0.6))'
            }}
          />
        </svg>
      </motion.div>
    </motion.button>
  );
}

function ReflectionModal({ reflection, onClose }: { reflection: Reflection; onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center px-[24px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#08080f] bg-opacity-80 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        className="relative bg-[#0b0a18] border border-[#d4af78] rounded-[24px] p-[24px] max-w-[320px] w-full"
        style={{
          boxShadow: '0 0 40px rgba(212, 175, 120, 0.3)'
        }}
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-[12px] mb-[16px]">
          <p className="text-[24px]">✦</p>
          <p className="text-[#888888] text-[11px] mt-[6px]">Anonymous reflection</p>
        </div>

        <p className="text-[#f0e6cc] text-[15px] leading-[1.6] mb-[20px]">
          {reflection.text}
        </p>

        <motion.button
          className="w-full bg-[#d4af78] bg-opacity-10 border border-[#d4af78] rounded-[12px] h-[44px] flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          <p className="text-[#08080f] text-[13px] font-medium">Close</p>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function SharedReflectionsScreen({ onNavigate }: any) {
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);

  return (
    <div className="bg-[#08080f] overflow-hidden relative rounded-[36px] size-full">
      <Starfield density={40} />

      {/* Large galaxy clusters */}
      <NebulaGlow color="purple" className="w-[400px] h-[400px] left-[-50px] top-[150px]" />
      <NebulaGlow color="gold" className="w-[350px] h-[350px] right-[-60px] top-[300px]" />
      <NebulaGlow color="purple" className="w-[300px] h-[300px] left-[80px] top-[450px]" />

      {/* Status bar */}
      <div className="absolute h-[44px] left-0 top-0 w-full z-10 bg-gradient-to-b from-[#08080f] to-transparent" />
      <p className="absolute font-bold left-[13px] text-[#f0e6cc] text-[13px] top-[10px] z-10">9:41</p>
      <p className="absolute font-normal left-[317px] text-[#888888] text-[11px] top-[11px] z-10">▶ ▶▶ ▊▊</p>

      {/* Header */}
      <motion.button
        className="absolute left-[17px] top-[55px] cursor-pointer flex items-center gap-[8px] z-10"
        whileTap={{ scale: 0.95 }}
        onClick={() => onNavigate('solidarity')}
      >
        <p className="text-[#d4af78] text-[20px]">←</p>
        <p className="font-bold text-[#f0e6cc] text-[20px]">Shared Reflections</p>
      </motion.button>

      <div className="absolute h-[1px] left-[17px] right-[17px] top-[95px] bg-gradient-to-r from-transparent via-[#333333] to-transparent z-10" />

      {/* Subtitle */}
      <motion.p
        className="absolute left-[17px] right-[17px] text-center text-[#888888] text-[12px] top-[115px] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Each star is someone's reflection. Tap to read.
      </motion.p>

      {/* Galaxy of stars */}
      <div className="absolute left-0 top-[100px] bottom-[90px] w-full">
        {mockReflections.map((reflection) => (
          <Star
            key={reflection.id}
            reflection={reflection}
            onClick={() => setSelectedReflection(reflection)}
          />
        ))}
      </div>

      {/* Reflection counter */}
      <motion.div
        className="absolute left-[17px] right-[17px] bottom-[106px] bg-[#0b0a18] border border-[#333333] rounded-[12px] h-[48px] flex items-center justify-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-[#888888] text-[12px]">
          <span className="text-[#d4af78] font-bold">{mockReflections.length}</span> reflections shared today
        </p>
      </motion.div>

      {/* Home indicator */}
      <div className="absolute bg-[#333333] h-[4px] left-[142px] rounded-[2px] bottom-[8px] w-[100px] z-10" />

      {/* Modal */}
      <AnimatePresence>
        {selectedReflection && (
          <ReflectionModal
            reflection={selectedReflection}
            onClose={() => setSelectedReflection(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
