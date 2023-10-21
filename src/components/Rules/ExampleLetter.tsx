import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { moderateScale, scale } from 'utils/metrics';
import { LAYOUT } from 'constants/layout';
import { FONT_SIZES, FONTS } from 'constants/fonts';

export const ExampleLetter = ({ letter, bgColor }: { letter: string; bgColor: string }) => {
  return (
    <View style={[styles.exampleLetter, { backgroundColor: bgColor }]}>
      <Text style={styles.exampleLetterTxt}>{letter}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  exampleLetter: {
    width: LAYOUT.wordBox * 0.9,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exampleLetterTxt: {
    fontSize: FONT_SIZES.smallScreen.headingMedium,
    color: 'white',
    fontFamily: FONTS.bold,
  },
});
