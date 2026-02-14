
export interface Stop {
  id: number;
  location: string;
  postcode: string;
  theme: string;
  activity: string;
  travelTime: string;
  jellycatStockist: boolean;
  type: 'Start' | 'Treat' | 'Lunch' | 'Final';
}

export interface Clue {
  stopId: number;
  text: string;
  hint?: string;
  graphicUrl?: string;
  isUnlocked: boolean;
  isGenerating: boolean;
}

export interface HuntState {
  currentStopIndex: number;
  stops: Stop[];
  clues: Clue[];
}
