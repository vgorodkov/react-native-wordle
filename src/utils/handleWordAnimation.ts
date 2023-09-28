import { Theme } from 'assets/theme';
import { SharedValue, withSequence, withTiming } from 'react-native-reanimated';
const ANIMATION_DURATION = 300;

export const handleCorrectWord = (word: string, target: string, colors: SharedValue<string>[]) => {
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
          duration: ANIMATION_DURATION * (i + 1),
        });
      } else if (!correctIndicies.includes(i)) {
        colors[i].value = withTiming(Theme.colors.notInWordLetter, {
          duration: ANIMATION_DURATION * (i + 1),
        });
      }
    }
  }
};

export const handleIncorrectWord = (colors: SharedValue<string>[], row: string) => {
  for (let i = 0; i < row.length; i++) {
    colors[i].value = withSequence(
      withTiming('#FE5F55', { duration: (ANIMATION_DURATION / 2) * (i + 1) }),
      withTiming('transparent', { duration: (ANIMATION_DURATION / 2) * (i + 1) }),
    );
  }
};
