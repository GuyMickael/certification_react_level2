interface ICategory {
  id: number;
  name: string;
}

interface IDifficulty {
  label: string;
  value: string;
}

interface IQuestionAPI {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface IQuestion extends IQuestionAPI {
  id: number;
  options: string[];
}

export type { ICategory, IDifficulty, IQuestion, IQuestionAPI };
