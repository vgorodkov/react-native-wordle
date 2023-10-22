import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { ColorHint } from './ColorHints';
import { ExampleLetter } from './ExampleLetter';
import { THEME } from 'constants/theme';
import { RULES_SCREEN_STRING } from 'constants/strings';
import { FONT_SIZES, FONTS } from 'constants/fonts';
import { LAYOUT } from 'constants/layout';

const EXAMPLE = [
  { letter: 'К', bgColor: THEME.colors.notInWordLetter },
  { letter: 'А', bgColor: THEME.colors.correctLetter },
  { letter: 'В', bgColor: THEME.colors.notInWordLetter },
  { letter: 'У', bgColor: THEME.colors.inWordLetter },
  { letter: 'Н', bgColor: THEME.colors.notInWordLetter },
];

const COLORS_HINTS = [
  { color: THEME.colors.correctLetter, hintText: RULES_SCREEN_STRING.firstHint },
  { color: THEME.colors.inWordLetter, hintText: RULES_SCREEN_STRING.secondHint },
  { color: THEME.colors.notInWordLetter, hintText: RULES_SCREEN_STRING.thirdHint },
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
