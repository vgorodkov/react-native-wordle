import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { MutableRefObject, memo, useState } from 'react';
import { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Letter } from './Letter';
import { handleCorrectWord, handleIncorrectWord } from 'utils/handleWordAnimation';
import { moderateScale } from 'utils/metrics';
import { Layout } from 'constants/layout';
import { Theme } from 'assets/theme';
import * as Haptics from 'expo-haptics';

const WORDS = require('../../src/data/be-5.json');

interface WordRowProps {
  row: string;
  rowLength: number;
  target: string;
  handleLetterDelete: (letterIndex: number, rowIndex: number) => void;
  rowIndex: number;
  correctLetters: MutableRefObject<string[]>;
  isActive: boolean;
}

export const WordRow = memo(
  ({
    row,
    target,
    handleLetterDelete,
    rowIndex,
    rowLength,
    correctLetters,
    isActive,
  }: WordRowProps) => {
    const letters = row.split('');
    const colors = [...Array(5)].map(() => useSharedValue('rgba(0,0,0,0.2)'));

    const handleColor = () => {
      if (row.trim().length === 5 && WORDS.includes(row)) {
        handleCorrectWord(row, target, colors);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (row.trim().length === 5) {
        handleIncorrectWord(colors, row);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    };

    handleColor();

    const renderEmptyBoxes = () => {
      return [...Array(rowLength - row.length)].map((_, index) => {
        if (isActive) {
          return (
            <View style={styles.wordBox} key={index}>
              <Text style={styles.letter}>
                {correctLetters.current[index + row.length] === target[index + row.length]
                  ? target[index + row.length].toUpperCase()
                  : ''}
              </Text>
            </View>
          );
        }
        return <View style={styles.wordBox} key={index} />;
      });
    };

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
        {renderEmptyBoxes()}
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
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  letter: {
    fontSize: moderateScale(20, 2),
    color: 'white',
    fontWeight: '600',
    fontFamily: 'JetBrainsMono-Bold',
    opacity: 0.4,
  },
});
