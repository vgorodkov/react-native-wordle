import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { moderateScale } from 'utils/metrics';
import { Layout } from 'constants/layout';

interface KeyboardLetter {
  onLetterPress: (letter: string) => void;
  handleLongPress: (letter: string) => void;
  letter: string;
  color: SharedValue<string>;
}

const { width } = Dimensions.get('window');

export const KeyboardLetter = ({
  onLetterPress,
  handleLongPress,
  letter,
  color,
}: KeyboardLetter) => {
  const letterStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: color.value,
    };
  });

  return (
    <Pressable
      style={({ pressed }) => [pressed ? { opacity: 0.5 } : { opacity: 1 }]}
      onPress={() => onLetterPress(letter)}
      onLongPress={() => handleLongPress(letter)}
    >
      <Animated.View style={[styles.letterButton, letterStyle]}>
        {letter === 'е' && <Text style={styles.specialLetter}>ё</Text>}
        <Text style={styles.letterText}>{letter}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  letterButton: {
    width: width / 14,
    paddingVertical: Layout.extraSmallPadding,

    margin: 2,
    alignItems: 'center',
    borderRadius: 4,
  },
  letterText: {
    fontSize: moderateScale(20),
    fontFamily: 'JetBrainsMono-Bold',
    color: 'white',
  },
  specialLetter: {
    position: 'absolute',
    fontSize: moderateScale(12),
    fontFamily: 'JetBrainsMono-Bold',
    color: 'white',
    right: 2,
    top: 1,
  },
});
