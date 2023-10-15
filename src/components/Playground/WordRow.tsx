import { StyleSheet, View } from 'react-native';
import React, { memo, useEffect } from 'react';

import { useSharedValue } from 'react-native-reanimated';
import InactiveLetter from './InactiveLetter';
import { Letter } from './Letter';
import { handleCorrectWord, handleIncorrectWord } from 'utils/handleWordAnimation';
import { Difficulties, WORDS_BY_DIFFICULTY } from 'redux/slices/difficultySlice';

interface WordRowProps {
  letters: string[];
  correctLetters: string[] | null;
  target: string;
  isActive: boolean;
  onWordLetter: (letterIndex: number) => void;
  activeCol: number;
}

export const WordRow = memo(
  ({ letters, correctLetters, target, isActive, onWordLetter, activeCol }: WordRowProps) => {
    const allWords = WORDS_BY_DIFFICULTY[Difficulties.Universal];
    const colors = letters.map(() => useSharedValue('transparent'));

    const isNotExistingWord = useSharedValue(false);

    const word = letters.join('');

    useEffect(() => {
      if (word.length === 5 && allWords.includes(word)) {
        handleCorrectWord(word, target, colors);
      } else if (word.length === 5) {
        handleIncorrectWord(colors, word);
        isNotExistingWord.value = true;
      }
    }, [letters]);

    return (
      <View style={styles.wordRow}>
        {letters.map((item, index) => {
          if (
            isActive &&
            correctLetters &&
            target[index] === correctLetters[index] &&
            item === ''
          ) {
            return (
              <InactiveLetter
                activeCol={activeCol}
                letterIndex={index}
                onWordLetter={isActive ? onWordLetter : () => {}}
                letter={correctLetters[index]}
                key={index}
              />
            );
          } else {
            return (
              <Letter
                isActiveCol={activeCol === index}
                isActiveRow={isActive}
                letterIndex={index}
                onWordLetter={onWordLetter}
                letter={item}
                key={index}
                color={colors[index]}
                isNotExistingWord={isNotExistingWord}
              />
            );
          }
        })}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
});
