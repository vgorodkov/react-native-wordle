import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export const ExampleLetter = ({ letter, bgColor }: { letter: string; bgColor: string }) => {
  return (
    <View style={[styles.exampleLetter, { backgroundColor: bgColor }]}>
      <Text style={styles.exampleLetterTxt}>{letter}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  exampleLetter: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exampleLetterTxt: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'JetBrainsMono-Bold',
  },
});
