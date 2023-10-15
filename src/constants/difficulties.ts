import { Difficulty_Imgs } from 'assets/imgs';
import { WORDS_BY_DIFFICULTY, Difficulties } from 'redux/slices/difficultySlice';
import { DifficultiesScreenString } from './strings';

export const DIFFICULTIES = [
  {
    description: DifficultiesScreenString.EASY_DESCRIPTION,
    img: Difficulty_Imgs.difficulty_0,
    name: DifficultiesScreenString.EASY,
    length: WORDS_BY_DIFFICULTY[Difficulties.Easy].length,
  },
  {
    description: DifficultiesScreenString.MEDIUM_DESCRIPTION,
    img: Difficulty_Imgs.difficulty_1,
    name: DifficultiesScreenString.MEDIUM,
    length: WORDS_BY_DIFFICULTY[Difficulties.Medium].length,
  },
  {
    description: DifficultiesScreenString.HARD_DESCRIPTION,
    img: Difficulty_Imgs.difficulty_2,
    name: DifficultiesScreenString.HARD,
    length: WORDS_BY_DIFFICULTY[Difficulties.Hard].length,
  },
  {
    description: DifficultiesScreenString.UNIVRESAL_DESCRIPTION,
    img: Difficulty_Imgs.difficulty_3,
    name: DifficultiesScreenString.UNIVERSAL,
    length: WORDS_BY_DIFFICULTY[Difficulties.Universal].length,
  },
];
