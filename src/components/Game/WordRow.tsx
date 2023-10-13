import { StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useSharedValue } from 'react-native-reanimated';
import { RootState } from 'redux/store';
import { Difficulties, WORDS_BY_DIFFICULTY } from 'redux/slices/difficultySlice';
import { WordRow } from 'components/Playground/WordRow';

import Letter from './Letter';

export const Row = memo(
  ({
    letters,
    rowIndex,
    currentCol,
    target,
    isActive,
  }: {
    letters: string[];
    rowIndex: number;
    currentCol: number;
    target: string;
    isActive: boolean;
  }) => {
    const word = useSelector((state: RootState) => state.game.words[rowIndex]);

    const shouldCheck = useSharedValue(false);
    const isNotExistingWord = useSharedValue(false);

    if (word.join('').length === 5) {
      if (WORDS_BY_DIFFICULTY[Difficulties.Universal].includes(word.join(''))) {
        shouldCheck.value = true;
      } else {
        isNotExistingWord.value = true;
      }
    }

    return (
      <View style={styles.row}>
        {letters.map((_, index) => (
          <Letter
            key={index}
            isActive={currentCol === index}
            isRowActive={isActive}
            rowIndex={rowIndex}
            letterIndex={index}
            target={target}
            shouldCheck={shouldCheck}
            isNotExistingWord={isNotExistingWord}
          />
        ))}
      </View>
    );
  },
);

export default WordRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
});
