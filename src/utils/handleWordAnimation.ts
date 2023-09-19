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

export const handleWord = (word: string, target: string, colors: SharedValue<string>[]) => {
  word = word.toLowerCase();
  target = target.toLowerCase();
  const correctIndicies: number[] = [];
  let newTarget = target;
  //find correctLetters first.
  for (let i = 0; i < word.length; i++) {
    if (word[i] === target[i]) {
      correctIndicies.push(i);
      colors[i].value = withTiming(Theme.colors.correctLetter, {
        duration: ANIMATION_DURATION * i,
      });
      newTarget = newTarget.replace(word[i], 's'); //remove from target correct letters and remain it with the same length.
    }
  }
  //check other letters wether they inWord. //For example, target is СЯБАР and СЕМ'Я is the word. Prevent from last Я marked as inWordWord. While СAСНА target and КАЗАК word second A will be marked as inWord.
  for (let i = 0; i < word.length; i++) {
    if (!correctIndicies.includes(i)) {
      if (newTarget.includes(word[i])) {
        colors[i].value = withTiming(Theme.colors.inWordLetter, {
          duration: ANIMATION_DURATION * i,
        });
      } else if (!correctIndicies.includes(i)) {
        colors[i].value = withTiming(Theme.colors.notInWordLetter, {
          duration: ANIMATION_DURATION * i,
        });
      }
    }
  }
};
