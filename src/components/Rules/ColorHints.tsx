import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { FONTS } from 'constants/fonts';
import { LAYOUT } from 'constants/layout';
import { moderateScale } from 'utils/metrics';

export const ColorHint = ({ hintText, bgColor }: { hintText: string; bgColor: string }) => {
  return (
    <View style={styles.colorHint}>
      <View style={[styles.colorSquareHint, { backgroundColor: bgColor }]} />
      <Text style={styles.colorHintTxt}>{hintText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  colorSquareHint: {
    width: LAYOUT.wordBox / 3,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: 'white',
  },
  colorHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: LAYOUT.defaultSpacing,
  },
  colorHintTxt: {
    fontSize: moderateScale(10, 0.3),
    color: 'white',
    fontFamily: FONTS.medium,
  },
});
