export interface DesktopAction {
  type: 'click' | 'type' | 'keypress' | 'scroll' | 'drag' | 'wait' | 'complete';
  x?: number;
  y?: number;
  text?: string;
  key?: string;
  direction?: 'up' | 'down';
  amount?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  reason?: string;
}

export interface AgentState {
  iteration: number;
  lastAction?: DesktopAction;
  taskComplete: boolean;
  history: {
    iteration: number;
    action: DesktopAction;
    timestamp: string;
  }[];
}

export interface LLMResponse {
  action: DesktopAction;
  reasoning: string;
  confidence: number;
}
