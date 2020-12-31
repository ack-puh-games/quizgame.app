export interface IQuestion {
  id?: string;
  categoryId: string;
  answer: string;
  edited: boolean;
  question: string;
  value: number;
}

export interface ICategory {
  id: string;
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

export interface ICurrentQuestion {
  buzzer: string;
  buzzedAt: string;
  createdAt: string;
  failedContestants: string[];
  isCorrect: boolean;
  isUnlocked: boolean;
  questionId: string;
  questionText: string;
  questionValue: number;
  unlockedAt: string;
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
  currentQuestion?: ICurrentQuestion;
  players: { [index: string]: IPlayer[] };
  boardController: string;
  isStarted: boolean;
  isFinished: boolean;
  winner: string;
}

export interface IUserVisibleQuestion {
  id: string;
  categoryId: string;
  value: number;
  index: number;
}
