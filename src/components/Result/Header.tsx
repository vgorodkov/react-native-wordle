import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DIFFICULTIES } from 'constants/difficulties';
import { router } from 'expo-router';
import { Difficulties } from 'redux/slices/difficultySlice';
import { LAYOUT } from 'constants/layout';
import { FONT_SIZES } from 'constants/fonts';

interface HeaderProps {
  isGuessed: boolean;
}

export const Header = ({ isGuessed }: HeaderProps) => {
  const iconName = isGuessed ? 'happy-outline' : 'sad-outline';
  const label = isGuessed ? 'Поспех!' : 'Няўдача';
  const handleExit = () => {
    router.back();
  };

  return (
    <View style={[styles.header]}>
      <Ionicons
        name="arrow-back-outline"
        color={'white'}
        size={LAYOUT.defaultIconSize}
        onPress={handleExit}
      />
      <View style={styles.headerResultLabelContainer}>
        <Ionicons name={iconName} color={'black'} size={LAYOUT.defaultIconSize} />
        <Text style={styles.headerTxt}>{label}</Text>
      </View>
      <View style={{ width: 32 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerResultLabelContainer: {
    flexDirection: 'row',
    backgroundColor: '#F6E7BE',
    paddingHorizontal: LAYOUT.defaultSpacing,
    paddingVertical: LAYOUT.smallSpacing,
    borderRadius: LAYOUT.defaultBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  headerTxt: {
    color: 'black',
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: FONT_SIZES.smallScreen.headingSmall,
  },
});
