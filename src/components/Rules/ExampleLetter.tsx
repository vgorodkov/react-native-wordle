import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { moderateScale, scale } from 'utils/metrics';

export const ExampleLetter = ({ letter, bgColor }: { letter: string; bgColor: string }) => {
  return (
    <View style={[styles.exampleLetter, { backgroundColor: bgColor }]}>
      <Text style={styles.exampleLetterTxt}>{letter}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  exampleLetter: {
    width: scale(48),
    height: scale(48),
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exampleLetterTxt: {
    fontSize: moderateScale(16, 1),
    color: 'white',
    fontWeight: '600',
    fontFamily: 'JetBrainsMono-Bold',
  },
});
