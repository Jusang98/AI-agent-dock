import { useEffect, useRef, useCallback } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
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
 * Uses the agent's rive config to load .riv files with cursor tracking.
 * Tries multiple common input name patterns for maximum compatibility.
 */
export default function RiveAgent({
  agent,
  mouseX,
  mouseY,
  size = 120,
  onClick,
}: RiveAgentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rive, RiveComponent } = useRive({
    src: agent.rive.src,
    stateMachines: agent.rive.stateMachine,
    artboard: agent.rive.artboard,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  const sm = agent.rive.stateMachine;

  // Try common input name patterns
  const axisX = useStateMachineInput(rive, sm, agent.rive.axisXInput ?? 'Axis_X');
  const axisY = useStateMachineInput(rive, sm, agent.rive.axisYInput ?? 'Axis_Y');
  const lookX = useStateMachineInput(rive, sm, 'lookX');
  const lookY = useStateMachineInput(rive, sm, 'lookY');
  const cursorX = useStateMachineInput(rive, sm, 'x');
  const cursorY = useStateMachineInput(rive, sm, 'y');

  const updateInputs = useCallback(() => {
    const normX = (mouseX / window.innerWidth) * 100;
    const normY = (mouseY / window.innerHeight) * 100;

    // Set whichever inputs exist
    if (axisX) axisX.value = normX;
    if (axisY) axisY.value = normY;
    if (lookX) lookX.value = normX;
    if (lookY) lookY.value = normY;
    if (cursorX) cursorX.value = mouseX;
    if (cursorY) cursorY.value = mouseY;
  }, [mouseX, mouseY, axisX, axisY, lookX, lookY, cursorX, cursorY]);

  useEffect(() => {
    updateInputs();
  }, [updateInputs]);

  // Also try Rive's pointer tracking if the file uses it
  useEffect(() => {
    if (!rive || !containerRef.current) return;

    // Some .riv files use built-in pointer tracking
    try {
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        const event = new MouseEvent('mousemove', {
          clientX: mouseX,
          clientY: mouseY,
          bubbles: true,
        });
        canvas.dispatchEvent(event);
      }
    } catch {
      // Ignore if not supported
    }
  }, [mouseX, mouseY, rive]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={{
        width: size,
        height: size * 1.2,
        cursor: 'pointer',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <RiveComponent
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
