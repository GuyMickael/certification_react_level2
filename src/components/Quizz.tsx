import React, { useEffect, useState } from 'react';
import { shuffleArray, decodeHtml } from '../utils';
import type { IQuestion, IQuestionAPI } from '../types';

interface QuizzComponentProps {
  category: string;
  difficulty: string;
  amount: number;
  step: 'quizz' | 'results';
  onComplete: () => void;
  onRestart: () => void;
}

const Quizz: React.FC<QuizzComponentProps> = ({
  category,
  difficulty,
  amount = 5,
  step,
  onComplete,
  onRestart,
}) => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!category || !difficulty) return;

    fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
    )
      .then((res) => res.json())
      .then((data) => {
        const formattedQuestions: IQuestion[] = data.results.map(
          (q: IQuestionAPI, index: number) => ({
            ...q,
            id: index,
            options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
          })
        );
        setQuestions(formattedQuestions);
        setSelectedAnswers({});
        setShowResults(false);
      });
  }, [category, difficulty, amount]);

  useEffect(() => {
    setShowResults(step === 'results');
  }, [step]);

  const handleAnswerSelection = (questionId: number, answer: string) => {
    if (!showResults) {
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
    }
  };

  const handleSubmitQuizz = () => {
    setShowResults(true);
    if (onComplete) {
      onComplete();
    }
  };

  const score = Object.keys(selectedAnswers).reduce((acc, key) => {
    const qId = Number(key);
    return (
      acc + (selectedAnswers[qId] === questions[qId]?.correct_answer ? 1 : 0)
    );
  }, 0);

  const getScoreColor = () => {
    if (score <= 1) return 'red';
    if (score <= 3) return 'orange';
    return 'green';
  };

  const allAnswered =
    questions.length > 0 &&
    Object.keys(selectedAnswers).length === questions.length;

  return (
    <div>
      <h2>Quizz</h2>
      {questions.map((question) => (
        <div key={question.id} style={{ marginBottom: '20px' }}>
          <p>{decodeHtml(question.question)}</p>
          {question.options.map((option) => {
            let backgroundColor: string | undefined;

            if (showResults) {
              if (option === question.correct_answer)
                backgroundColor = 'lightgreen';
              else if (
                selectedAnswers[question.id] === option &&
                option !== question.correct_answer
              )
                backgroundColor = 'salmon';
            } else if (selectedAnswers[question.id] === option) {
              backgroundColor = '#d3d3d3';
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelection(question.id, option)}
                style={{
                  backgroundColor,
                  marginRight: '10px',
                  cursor: showResults ? 'default' : 'pointer',
                }}
                disabled={showResults}
              >
                {decodeHtml(option)}
              </button>
            );
          })}
        </div>
      ))}

      {step === 'quizz' && !showResults && allAnswered && (
        <button onClick={handleSubmitQuizz}>Submit Quizz</button>
      )}
      {step === 'results' && (
        <button onClick={onRestart}>Create New Quizz</button>
      )}

      {showResults && (
        <h3 style={{ color: getScoreColor() }}>
          Final score: {score} / {questions.length}
        </h3>
      )}
    </div>
  );
};

export default Quizz;
