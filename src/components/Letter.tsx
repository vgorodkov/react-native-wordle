import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Layout } from 'constants/layout';
import { moderateScale } from 'utils/metrics';

interface LetterProps {
  color: SharedValue<string>;
  letter: string;
  letterIndex: number;
  handleLetterDelete: (letterIndex: number, rowIndex: number) => void;
  rowIndex: number;
}

export const Letter = memo(
  ({ letter, letterIndex, rowIndex, handleLetterDelete, color }: LetterProps) => {
    const letterStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: color.value,
      };
    });

    const onLetter = () => {
      handleLetterDelete(letterIndex, rowIndex);
    };

    return (
      <Pressable onPress={onLetter}>
        <Animated.View style={[styles.wordBox, letterStyle]}>
          <Text style={styles.wordLetter}>{letter.toUpperCase()}</Text>
        </Animated.View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  wordBox: {
    width: Layout.wordBox,
    height: Layout.wordBox,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordLetter: {
    fontSize: moderateScale(20, 2),
    color: 'white',
    fontWeight: '600',
    fontFamily: 'JetBrainsMono-Bold',
  },
});
