export interface Agent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  eyeColor: string;
  bodyColor: string;
}

export const AGENTS: Agent[] = [
  {
    id: 'coder',
    name: 'Coder',
    emoji: '💻',
    color: '#3b82f6',
    description: '코드를 작성합니다',
    eyeColor: '#60a5fa',
    bodyColor: '#3b82f6',
  },
  {
    id: 'designer',
    name: 'Designer',
    emoji: '🎨',
    color: '#ec4899',
    description: '디자인을 담당합니다',
    eyeColor: '#f472b6',
    bodyColor: '#ec4899',
  },
  {
    id: 'analyst',
    name: 'Analyst',
    emoji: '📊',
    color: '#10b981',
    description: '데이터를 분석합니다',
    eyeColor: '#34d399',
    bodyColor: '#10b981',
  },
];
