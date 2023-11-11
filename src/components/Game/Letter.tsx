import { Pressable, StyleSheet, Text } from 'react-native';
import React, { memo, useRef } from 'react';

import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { selectCurrentCol } from 'redux/slices/gameSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { LAYOUT } from 'constants/layout';
import { THEME } from 'constants/theme';
import { FONT_SIZES, FONTS } from 'constants/fonts';

interface LetterProps {
  rowIndex: number;
  letterIndex: number;
  color: SharedValue<string>;
  translateX: SharedValue<number>;
  rotationY: SharedValue<number>;
  correctLetter: string | null;
  isActive: boolean;
}

export const Letter = memo(
  ({
    rowIndex,
    letterIndex,
    color,
    translateX,
    rotationY,
    correctLetter,
    isActive,
  }: LetterProps) => {
    const letter = useSelector((state: RootState) => state.game.words[rowIndex][letterIndex]);

    const dispatch = useDispatch();

    const initialValue = useRef(letter);

    const translateY = useSharedValue(0);

    const txtScale = useDerivedValue(() => {
      if (initialValue.current !== letter) {
        return withSequence(withTiming(1.3, { duration: 50 }), withTiming(1, { duration: 50 }));
      }
      return 1;
    });

    const borderColor = isActive ? THEME.colors.primary : 'white';
    const borderWidth = isActive ? 3 : 1;

    const letterStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: color.value,
        transform: [
          { translateX: translateX.value },
          { rotateY: `${rotationY.value}deg` },
          { translateY: translateY.value },
        ],
      };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotateY: `${rotationY.value}deg` }, { scale: txtScale.value }],
      };
    });

    const handleWordLetter = () => {
      dispatch(selectCurrentCol({ currentCol: letterIndex, currentRow: rowIndex }));
    };

    return (
      <Pressable onPress={handleWordLetter}>
        <Animated.View style={[styles.wordBox, letterStyle, { borderWidth, borderColor }]}>
          <Animated.Text style={[styles.letter, animatedTextStyle]}>
            {letter === '' && correctLetter ? (
              <Text style={styles.inactiveLetter}>{correctLetter.toUpperCase()}</Text>
            ) : (
              letter.toUpperCase()
            )}
          </Animated.Text>
        </Animated.View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  wordBox: {
    width: LAYOUT.wordBox,
    height: LAYOUT.wordBox,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: FONT_SIZES.smallScreen.headingMedium,
    color: 'white',
    fontFamily: FONTS.bold,
  },
  inactiveLetter: {
    color: 'rgba(255,255,255,0.4)',
  },
});
