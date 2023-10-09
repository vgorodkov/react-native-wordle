import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { Layout } from 'constants/layout';
import { moderateScale } from 'utils/metrics';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

interface LetterProps {
  letter: string;
  onWordLetter: (letterIndex: number) => void;
  letterIndex: number;
  isActiveRow: boolean;
  isActiveCol: boolean;
  color: SharedValue<string>;
}

export const Letter = memo(
  ({ letter, letterIndex, onWordLetter, isActiveCol, isActiveRow, color }: LetterProps) => {
    const aStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: color.value,
      };
    });

    return (
      <Pressable onPress={() => (isActiveRow ? onWordLetter(letterIndex) : {})}>
        <Animated.View
          style={[
            styles.wordBox,
            aStyle,
            isActiveCol && { borderWidth: 3, borderColor: '#F6E7BE' },
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
