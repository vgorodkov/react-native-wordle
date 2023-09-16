import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

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
    width: 24,
    height: 24,
    borderWidth: 1,
  },
  colorHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorHintTxt: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    fontFamily: 'JetBrainsMono-Bold',
  },
});
