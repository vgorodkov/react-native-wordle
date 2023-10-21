import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Example } from 'components/Rules/Example';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Link } from 'expo-router';

import { storeStr } from 'utils/asyncStorage';
import { backgroundImage } from 'assets/imgs';
import { RULES_SCREEN_STRING } from 'constants/strings';
import { LAYOUT } from 'constants/layout';
import { FONT_SIZES, FONTS } from 'constants/fonts';

const RULES = [
  RULES_SCREEN_STRING.firstRule,
  RULES_SCREEN_STRING.secondRule,
  RULES_SCREEN_STRING.thirdRule,
  RULES_SCREEN_STRING.fourthRule,
];

const EXAMPLE_INDEX = 2;

const Rules = () => {
  useEffect(() => {
    storeStr('true', 'rules-opened');
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <Link asChild href={'../'}>
        <Ionicons
          style={styles.backBtn}
          size={LAYOUT.defaultIconSize}
          color={'white'}
          name="exit-outline"
        />
      </Link>
      <View style={styles.rulesContent}>
        {RULES.map((item, index) =>
          index === EXAMPLE_INDEX ? (
            <Example index={index} key={index} rule={item} />
          ) : (
            <Text style={styles.ruleTxt} key={index}>
              {index + 1}. {item}
            </Text>
          ),
        )}
      </View>
    </ImageBackground>
  );
};

export default Rules;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: LAYOUT.defaultSpacing,
  },
  backBtn: {
    alignSelf: 'flex-end',
    paddingTop: LAYOUT.mediumSpacing,
  },
  rulesContent: {
    gap: LAYOUT.defaultSpacing,
    paddingTop: LAYOUT.mediumSpacing,
  },
  ruleTxt: {
    color: 'white',
    fontSize: FONT_SIZES.smallScreen.bodyText,
    fontFamily: FONTS.regular,
  },
});
