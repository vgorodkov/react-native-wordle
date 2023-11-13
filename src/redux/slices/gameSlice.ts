import { createSlice } from '@reduxjs/toolkit';
import { Difficulties, WORDS_BY_DIFFICULTY } from './difficultySlice';

export interface GameState {
  words: string[][];
  correctLetters: string[];
  currentRow: number;
  currentCol: number;
  isGameEnded: boolean;
  currentWord: string;
  hintWasUsed: boolean;
}
const NUM_ROWS = 6;
const NUM_COLS = 5;
const INITIAL_EMPTY_WORDS = Array.from({ length: NUM_ROWS }, () =>
  Array.from({ length: NUM_COLS }, () => ''),
);

const initialState: GameState = {
  words: INITIAL_EMPTY_WORDS,
  currentWord: '',
  correctLetters: ['', '', '', '', ''],
  currentRow: 0,
  currentCol: 0,
  isGameEnded: false,
  hintWasUsed: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addLetter: (state, action) => {
      const letter = action.payload;
      const isInRowRange = state.currentRow < NUM_ROWS;
      const inInColRange = state.currentCol < NUM_COLS;
      const isLastRow = state.currentRow === NUM_ROWS - 1;

      if (isInRowRange) {
        if (inInColRange) {
          state.words[state.currentRow][state.currentCol] = letter;
          if (state.currentCol < NUM_COLS - 1) {
            state.currentCol++;
          } else if (!isLastRow) {
            state.words[state.currentRow][state.currentCol] = letter;
          }
        }
      }

      if (state.words[state.currentRow].join('').length === 5) {
        state.currentWord = state.words[state.currentRow].join('');
      }

      if (
        isLastRow &&
        state.words[state.currentRow].join('').length === 5 &&
        WORDS_BY_DIFFICULTY[Difficulties.Universal].includes(state.currentWord)
      ) {
        //ends game if all rows filled
        state.isGameEnded = true;
      }
    },
    selectCurrentCol: (state, action) => {
      const { currentCol, currentRow } = action.payload;
      if (currentRow === state.currentRow) {
        state.currentCol = currentCol;
      }
    },
    deleteLetter: (state) => {
      //remove letter
      if (state.words[state.currentRow][state.currentCol] === '' && state.currentCol > 0) {
        state.currentCol--;
        state.words[state.currentRow][state.currentCol] = '';
      } else {
        state.words[state.currentRow][state.currentCol] = '';
      }
    },
    deleteAllLetters: (state) => {
      state.words[state.currentRow] = ['', '', '', '', ''];
      state.currentCol = 0;
    },
    moveToNextRow: (state) => {
      const isLastRow = state.currentRow === NUM_ROWS - 1;
      if (!isLastRow) {
        state.currentWord = '';
        state.currentRow++;
        state.currentCol = 0;
      }
    },
    setIsGameEnded: (state) => {
      state.isGameEnded = true;
    },
    resetGame: (state) => {
      state.words = initialState.words;
      state.currentCol = 0;
      state.currentRow = 0;
      state.correctLetters = initialState.correctLetters;
      state.currentWord = initialState.currentWord;
      state.isGameEnded = false;
      state.hintWasUsed = false;
    },
    setCorrectLetters: (state, action) => {
      for (let i = 0; i < state.correctLetters.length; i++) {
        if (state.correctLetters[i] === '') {
          state.correctLetters[i] = action.payload[i];
          8;
        }
      }
    },
    setHintWasUsed: (state) => {
      state.hintWasUsed = true;
    },
  },
});

export const {
  addLetter,
  selectCurrentCol,
  deleteLetter,
  deleteAllLetters,
  moveToNextRow,
  setIsGameEnded,
  resetGame,
  setCorrectLetters,
  setHintWasUsed,
} = gameSlice.actions;

export default gameSlice.reducer;
