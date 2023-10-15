import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
import React, { memo } from 'react';
import { selectCurrentCol } from 'redux/slices/gameSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from 'constants/layout';
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
import { moderateScale } from 'utils/metrics';
import { Theme } from 'constants/theme';

const handleLetterColor = (letter: string, target: string, letterIndex: number) => {
  if (letter !== '') {
    if (letter === target[letterIndex]) {
      return 'correct';
    } else if (target.includes(letter)) {
      return 'inWord';
    } else {
      return 'notInWord';
    }
  } else {
    return 'unchecked';
  }
};

interface LetterProps {
  rowIndex: number;
  letterIndex: number;
  isActive: boolean;
  isRowActive: boolean;
  target: string;
  shouldCheck: SharedValue<boolean>;
  isNotExistingWord: SharedValue<boolean>;
}

const { width } = Dimensions.get('window');

const OFFSET = 5;
const TIME = 300;
const FONT_SIZE = width > 600 ? 28 : 24;

export const Letter = memo(
  ({
    rowIndex,
    letterIndex,
    isActive,
    isRowActive,
    target,
    shouldCheck,
    isNotExistingWord,
  }: LetterProps) => {
    const letter = useSelector((state: RootState) => state.game.words[rowIndex][letterIndex]);
    const correctLetter = useSelector((state: RootState) => state.game.correctLetters[letterIndex]);

    const dispatch = useDispatch();

    const color = useSharedValue(Theme.colors.initialLetter);
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotationY = useSharedValue(180);

    const borderColor = isActive ? Theme.colors.primary : 'white';
    const borderWidth = isActive ? 3 : 1;
    const result = handleLetterColor(letter, target, letterIndex);

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
        transform: [{ rotateY: `${rotationY.value}deg` }],
      };
    });

    useAnimatedReaction(
      () => shouldCheck,
      () => {
        if (shouldCheck.value) {
          switch (result) {
            case 'correct':
              color.value = withTiming(Theme.colors.correctLetter, {
                duration: 400 * (letterIndex + 1),
              });
              break;
            case 'inWord':
              color.value = withTiming(Theme.colors.inWordLetter, {
                duration: 400 * (letterIndex + 1),
              });
              break;
            case 'notInWord':
              color.value = withTiming(Theme.colors.notInWordLetter, {
                duration: 400 * (letterIndex + 1),
              });
              break;
            case 'unchecked':
              color.value = Theme.colors.initialLetter;
            default:
              break;
          }
          rotationY.value = withTiming(0, { duration: 300 * (letterIndex + 1) });

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
      dispatch(selectCurrentCol(letterIndex));
    };

    return (
      <Pressable onPress={isRowActive ? handleWordLetter : () => {}}>
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
    width: Layout.wordBox,
    height: Layout.wordBox,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: FONT_SIZE,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'JetBrainsMono-Bold',
  },
  inactiveLetter: {
    opacity: 0.5,
    transform: [{ rotateY: `180deg` }],
  },
});
