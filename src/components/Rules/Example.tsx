import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { ColorHint } from './ColorHints';
import { ExampleLetter } from './ExampleLetter';
import { Theme } from 'constants/theme';
import { RULES_SCREEN_STRING } from 'constants/strings';
import { moderateScale, scale } from 'utils/metrics';
import { FONT_SIZES, FONTS } from 'constants/fonts';
import { LAYOUT } from 'constants/layout';

const EXAMPLE = [
  { letter: 'К', bgColor: Theme.colors.notInWordLetter },
  { letter: 'А', bgColor: Theme.colors.correctLetter },
  { letter: 'В', bgColor: Theme.colors.notInWordLetter },
  { letter: 'У', bgColor: Theme.colors.inWordLetter },
  { letter: 'Н', bgColor: Theme.colors.notInWordLetter },
];
const COLORS_HINTS = [
  { color: Theme.colors.correctLetter, hintText: RULES_SCREEN_STRING.firstHint },
  { color: Theme.colors.inWordLetter, hintText: RULES_SCREEN_STRING.secondHint },
  { color: Theme.colors.notInWordLetter, hintText: RULES_SCREEN_STRING.thirdHint },
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
    gap: LAYOUT.defaultSpacing,
  },
  ruleTxt: {
    color: 'white',
    fontSize: FONT_SIZES.smallScreen.bodyText,
    fontFamily: FONTS.regular,
  },
  exampleContainer: {
    paddingVertical: LAYOUT.smallSpacing,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: LAYOUT.smallSpacing,
  },
  colorHintsContainer: {
    alignSelf: 'flex-end',
    gap: LAYOUT.smallSpacing,
  },
});
