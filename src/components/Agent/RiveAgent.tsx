import { useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import type { Agent } from '../../data/agents';

interface RiveAgentProps {
  agent: Agent;
  mouseX: number;
  mouseY: number;
  size?: number;
  onClick?: () => void;
}

/**
 * Rive-based agent character.
 * Drop a .riv file into public/animations/{agent.id}.riv
 * The .riv file should have a state machine named "State Machine"
 * with number inputs "Axis_X" (0-100) and "Axis_Y" (0-100).
 */
export default function RiveAgent({
  agent,
  mouseX,
  mouseY,
  size = 64,
  onClick,
}: RiveAgentProps) {
  const { rive, RiveComponent } = useRive({
    src: `/animations/${agent.id}.riv`,
    stateMachines: 'State Machine',
    autoplay: true,
  });

  const axisX = useStateMachineInput(rive, 'State Machine', 'Axis_X');
  const axisY = useStateMachineInput(rive, 'State Machine', 'Axis_Y');

  useEffect(() => {
    if (axisX) {
      const normalized = (mouseX / window.innerWidth) * 100;
      axisX.value = normalized;
    }
    if (axisY) {
      const normalized = (mouseY / window.innerHeight) * 100;
      axisY.value = normalized;
    }
  }, [mouseX, mouseY, axisX, axisY]);

  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <RiveComponent />
    </div>
  );
}
