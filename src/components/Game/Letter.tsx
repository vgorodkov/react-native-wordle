import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
import React, { memo } from 'react';
import { selectCurrentCol } from 'redux/slices/gameSlice';
import { useDispatch, useSelector } from 'react-redux';
import { LAYOUT } from 'constants/layout';
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { RootState } from 'redux/store';
import { Theme } from 'constants/theme';
import { FONT_SIZES, FONTS } from 'constants/fonts';

interface LetterProps {
  rowIndex: number;
  letterIndex: number;
  isActive: boolean;
  isRowActive: boolean;
  target: string;
  shouldCheck: SharedValue<boolean>;
  isNotExistingWord: SharedValue<boolean>;
  color: SharedValue<string>;
}

const OFFSET = 5;
const TIME = 300;

export const Letter = memo(
  ({
    rowIndex,
    letterIndex,
    isActive,
    isRowActive,
    target,
    shouldCheck,
    isNotExistingWord,
    color,
  }: LetterProps) => {
    const letter = useSelector((state: RootState) => state.game.words[rowIndex][letterIndex]);
    const correctLetter = useSelector((state: RootState) => state.game.correctLetters[letterIndex]);

    const dispatch = useDispatch();

    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotationY = useSharedValue(0);

    const borderColor = isActive ? Theme.colors.primary : 'white';
    const borderWidth = isActive ? 3 : 1;

    if (isActive) {
      scale.value = withSequence(withSpring(1.2), withSpring(1));
    }

    const letterStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: color.value,
        transform: [
          { scale: scale.value },
          { translateX: translateX.value },
          { rotateY: `${rotationY.value}deg` },
          { translateY: translateY.value },
        ],
      };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotateY: `${rotationY.value}deg` }, { scale: scale.value }],
      };
    });

    useAnimatedReaction(
      () => shouldCheck,
      () => {
        if (shouldCheck.value) {
          rotationY.value = withTiming(180, { duration: 300 * (letterIndex + 1) });

          if (letterIndex > 4) {
            shouldCheck.value = false;
          }
        }
      },
    );

    useAnimatedReaction(
      () => isNotExistingWord,
      () => {
        if (isNotExistingWord.value) {
          scale.value = withSequence(withSpring(1.1), withSpring(1));
          translateX.value = withSequence(
            withTiming(-OFFSET, { duration: TIME / 4 }),
            withRepeat(withTiming(OFFSET, { duration: TIME / 4 }), 5, true),
            withTiming(0, { duration: TIME / 4 }),
          );
          color.value = withSequence(
            withTiming(Theme.colors.incorrectLetter, { duration: TIME }),
            withTiming(Theme.colors.initialLetter, { duration: TIME }),
          );
        }

        if (letterIndex === 4) {
          isNotExistingWord.value = false;
        }
      },
    );

    const handleWordLetter = () => {
      dispatch(selectCurrentCol({ currentCol: letterIndex, currentRow: rowIndex }));
    };

    return (
      <Pressable onPress={handleWordLetter}>
        <Animated.View style={[styles.wordBox, { borderColor, borderWidth }, letterStyle]}>
          {letter === '' && correctLetter !== '' && isRowActive ? (
            <Text style={[styles.letter, styles.inactiveLetter]}>
              {correctLetter.toUpperCase()}
            </Text>
          ) : (
            <Animated.Text style={[styles.letter, animatedTextStyle]}>
              {letter.toUpperCase()}
            </Animated.Text>
          )}
        </Animated.View>
      </Pressable>
    );
  },
);

export default Letter;

const styles = StyleSheet.create({
  wordBox: {
    width: LAYOUT.wordBox,
    aspectRatio: 1,
    borderColor: 'white',
    justifyContent: 'center',

    alignItems: 'center',
  },
  letter: {
    fontSize: FONT_SIZES.smallScreen.headingMedium,
    color: 'white',
    fontFamily: FONTS.bold,
  },
  inactiveLetter: {
    opacity: 0.5,
  },
});
