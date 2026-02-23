import { useRef, useState, useCallback } from 'react';
import type { Agent } from '../../data/agents';
import './Agent.css';

interface AgentCharacterProps {
  agent: Agent;
  mouseX: number;
  mouseY: number;
  size?: number;
  onClick?: () => void;
}

export default function AgentCharacter({
  agent,
  mouseX,
  mouseY,
  size = 120,
  onClick,
}: AgentCharacterProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const getEyeOffset = useCallback(
    (eyeCenterX: number, eyeCenterY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const absCenterX = rect.left + (eyeCenterX / 140) * rect.width;
      const absCenterY = rect.top + (eyeCenterY / 180) * rect.height;

      const angle = Math.atan2(mouseY - absCenterY, mouseX - absCenterX);
      const dist = Math.hypot(mouseX - absCenterX, mouseY - absCenterY);
      const maxOffset = 3.5;
      const offset = Math.min(maxOffset, dist * 0.015);

      return {
        x: Math.cos(angle) * offset,
        y: Math.sin(angle) * offset,
      };
    },
    [mouseX, mouseY]
  );

  const leftEye = getEyeOffset(58, 55);
  const rightEye = getEyeOffset(82, 55);

  const eyeScale = isHovered ? 1.15 : 1;
  const blushOpacity = isHovered ? 0.4 : 0;

  return (
    <div className="agent-wrapper">
      <svg
        ref={svgRef}
        className="agent-character"
        width={size}
        height={size * (180 / 140)}
        viewBox="0 0 140 180"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* === Body (torso) === */}
        <ellipse
          cx="70"
          cy="130"
          rx="35"
          ry="28"
          fill={agent.color}
          opacity={0.7}
        />
        {/* Suit/shirt collar */}
        <path
          d="M 50 115 Q 70 125 90 115 Q 95 130 90 145 Q 70 150 50 145 Q 45 130 50 115"
          fill={agent.color}
          opacity={0.85}
        />

        {/* === Head === */}
        <circle
          cx="70"
          cy="65"
          r="38"
          fill={agent.color}
          opacity={0.15}
        />
        <circle
          cx="70"
          cy="63"
          r="36"
          fill={agent.color}
        />

        {/* Face highlight */}
        <ellipse cx="70" cy="52" rx="24" ry="18" fill="rgba(255,255,255,0.1)" />

        {/* === Left eye === */}
        <g
          transform={`translate(58, 55) scale(${eyeScale})`}
          style={{ transition: 'transform 0.2s ease' }}
        >
          <ellipse cx="0" cy="0" rx="8" ry={isHovered ? 9 : 7.5} fill="white" />
          <circle cx={leftEye.x} cy={leftEye.y} r="4" fill="#1a1a2e" />
          <circle cx={leftEye.x - 1.5} cy={leftEye.y - 1.5} r="1.5" fill="white" />
        </g>

        {/* === Right eye === */}
        <g
          transform={`translate(82, 55) scale(${eyeScale})`}
          style={{ transition: 'transform 0.2s ease' }}
        >
          <ellipse cx="0" cy="0" rx="8" ry={isHovered ? 9 : 7.5} fill="white" />
          <circle cx={rightEye.x} cy={rightEye.y} r="4" fill="#1a1a2e" />
          <circle cx={rightEye.x - 1.5} cy={rightEye.y - 1.5} r="1.5" fill="white" />
        </g>

        {/* Blush */}
        <circle cx="47" cy="68" r="5" fill="#ff6b9d" opacity={blushOpacity}
          style={{ transition: 'opacity 0.3s ease' }} />
        <circle cx="93" cy="68" r="5" fill="#ff6b9d" opacity={blushOpacity}
          style={{ transition: 'opacity 0.3s ease' }} />

        {/* Mouth */}
        <path
          d={isHovered ? 'M 62 74 Q 70 84 78 74' : 'M 64 76 Q 70 80 76 76'}
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* === Arms === */}
        {/* Left arm */}
        <path
          d="M 42 125 Q 30 140 35 155"
          fill="none"
          stroke={agent.color}
          strokeWidth="10"
          strokeLinecap="round"
          opacity={0.8}
        />
        {/* Right arm */}
        <path
          d="M 98 125 Q 110 140 105 155"
          fill="none"
          stroke={agent.color}
          strokeWidth="10"
          strokeLinecap="round"
          opacity={0.8}
        />

        {/* === Laptop === */}
        {/* Screen */}
        <rect x="30" y="148" width="80" height="6" rx="2"
          fill="rgba(180, 180, 200, 0.6)" />
        {/* Keyboard */}
        <rect x="25" y="154" width="90" height="4" rx="1.5"
          fill="rgba(140, 140, 160, 0.5)" />
        {/* Screen glow */}
        <rect x="35" y="149" width="70" height="3" rx="1"
          fill="rgba(255,255,255,0.15)" />

        {/* === Agent-specific accessories === */}
        {agent.id === 'coder' && (
          <>
            {/* Glasses */}
            <rect x="46" y="50" width="16" height="12" rx="3" fill="none"
              stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            <rect x="78" y="50" width="16" height="12" rx="3" fill="none"
              stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            <line x1="62" y1="55" x2="78" y2="55"
              stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          </>
        )}
        {agent.id === 'designer' && (
          <>
            {/* Beret */}
            <ellipse cx="70" cy="30" rx="24" ry="9" fill={agent.color} opacity={0.8} />
            <circle cx="70" cy="23" r="5" fill={agent.color} />
          </>
        )}
        {agent.id === 'analyst' && (
          <>
            {/* Monocle */}
            <circle cx="82" cy="55" r="13" fill="none"
              stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <line x1="95" y1="55" x2="103" y2="72"
              stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          </>
        )}
      </svg>
    </div>
  );
}
