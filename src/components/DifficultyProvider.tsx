import React, { ReactNode, useEffect } from 'react';

export enum Difficulties {
  Easy,
  Medium,
  Hard,
  Universal,
}

interface DifficultyContextValue {
  setDifficulty: (difficulty: Difficulties) => void;
  difficulty: Difficulties;
  canBeUsedWords: string[];
  allWords: string[];
}

const DifficultyContext = React.createContext<DifficultyContextValue | null>(null);

export function useDifficulty(): DifficultyContextValue {
  const value = React.useContext(DifficultyContext);
  if (!value) {
    throw new Error('useDifficulty must be used within a DifficultyProvider');
  }
  return value;
}

interface DifficultyProviderProps {
  children: ReactNode;
}

const ALL_WORDS = require('data/be-5.json');
const EASY_WORDS = require('data/be-5-easy.json');

export function DifficultyProvider({ children }: DifficultyProviderProps) {
  const [difficulty, setDifficulty] = React.useState(Difficulties.Easy);
  const [words, setWords] = React.useState(ALL_WORDS);
  useEffect(() => {
    switch (difficulty) {
      case Difficulties.Easy:
        setWords(EASY_WORDS);
        break;
      default:
        setWords(ALL_WORDS);
        break;
    }
    console.log(difficulty);
  }, [difficulty]);
  return (
    <DifficultyContext.Provider
      value={{
        setDifficulty(difficulty) {
          setDifficulty(difficulty);
        },
        difficulty: difficulty,
        allWords: ALL_WORDS,
        canBeUsedWords: words,
      }}
    >
      {children}
    </DifficultyContext.Provider>
  );
}
