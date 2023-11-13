import { StyleSheet, View } from 'react-native';
import React, { memo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { RootState } from 'redux/store';
import { Difficulties, WORDS_BY_DIFFICULTY } from 'redux/slices/difficultySlice';

import * as Haptics from 'expo-haptics';

import { handleCorrectWord } from 'utils/handleWordAnimation';
import { Letter } from './Letter';
import { THEME } from 'constants/theme';

const LETTER_ANIMATION_DURATION = 300;
const OFFSET = 5;

export const WordRow = memo(
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
    const correctLetters = useSelector((state: RootState) => state.game.correctLetters);

    const prevWord = useRef(word); //store prevWord to trigger vibration only if word changes

    const colors = word.map(() => useSharedValue('transparent'));
    const translateX = word.map(() => useSharedValue(0));
    const rotationsY = word.map(() => useSharedValue(0));

    const handleIncorrectWordAnimation = () => {
      'worklet';
      translateX.forEach((x) => {
        x.value = withSequence(
          withTiming(-OFFSET, { duration: LETTER_ANIMATION_DURATION / 4 }),
          withRepeat(withTiming(OFFSET, { duration: LETTER_ANIMATION_DURATION / 4 }), 5, true),
          withTiming(0, { duration: LETTER_ANIMATION_DURATION / 4 }),
        );
      });
      colors.forEach((color) => {
        color.value = withSequence(
          withTiming(THEME.colors.incorrectLetter, { duration: LETTER_ANIMATION_DURATION }),
          withTiming(THEME.colors.initialLetter, { duration: LETTER_ANIMATION_DURATION }),
        );
      });
    };

    const handleRotateAnimation = () => {
      'worklet';
      rotationsY.forEach((rotationY, i) => {
        rotationY.value = withTiming(180, {
          duration: LETTER_ANIMATION_DURATION * (i + 1),
        });
      });
    };

    if (word.join('').length === 5 && prevWord.current !== word) {
      if (WORDS_BY_DIFFICULTY[Difficulties.Universal].includes(word.join(''))) {
        handleCorrectWord(word.join(''), target, colors);
        handleRotateAnimation();
        if (isActive) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        handleIncorrectWordAnimation();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        prevWord.current = word;
      }
    } else if (prevWord.current === word) {
      handleCorrectWord(word.join(''), target, colors);
    }

    return (
      <View style={styles.row}>
        {letters.map((_, index) => (
          <Letter
            key={index}
            rowIndex={rowIndex}
            letterIndex={index}
            color={colors[index]}
            translateX={translateX[index]}
            rotationY={rotationsY[index]}
            correctLetter={isActive ? correctLetters[index] : null}
            isActive={currentCol === index}
          />
        ))}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
