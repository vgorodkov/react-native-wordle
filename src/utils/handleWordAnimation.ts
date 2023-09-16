import { Theme } from 'assets/theme';
import { SharedValue, withTiming } from 'react-native-reanimated';
const ANIMATION_DURATION = 500;

export const handleWordAnimation = (
  word: string,
  target: string,
  colors: SharedValue<string>[],
) => {
  const loweredWord = word.toLowerCase();
  const loweredTarget = target.toLowerCase();
  for (let i = 0; i < target.length; i++) {
    if (loweredWord[i] === loweredTarget[i]) {
      colors[i].value = withTiming(Theme.colors.correctLetter, {
        duration: ANIMATION_DURATION * i,
      });
      continue;
    } else if (
      loweredTarget.includes(loweredWord[i]) &&
      loweredWord[i - 1] !== loweredWord[i] &&
      !loweredWord.slice(0, i).includes(loweredWord[i])
    ) {
      colors[i].value = withTiming(Theme.colors.inWordLetter, { duration: ANIMATION_DURATION * i });
      continue;
    } else {
      colors[i].value = withTiming(Theme.colors.notInWordLetter, {
        duration: ANIMATION_DURATION * i,
      });
      continue;
    }
  }
};
