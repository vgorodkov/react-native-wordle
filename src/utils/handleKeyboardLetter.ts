import { THEME } from 'constants/theme';
import { SharedValue } from 'react-native-reanimated';

//expected 2d array of colors. colors[rowIndex][letterIndexInRow]
//Change color of letter depends on its correctness
export const handleKeyboardLetterAnimation = (
  usedLetters: string[],
  rows: string[],
  colors: SharedValue<string>[][],
  variant: string,
) => {
  'worklet';
  let color = '';
  switch (variant) {
    case 'correct':
      color = THEME.colors.correctLetter;
      break;
    case 'inWord':
      color = THEME.colors.inWordLetter;
      break;
    case 'notInWord':
      color = THEME.colors.notInWordLetter;
      break;
    default:
      break;
  }
  for (let i = 0; i < usedLetters.length; i++) {
    for (let k = 0; k < rows.length; k++) {
      if (rows[k].includes(usedLetters[i])) {
        let index = rows[k].indexOf(usedLetters[i]);
        colors[k][index].value = color;
        continue;
      }
    }
  }
};
