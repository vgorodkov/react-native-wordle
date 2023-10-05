import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, useEffect } from 'react';
import { getStoredStr } from 'utils/asyncStorage';

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
  progress: number;
  setProgress: (progress: number) => void;
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

export const ALL_WORDS = require('data/be-5.json');
const EASY_WORDS = require('data/shuffled-easy.json');
export const EASY_NOUNS = require('data/be-5-easy-nouns.json');

export function DifficultyProvider({ children }: DifficultyProviderProps) {
  const [difficulty, setDifficulty] = React.useState(Difficulties.Easy);
  const [words, setWords] = React.useState(ALL_WORDS);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    switch (difficulty) {
      case Difficulties.Easy:
        setWords(EASY_NOUNS);
        AsyncStorage.getItem(`difficulty-${difficulty}-progress`).then((data) => {
          if (data) {
            setProgress(+data);
          } else {
            AsyncStorage.setItem(`difficulty-${difficulty}-progress`, '0');
            setProgress(0);
          }
        });
        break;
      default:
        setWords(ALL_WORDS);
        AsyncStorage.getItem(`difficulty-${difficulty}-progress`).then((data) => {
          if (data) {
            setProgress(+data);
          } else {
            AsyncStorage.setItem(`difficulty-${difficulty}-progress`, '0');
            setProgress(0);
          }
        });
        break;
    }
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
        setProgress(progress) {
          setProgress(progress);
        },
        progress,
      }}
    >
      {children}
    </DifficultyContext.Provider>
  );
}
