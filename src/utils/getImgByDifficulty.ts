import { Difficulty_Imgs } from 'assets/imgs';

export const getDifficultyImg = (difficulty: number) => {
  switch (difficulty) {
    case 0:
      return Difficulty_Imgs.difficulty_0;
    case 1:
      return Difficulty_Imgs.difficulty_1;
    case 2:
      return Difficulty_Imgs.difficulty_2;
    case 3:
      return Difficulty_Imgs.difficulty_3;
    default:
      return Difficulty_Imgs.difficulty_0;
  }
};
