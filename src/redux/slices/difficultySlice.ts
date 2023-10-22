import { createAction, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { getRandomWord } from 'utils/getRandomWord';

import easyWords from 'data/be-5-easy-nouns.json';
import mediumWords from 'data/be-5-medium-nouns.json';
import hardWords from 'data/be-5-hard-nouns.json';
import allWords from 'data/be-5-all-nouns.json';

export enum Difficulties {
  Easy,
  Medium,
  Hard,
  Universal,
}

type Difficulty = {
  currentWordIndex: number;
  currentProgress: number;
};

export const WORDS_BY_DIFFICULTY = {
  [Difficulties.Easy]: easyWords,
  [Difficulties.Medium]: mediumWords,
  [Difficulties.Hard]: hardWords,
  [Difficulties.Universal]: allWords,
};

export interface DifficultyState {
  difficulty: Difficulties;
  currentWord: string;
  difficulties: Record<Difficulties | number, Difficulty>;
  unguessedWordsByDifficulty: Record<Difficulties | number, string[]>;
  isPlayable: boolean;
  isUnguessedWords: boolean;
}

const initialState: DifficultyState = {
  difficulty: Difficulties.Easy,
  currentWord: WORDS_BY_DIFFICULTY[Difficulties.Easy][0],
  difficulties: {
    [Difficulties.Easy]: {
      currentProgress: 0,
      currentWordIndex: 0,
    },
    [Difficulties.Medium]: {
      currentProgress: 0,
      currentWordIndex: 0,
    },
    [Difficulties.Hard]: {
      currentProgress: 0,
      currentWordIndex: 0,
    },
    [Difficulties.Universal]: {
      currentProgress: 0,
      currentWordIndex: 0,
    },
  },
  unguessedWordsByDifficulty: {
    [Difficulties.Easy]: [],
    [Difficulties.Medium]: [],
    [Difficulties.Hard]: [],
    [Difficulties.Universal]: [],
  },
  isPlayable: true,
  isUnguessedWords: false,
};

export const difficultySlice = createSlice({
  name: 'difficulty',
  initialState,
  reducers: {
    changeDifficulty: (state, action: PayloadAction<Difficulties>) => {
      state.difficulty = action.payload;
      const currentDifficulty = state.difficulties[action.payload];
      // Update currentWord based on the selected difficulty's word array and currentWordIndex
      state.currentWord = WORDS_BY_DIFFICULTY[action.payload][currentDifficulty.currentWordIndex];
    },
    increaseProgress: (state) => {
      const currentDifficulty = state.difficulties[state.difficulty];
      currentDifficulty.currentProgress++;
    },
    increaseCurrentWordIndex: (state) => {
      const currentDifficulty = state.difficulties[state.difficulty];

      if (state.isUnguessedWords) {
        state.currentWord = getRandomWord(state.unguessedWordsByDifficulty[state.difficulty]);
      } else {
        if (currentDifficulty.currentWordIndex < WORDS_BY_DIFFICULTY[state.difficulty].length - 1) {
          currentDifficulty.currentWordIndex++;
          // Update currentWord when currentWordIndex changes
          state.currentWord =
            WORDS_BY_DIFFICULTY[state.difficulty][currentDifficulty.currentWordIndex];
        }
      }
    },
    addToUnguessedWords: (state, action) => {
      state.unguessedWordsByDifficulty[state.difficulty].push(action.payload);
    },
    removeFromUnguessedWords: (state, action) => {
      const updatedWords = state.unguessedWordsByDifficulty[state.difficulty];
      const indexToRemove = updatedWords.indexOf(action.payload);
      updatedWords.splice(indexToRemove, 1);
      state.unguessedWordsByDifficulty[state.difficulty] = updatedWords;
    },
    setIsPlayable: (state) => {
      const currentWordListLength = WORDS_BY_DIFFICULTY[state.difficulty].length;
      const currentWordIndex = state.difficulties[state.difficulty].currentWordIndex;

      if (currentWordIndex >= currentWordListLength - 1) {
        state.isUnguessedWords = true;
      }
      if (
        currentWordIndex < currentWordListLength - 1 ||
        state.unguessedWordsByDifficulty[state.difficulty].length > 0
      ) {
        state.isPlayable = true;
      } else {
        state.isPlayable = false;
      }
    },
  },
});

export const {
  changeDifficulty,
  increaseProgress,
  increaseCurrentWordIndex,
  addToUnguessedWords,
  removeFromUnguessedWords,
  setIsPlayable,
} = difficultySlice.actions;

export default difficultySlice.reducer;
