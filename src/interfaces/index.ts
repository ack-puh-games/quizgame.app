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
  buzzedAt: number;
  createdAt: number;
  failedContestants: string[];
  isCorrect: boolean;
  isDead: boolean;
  isUnlocked: boolean;
  questionId: string;
  questionText: string;
  questionValue: number;
  unlockedAt: number;
}

export interface IPlayer {
  id: string;
  currentScore: number;
  name: string;
  image: string;
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
