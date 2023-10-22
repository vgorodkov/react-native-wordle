import { Difficulty_Imgs } from 'assets/imgs';
import { WORDS_BY_DIFFICULTY, Difficulties } from 'redux/slices/difficultySlice';
import { DIFFICULTIES_SCREEN_STRING } from './strings';

export const DIFFICULTIES = [
  {
    description: DIFFICULTIES_SCREEN_STRING.easyDescription,
    img: Difficulty_Imgs.difficulty_0,
    name: DIFFICULTIES_SCREEN_STRING.easy,
    length: WORDS_BY_DIFFICULTY[Difficulties.Easy].length,
  },
  {
    description: DIFFICULTIES_SCREEN_STRING.mediumDescription,
    img: Difficulty_Imgs.difficulty_1,
    name: DIFFICULTIES_SCREEN_STRING.medium,
    length: WORDS_BY_DIFFICULTY[Difficulties.Medium].length,
  },
  {
    description: DIFFICULTIES_SCREEN_STRING.hardDescription,
    img: Difficulty_Imgs.difficulty_2,
    name: DIFFICULTIES_SCREEN_STRING.hard,
    length: WORDS_BY_DIFFICULTY[Difficulties.Hard].length,
  },
  {
    description: DIFFICULTIES_SCREEN_STRING.universalDescription,
    img: Difficulty_Imgs.difficulty_3,
    name: DIFFICULTIES_SCREEN_STRING.universal,
    length: WORDS_BY_DIFFICULTY[Difficulties.Universal].length,
  },
];
