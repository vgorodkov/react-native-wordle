import { SharedValue } from 'react-native-reanimated';

//check letters in a word and mark them as correct, inWord, notInword.
export const handleWordCheck = (word: string, target: string) => {
  'worklet';
  const loweredWord = word.toLowerCase();
  const loweredTarget = target.toLowerCase();
  const letters: {
    correct: string[];
    inWord: string[];
    notInWord: string[];
  } = {
    correct: [],
    inWord: [],
    notInWord: [],
  };

  for (let i = 0; i < target.length; i++) {
    if (loweredWord[i] === loweredTarget[i]) {
      letters.correct.push(word[i]);
      continue;
    } else if (
      loweredTarget.includes(loweredWord[i]) &&
      loweredWord[i - 1] !== loweredWord[i] &&
      !loweredWord.slice(0, i).includes(loweredWord[i])
    ) {
      letters.inWord.push(word[i]);
      continue;
    } else {
      letters.notInWord.push(word[i]);
      continue;
    }
  }
  return letters;
};
