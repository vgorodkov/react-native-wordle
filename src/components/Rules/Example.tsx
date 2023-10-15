import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { ColorHint } from './ColorHints';
import { ExampleLetter } from './ExampleLetter';
import { Theme } from 'constants/theme';
import { RulesScreenString } from 'constants/strings';
import { moderateScale, scale } from 'utils/metrics';

const EXAMPLE = [
  { letter: 'К', bgColor: Theme.colors.notInWordLetter },
  { letter: 'А', bgColor: Theme.colors.correctLetter },
  { letter: 'В', bgColor: Theme.colors.notInWordLetter },
  { letter: 'У', bgColor: Theme.colors.inWordLetter },
  { letter: 'Н', bgColor: Theme.colors.notInWordLetter },
];
const COLORS_HINTS = [
  { color: Theme.colors.correctLetter, hintText: RulesScreenString.FIRST_HINT },
  { color: Theme.colors.inWordLetter, hintText: RulesScreenString.SECOND_HINT },
  { color: Theme.colors.notInWordLetter, hintText: RulesScreenString.THIRD_HINT },
];

export const Example = ({ rule, index }: { rule: string; index: number }) => {
  return (
    <View style={styles.rulesContent}>
      <Text style={styles.ruleTxt}>
        {index + 1}. {rule}
      </Text>
      <View style={styles.exampleContainer}>
        {EXAMPLE.map((item, index) => (
          <ExampleLetter key={index} letter={item.letter} bgColor={item.bgColor} />
        ))}
      </View>
      <View style={styles.colorHintsContainer}>
        {COLORS_HINTS.map((item, index) => (
          <ColorHint key={index} hintText={item.hintText} bgColor={item.color} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rulesContent: {
    gap: 16,
  },
  ruleTxt: {
    textAlign: 'left',
    fontSize: moderateScale(14, 1),
    color: 'white',
    fontWeight: '500',
    fontFamily: 'JetBrainsMono-Regular',
  },
  exampleContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
  },

  colorHintsContainer: {
    alignSelf: 'flex-end',
    gap: 8,
  },
});
