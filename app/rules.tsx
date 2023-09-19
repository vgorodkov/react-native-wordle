import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Example } from 'components/Rules/Example';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { verticalScale } from 'utils/metrics';

const RULES = [
  'Мы загадалі слова з 5 літар, якое Вам трэба адгадаць з 6 спроб.',
  'Увядзіце слова і яно праверыцца.',
  'Можна ўводзіць толькі існуючыя словы.',
  'Калі ўведзена існуючае слова, літары памяняюць свой колер.',
];

const Rules = () => {
  return (
    <View style={styles.container}>
      <StatusBar translucent style="light" />
      <Link asChild href={'/'}>
        <Ionicons style={styles.backBtn} size={32} color={'white'} name="exit-outline" />
      </Link>
      <View style={styles.rulesContent}>
        {RULES.map((item, index) =>
          index === RULES.length - 1 ? (
            <Example key={index} rule={item} />
          ) : (
            <Text style={styles.ruleTxt} key={index}>
              {item}
            </Text>
          ),
        )}
      </View>
    </View>
  );
};

export default Rules;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    padding: 16,
  },
  backBtn: {
    alignSelf: 'flex-end',
    paddingTop: 32,
  },
  rulesContent: {
    gap: 16,
    paddingTop: verticalScale(32),
  },
  ruleTxt: {
    textAlign: 'left',
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    fontFamily: 'JetBrainsMono-Regular',
  },
});
