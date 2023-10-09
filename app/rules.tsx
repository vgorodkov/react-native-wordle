import { ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React, { useEffect } from 'react';
import { Example } from 'components/Rules/Example';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { verticalScale } from 'utils/metrics';
import { storeStr } from 'utils/asyncStorage';

const RULES = [
  'Мы загадалі слова з 5 літар, якое Вам трэба адгадаць з 6 спроб.',
  'Увядзіце слова і яно праверыцца.',
  'Калі ўведзена існуючае слова, літары памяняюць свой колер.',
  'Вы можаце пісаць літары не па парадку, а абраць клетку і напісаць літару ў яе.',
  'Каб выдаліць літару націсніце кнопку "Выдаліць".',
  'Каб выдаліць усе слова зацісніце кнопку "Выдаліць".',
];

const Rules = () => {
  useEffect(() => {
    storeStr('true', 'rules-opened');
  }, []);
  return (
    <ImageBackground source={require('assets/imgs/background-stars.png')} style={styles.container}>
      <StatusBar translucent style="light" />
      <Link asChild href={'/'}>
        <Ionicons style={styles.backBtn} size={32} color={'white'} name="exit-outline" />
      </Link>
      <View style={[styles.rulesContent]}>
        {RULES.map((item, index) =>
          index === RULES.length - 4 ? (
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
    paddingTop: verticalScale(16),
  },
  ruleTxt: {
    textAlign: 'left',
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    fontFamily: 'JetBrainsMono-Regular',
  },
});
