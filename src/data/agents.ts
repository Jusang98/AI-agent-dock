export interface RiveConfig {
  src: string;
  stateMachine: string;
  axisXInput?: string;
  axisYInput?: string;
  artboard?: string;
}

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  rive: RiveConfig;
}

export const AGENTS: Agent[] = [
  {
    id: 'coder',
    name: 'Coder',
    emoji: '🧸',
    color: '#3b82f6',
    description: '코드를 작성합니다',
    rive: {
      src: '/animations/authteddy.riv',
      stateMachine: 'Login Machine',
    },
  },
  {
    id: 'designer',
    name: 'Designer',
    emoji: '🐱',
    color: '#ec4899',
    description: '디자인을 담당합니다',
    rive: {
      src: '/animations/cattrack.riv',
      stateMachine: 'State Machine 1',
    },
  },
  {
    id: 'analyst',
    name: 'Analyst',
    emoji: '🐻',
    color: '#10b981',
    description: '데이터를 분석합니다',
    rive: {
      src: '/animations/bear.riv',
      stateMachine: 'State Machine 1',
    },
  },
];
