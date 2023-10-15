import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { addLetter } from 'redux/slices/gameSlice';
import { Layout } from 'constants/layout';
import { moderateScale } from 'utils/metrics';

const { width } = Dimensions.get('window');

const FONT_SIZE = width > 600 ? 24 : 20;
const LETTER_WIDTH = width > 600 ? width / 28 : width / 14;

export const KeyboardLetter = memo(
  ({ letter, color }: { letter: string; color: SharedValue<string> }) => {
    const dispatch = useDispatch();

    const animatedLetterStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: color.value,
      };
    });

    const handleKeyboardLetter = () => {
      dispatch(addLetter(letter));
    };

    return (
      <Pressable
        onPress={handleKeyboardLetter}
        style={({ pressed }) => [pressed ? { opacity: 0.5 } : { opacity: 1 }]}
      >
        <Animated.View style={[styles.letterButton, animatedLetterStyle]}>
          <Text style={styles.letterText}>{letter}</Text>
        </Animated.View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  letterButton: {
    width: LETTER_WIDTH,
    paddingVertical: 12,
    backgroundColor: '#363229',
    margin: 2,
    alignItems: 'center',
    borderRadius: 4,
  },
  letterText: {
    fontSize: FONT_SIZE,
    fontFamily: 'JetBrainsMono-Bold',
    color: 'white',
  },
});
