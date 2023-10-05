import { StyleSheet, Text, View } from 'react-native';
import React, { MutableRefObject, memo, useEffect } from 'react';
import { useDifficulty } from 'components/DifficultyProvider';
import { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import InactiveLetter from './InactiveLetter';
import { Letter } from './Letter';
import { handleCorrectWord, handleIncorrectWord } from 'utils/handleWordAnimation';

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
    const { allWords } = useDifficulty();
    const colors = letters.map(() => useSharedValue('transparent'));

    useEffect(() => {
      if (letters.join('').length === 5 && allWords.includes(letters.join(''))) {
        handleCorrectWord(letters.join(''), target, colors);
      } else if (letters.join('').length === 5) {
        handleIncorrectWord(colors, letters.join(''));
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
                activeCol={activeCol}
                letterIndex={index}
                onWordLetter={isActive ? onWordLetter : () => {}}
                letter={item}
                key={index}
                color={colors[index]}
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
