import { useRef, useState } from 'react';
import {
  motion,
  useTransform,
  useSpring,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import type { Agent } from '../../data/agents';
import AgentCharacter from '../Agent/AgentCharacter';

interface DockItemProps {
  agent: Agent;
  mouseX: MotionValue<number>;
  mouseY: number;
  globalMouseX: number;
  globalMouseY: number;
  isActive: boolean;
  onClick: () => void;
}

const BASE_SIZE = 120;

export default function DockItem({
  agent,
  mouseX,
  mouseY: _mouseY,
  globalMouseX,
  globalMouseY,
  isActive,
  onClick,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return 300;
    return val - bounds.x - bounds.width / 2;
  });

  const scaleRaw = useTransform(distance, [-200, 0, 200], [1, 1.25, 1]);
  const scale = useSpring(scaleRaw, {
    mass: 0.1,
    stiffness: 170,
    damping: 12,
  });

  const size = useTransform(scale, (s: number) => s * BASE_SIZE);
  const height = useTransform(scale, (s: number) => s * BASE_SIZE * (180 / 140));

  return (
    <div
      className="dock-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover tooltip like the screenshot */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="agent-tooltip"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: -60,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 200,
            }}
          >
            <div className="agent-tooltip-name">{agent.name}</div>
            <div className="agent-tooltip-role">{agent.description}</div>
            <div className="agent-tooltip-status">
              <span className="dot" /> 업무 중
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        style={{
          width: size,
          height: height,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          originY: 1,
        }}
      >
        <motion.div style={{ scale, originY: 1 }}>
          <AgentCharacter
            agent={agent}
            mouseX={globalMouseX}
            mouseY={globalMouseY}
            size={BASE_SIZE}
            onClick={onClick}
          />
        </motion.div>
      </motion.div>
      <div className={`dock-item-indicator ${isActive ? 'active' : ''}`} />
    </div>
  );
}
