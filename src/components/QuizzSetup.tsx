import React, { useEffect, useState } from 'react';
import type { ICategory, IDifficulty } from '../types';

interface QuizzSetupProps {
  onStart: (category: string, difficulty: string) => void;
  forceDisable: boolean;
}

const SELECT_CATEGORY: ICategory = { id: 0, name: 'Select a category' };

const QuizzSetup: React.FC<QuizzSetupProps> = ({ onStart, forceDisable }) => {
  const [categories, setCategories] = useState<ICategory[]>([SELECT_CATEGORY]);
  const difficulties: IDifficulty[] = [
    { label: 'Select difficulty', value: '' },
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('0');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then((res) => res.json())
      .then((data) =>
        setCategories([SELECT_CATEGORY, ...data.trivia_categories])
      );
  }, []);

  const isValid = selectedCategory !== '0' && selectedDifficulty !== '' &&  !forceDisable;

  return (
    <div>
      <h2>Create Quizz</h2>
      <select
        id="categorySelect"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        id="difficultySelect"
        value={selectedDifficulty}
        onChange={(e) => setSelectedDifficulty(e.target.value)}
      >
        {difficulties.map((difficulty) => (
          <option key={difficulty.value || 'default'} value={difficulty.value}>
            {difficulty.label}
          </option>
        ))}
      </select>

      <button
        id="createBtn"
        onClick={() => onStart(selectedCategory, selectedDifficulty)}
        disabled={!isValid}
      >
        Create Quizz
      </button>
    </div>
  );
};

export default QuizzSetup;
