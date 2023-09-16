import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Letter } from './Letter';
import { handleWordAnimation } from 'utils/handleWordAnimation';
import { moderateScale, scale } from 'utils/metrics';
import { Layout } from 'constants/layout';

const WORDS = require('../../src/data/be-5.json');

interface WordRowProps {
  row: string;
  rowLength: number;
  target: string;
  handleLetterDelete: (letterIndex: number, rowIndex: number) => void;
  rowIndex: number;
}
const ANIMATION_DURATION = 300;

export const WordRow = memo(
  ({ row, target, handleLetterDelete, rowIndex, rowLength }: WordRowProps) => {
    const letters = row.split('');
    const colors = [...Array(5)].map(() => useSharedValue('transparent'));

    const handleColorAnimation = () => {
      if (row.length === 5 && WORDS.includes(row)) {
        handleWordAnimation(row, target, colors);
      } else if (row.length === 5) {
        for (let i = 0; i < row.length; i++) {
          colors[i].value = withSequence(
            withTiming('#EF271B', { duration: ANIMATION_DURATION * 2 }),
            withTiming('transparent'),
          );
        }
      }
    };

    handleColorAnimation();

    return (
      <View style={styles.wordRow}>
        {letters.map((letter, letterIndex) => (
          <Letter
            rowIndex={rowIndex}
            letterIndex={letterIndex}
            letter={letter}
            color={colors[letterIndex]}
            key={letterIndex}
            handleLetterDelete={handleLetterDelete}
          />
        ))}
        {[...Array(rowLength - row.length)].map((_, emptyIndex) => (
          <View style={[styles.wordBox]} key={emptyIndex}>
            <Text>{''}</Text>
          </View>
        ))}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  wordBox: {
    width: Layout.wordBox,
    height: Layout.wordBox,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
  },
});
