import { useMotionValue } from 'framer-motion';
import { AGENTS } from '../../data/agents';
import DockItem from './DockItem';
import './Dock.css';

interface DockProps {
  mouseX: number;
  mouseY: number;
  activeAgentId: string | null;
  onAgentClick: (agentId: string) => void;
}

export default function Dock({
  mouseX,
  mouseY,
  activeAgentId,
  onAgentClick,
}: DockProps) {
  const motionMouseX = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    motionMouseX.set(e.clientX);
  };

  const handleMouseLeave = () => {
    motionMouseX.set(Infinity);
  };

  return (
    <>
      {/* Shelf surface behind characters */}
      <div className="dock-shelf">
        <div className="dock-shelf-surface" />
      </div>

      {/* Characters sitting on the shelf */}
      <div
        className="dock-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {AGENTS.map((agent) => (
          <DockItem
            key={agent.id}
            agent={agent}
            mouseX={motionMouseX}
            mouseY={mouseY}
            globalMouseX={mouseX}
            globalMouseY={mouseY}
            isActive={activeAgentId === agent.id}
            onClick={() => onAgentClick(agent.id)}
          />
        ))}
      </div>
    </>
  );
}
