import React, { useState } from 'react';
import QuizzSetup from './components/QuizzSetup';
import Quizz from './components/Quizz';

const App: React.FC = () => {
  const [step, setStep] = useState<'setup' | 'quizz' | 'results'>('setup');
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');

  const handleStartQuizz = (cat: string, diff: string) => {
    setCategory(cat);
    setDifficulty(diff);
    setStep('quizz');
  };

  const handleComplete = () => {
    setStep('results');
  };

  const handleRestart = () => {
    setStep('setup');
    setCategory('');
    setDifficulty('');
  };

  return (
    <>
      <QuizzSetup onStart={handleStartQuizz} forceDisable={step!=='setup'} />
      {(step === 'quizz' || step === 'results') && (
        <Quizz
          category={category}
          difficulty={difficulty}
          amount={5}
          step={step}
          onComplete={handleComplete}
          onRestart={handleRestart}
        />
      )}
    </>
  );
};

export default App;
