import { useState, useCallback, useEffect } from 'react';
import { useMousePosition } from './hooks/useMousePosition';
import { AGENTS } from './data/agents';
import Dock from './components/Dock/Dock';
import PromptPanel from './components/PromptPanel/PromptPanel';
import './App.css';

// Tauri API for click-through
let tauriWindow: typeof import('@tauri-apps/api/window') | null = null;
if (typeof window !== 'undefined' && '__TAURI__' in window) {
  import('@tauri-apps/api/window').then((mod) => {
    tauriWindow = mod;
  });
}

function App() {
  const { x: mouseX, y: mouseY } = useMousePosition();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isOverInteractive, setIsOverInteractive] = useState(false);

  const selectedAgent = selectedAgentId
    ? AGENTS.find((a) => a.id === selectedAgentId) ?? null
    : null;

  const handleAgentClick = useCallback((agentId: string) => {
    setSelectedAgentId((prev) => (prev === agentId ? null : agentId));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedAgentId(null);
  }, []);

  // Toggle click-through: ignore cursor on empty areas, capture on interactive elements
  useEffect(() => {
    if (!tauriWindow) return;
    const win = tauriWindow.getCurrentWindow();
    win.setIgnoreCursorEvents(!isOverInteractive).catch(() => {});
  }, [isOverInteractive]);

  // Track whether mouse is over an interactive element
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        '.dock-container, .dock-shelf, .prompt-panel, .agent-tooltip'
      );
      setIsOverInteractive(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Agent Dock</h1>
        <p>
          AI 에이전트들이 당신을 기다리고 있습니다.
          <br />
          아래 캐릭터를 클릭하여 대화를 시작하세요.
        </p>
      </header>

      <PromptPanel agent={selectedAgent} onClose={handleClose} />

      <span className="app-hint">
        {selectedAgentId ? 'ESC를 눌러 닫기' : '캐릭터를 클릭하세요'}
      </span>

      <Dock
        mouseX={mouseX}
        mouseY={mouseY}
        activeAgentId={selectedAgentId}
        onAgentClick={handleAgentClick}
      />
    </div>
  );
}

export default App;
