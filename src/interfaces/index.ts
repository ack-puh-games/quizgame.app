export interface IQuestion {
  id?: string;
  categoryId: string;
  answer: string;
  edited: boolean;
  question: string;
  value: number;
}

export interface ICategory {
  id?: string;
  name: string;
  pos: number;
}

export interface IBoard {
  id?: string;
  created: number;
  edited: number;
  name: string;
  owner: string;
}

interface ISelectedQuestion {
  categoryId: string;
  index: number;
}

interface IPlayer {
  id: string;
  currentScore: number;
}

export interface IGame {
  id?: string;
  board: string;
  host: string;
  name?: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  selectedQuestions?: ISelectedQuestion[];
  currentQuestion?: {
    createdAt: string;
    questionText: string;
    isUnlocked: boolean;
    unlockedAt: string;
    answerer: string;
    isAnswered: boolean;
    isAnsweredCorrectly: boolean;
  };
  players: IPlayer[];
  boardController: string;
  isStarted: boolean;
  isFinished: boolean;
  winner: string;
}
