export interface Question {
  question: string;
  answer: string;
  value: number;
  edited: boolean;
}

export interface Category {
  name: string;
  questions: Question[];
}

export interface Board {
  id?: string;
  name: string;
  owner: string;
  boardData: {
    categories: Category[];
  };
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

export const defaultBoardData = {
  categories: [
    {
      name: 'Category 1',
      questions: defaultQuestions,
    },
    {
      name: 'Category 2',
      questions: defaultQuestions,
    },
    {
      name: 'Category 3',
      questions: defaultQuestions,
    },
    {
      name: 'Category 4',
      questions: defaultQuestions,
    },
    {
      name: 'Category 5',
      questions: defaultQuestions,
    },
    {
      name: 'Category 6',
      questions: defaultQuestions,
    },
  ],
};
