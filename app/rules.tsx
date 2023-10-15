import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Example } from 'components/Rules/Example';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { moderateScale, verticalScale } from 'utils/metrics';
import { storeStr } from 'utils/asyncStorage';
import { backgroundImage } from 'assets/imgs';
import { RulesScreenString } from 'constants/strings';

const RULES = [
  RulesScreenString.FIRST_RULE,
  RulesScreenString.SECOND_RULE,
  RulesScreenString.THIRD_RULE,
  RulesScreenString.FOURTH_RULE,
  RulesScreenString.FIFTH_RULE,
  RulesScreenString.SIXTH_RULE,
];

const DIFFICULTIES_NUM = 4;

const Rules = () => {
  useEffect(() => {
    storeStr('true', 'rules-opened');
  }, []);
  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <StatusBar translucent style="light" />
      <Link asChild href={'/'}>
        <Ionicons style={styles.backBtn} size={32} color={'white'} name="exit-outline" />
      </Link>
      <View style={[styles.rulesContent]}>
        {RULES.map((item, index) =>
          index === RULES.length - DIFFICULTIES_NUM ? (
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
    backgroundColor: 'black',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBtn: {
    alignSelf: 'flex-end',
    paddingTop: 32,
  },
  rulesContent: {
    gap: 16,
    paddingTop: 16,
  },
  ruleTxt: {
    textAlign: 'left',
    fontSize: moderateScale(14, 1),
    color: 'white',
    fontWeight: '500',
    fontFamily: 'JetBrainsMono-Regular',
  },
});
