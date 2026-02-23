import { useState, useCallback } from 'react';
import { useMousePosition } from './hooks/useMousePosition';
import { AGENTS } from './data/agents';
import Dock from './components/Dock/Dock';
import PromptPanel from './components/PromptPanel/PromptPanel';
import './App.css';

function App() {
  const { x: mouseX, y: mouseY } = useMousePosition();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const selectedAgent = selectedAgentId
    ? AGENTS.find((a) => a.id === selectedAgentId) ?? null
    : null;

  const handleAgentClick = useCallback((agentId: string) => {
    setSelectedAgentId((prev) => (prev === agentId ? null : agentId));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedAgentId(null);
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
