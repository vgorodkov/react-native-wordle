import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useMemo } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { WordRow } from './WordRow';
import { LAYOUT } from 'constants/layout';
import { FONTS, FONT_SIZES } from 'constants/fonts';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { THEME } from 'constants/theme';

const NUM_ROWS = 6;
const NUM_COLS = 5;

const { width } = Dimensions.get('window');

export const Gameboard = ({ target }: { target: string }) => {
  const INITIAL_EMPTY_WORDS = useMemo(
    () => Array.from({ length: NUM_ROWS }, () => Array.from({ length: NUM_COLS }, () => '')),
    [],
  );

  const currentRow = useSelector((state: RootState) => state.game.currentRow);
  const currentCol = useSelector((state: RootState) => state.game.currentCol);
  const correctLetters = useSelector((state: RootState) => state.game.correctLetters);
  const currentWord = useSelector((state: RootState) => state.game.words[currentRow]);

  const activeBoxTranslationX = useDerivedValue(() => {
    if (currentCol === 0) {
      return 0;
    }
    return currentCol * LAYOUT.wordBox + 4 * currentCol;
  });

  const activeBoxTranslationY = useDerivedValue(() => {
    return LAYOUT.wordBox * currentRow + currentRow * 4;
  });

  const correctLettersY = useDerivedValue(() => {
    return currentRow * LAYOUT.wordBox + currentRow * 4;
  });

  const correctLettersStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: correctLettersY.value }],
    };
  });

  const activeBoxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: activeBoxTranslationX.value },
        { translateY: activeBoxTranslationY.value },
      ],
    };
  });

  return (
    <View style={styles.gameContainer}>
      <Animated.View style={[styles.correctLettersContainer, correctLettersStyle]}>
        {correctLetters.map((item, index) => (
          <Text
            style={[
              styles.letter,
              styles.inactiveLetter,
              currentWord[index] !== '' ? { opacity: 0 } : { opacity: 1 },
            ]}
            key={index}
          >
            {item.toUpperCase()}
          </Text>
        ))}
      </Animated.View>
      <Animated.View style={[activeBoxStyle, styles.activeBox]} />
      {INITIAL_EMPTY_WORDS.map((item, index) => (
        <WordRow target={target} key={index} letters={item} rowIndex={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  letter: {
    fontSize: FONT_SIZES.smallScreen.headingMedium,
    color: 'white',
    fontFamily: FONTS.bold,
    width: LAYOUT.wordBox,
    textAlign: 'center',
  },
  inactiveLetter: {
    color: 'rgba(255,255,255,0.3)',
  },
  correctLettersContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    width: LAYOUT.wordBox * 5 + 4 * 4,
    height: LAYOUT.wordBox,
    gap: 4,
    alignItems: 'center',
  },
  activeBox: {
    position: 'absolute',
    top: -2,
    left: (width - 4 * 4 - LAYOUT.wordBox * 5) / 2,
    width: LAYOUT.wordBox,
    height: LAYOUT.wordBox,
    borderWidth: 4,
    zIndex: 30000,
    borderStyle: 'solid',
    borderColor: THEME.colors.primary,
  },
});
