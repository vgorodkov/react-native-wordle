import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { Layout } from 'constants/layout';
import { moderateScale } from 'utils/metrics';
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
import { Theme } from 'constants/theme';

interface LetterProps {
  letter: string;
  onWordLetter: (letterIndex: number) => void;
  letterIndex: number;
  isActiveRow: boolean;
  isActiveCol: boolean;
  color: SharedValue<string>;
  isNotExistingWord: SharedValue<boolean>;
}

const OFFSET = 5;
const TIME = 100;
export const Letter = memo(
  ({
    letter,
    letterIndex,
    onWordLetter,
    isActiveCol,
    isActiveRow,
    color,
    isNotExistingWord,
  }: LetterProps) => {
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const aStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: color.value,
        transform: [
          { scale: scale.value },
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
      };
    });

    if (isActiveCol) {
      scale.value = withSequence(withSpring(1.1), withSpring(1));
    }

    useAnimatedReaction(
      () => isNotExistingWord,
      () => {
        if (isNotExistingWord.value) {
          scale.value = withSequence(withSpring(1.2), withSpring(1));
          translateX.value = withSequence(
            withTiming(-OFFSET, { duration: TIME / 2 }),
            withRepeat(withTiming(OFFSET, { duration: TIME }), 5, true),
            withTiming(0, { duration: TIME / 2 }),
          );
          if (letterIndex === 4) {
            isNotExistingWord.value = false;
          }
        }
      },
    );
    console.log(isActiveRow);
    return (
      <Pressable onPress={() => (isActiveRow ? onWordLetter(letterIndex) : {})}>
        <Animated.View
          style={[
            styles.wordBox,
            aStyle,
            isActiveCol && { borderWidth: 3, borderColor: Theme.colors.primary },
          ]}
        >
          <Text style={styles.letter}>{letter.toUpperCase()}</Text>
        </Animated.View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  wordBox: {
    width: Layout.wordBox,
    height: Layout.wordBox,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  letter: {
    fontSize: moderateScale(20, 2),
    color: 'white',
    fontWeight: '600',
    fontFamily: 'JetBrainsMono-Bold',
  },
});
