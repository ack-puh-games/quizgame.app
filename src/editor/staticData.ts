export interface Question {
  id?: string;
  question: string;
  answer: string;
  value: number;
  edited: boolean;
}

export interface Category {
  id?: string;
  name: string;
}

export interface Board {
  id?: string;
  name: string;
  owner: string;
  created: number;
  edited: number;
}

export const defaultQuestions = [
  {
    question: '$200 Question',
    answer: 'The Answer',
    value: 200,
    edited: false,
  },
  {
    question: '$400 Question',
    answer: 'The Answer',
    value: 400,
    edited: false,
  },
  {
    question: '$600 Question',
    answer: 'The Answer',
    value: 600,
    edited: false,
  },
  {
    question: '$800 Question',
    answer: 'The Answer',
    value: 800,
    edited: false,
  },
  {
    question: '$1000 Question',
    answer: 'The Answer',
    value: 1000,
    edited: false,
  },
];

export const defaultCategories = [
  {
    name: 'Category 1',
    pos: 1,
  },
  {
    name: 'Category 2',
    pos: 2,
  },
  {
    name: 'Category 3',
    pos: 3,
  },
  {
    name: 'Category 4',
    pos: 4,
  },
  {
    name: 'Category 5',
    pos: 5,
  },
  {
    name: 'Category 6',
    pos: 6,
  },
];
