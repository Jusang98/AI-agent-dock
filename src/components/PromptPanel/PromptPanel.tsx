import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Agent } from '../../data/agents';
import './PromptPanel.css';

interface PromptPanelProps {
  agent: Agent | null;
  onClose: () => void;
}

export default function PromptPanel({ agent, onClose }: PromptPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (agent) {
      setInputValue('');
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [agent]);

  return (
    <AnimatePresence>
      {agent && (
        <motion.div
          className="prompt-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="prompt-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
          >
            <div className="prompt-header">
              <div
                className="prompt-header-icon"
                style={{ background: agent.color + '22' }}
              >
                {agent.emoji}
              </div>
              <div className="prompt-header-info">
                <h3>{agent.name}</h3>
                <p>{agent.description}</p>
              </div>
              <button className="prompt-close" onClick={onClose}>
                ✕
              </button>
            </div>

            <div className="prompt-messages">
              <div className="prompt-welcome">
                <span className="emoji">{agent.emoji}</span>
                안녕하세요! 저는 <strong style={{ color: agent.color }}>{agent.name}</strong>
                입니다.
                <br />
                {agent.description}. 무엇을 도와드릴까요?
              </div>
            </div>

            <div className="prompt-input-area">
              <input
                ref={inputRef}
                className="prompt-input"
                type="text"
                placeholder={`${agent.name}에게 메시지를 입력하세요...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim()) {
                    setInputValue('');
                  }
                }}
              />
              <button
                className="prompt-send"
                style={{ background: agent.color }}
                onClick={() => {
                  if (inputValue.trim()) {
                    setInputValue('');
                  }
                }}
              >
                전송
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
