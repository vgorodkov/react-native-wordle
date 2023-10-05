import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { Layout } from 'constants/layout';
import { moderateScale } from 'utils/metrics';

interface InactiveLetterProps {
  letter: string;
  letterIndex: number;
  onWordLetter: (letterIndex: number) => void;
  activeCol: number;
}

export const InactiveLetter = memo(
  ({ letter, onWordLetter, letterIndex, activeCol }: InactiveLetterProps) => {
    const isActive = activeCol === letterIndex;
    return (
      <Pressable
        onPress={() => onWordLetter(letterIndex)}
        style={[styles.wordBox, isActive && { borderWidth: 3, borderColor: '#F6E7BE' }]}
      >
        <Text style={[styles.letter]}>{letter.toUpperCase()}</Text>
      </Pressable>
    );
  },
);

export default InactiveLetter;

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
    opacity: 0.5,
  },
});
