import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { memo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { DIFFICULTIES } from 'constants/difficulties';
import { Layout } from 'constants/layout';

interface HeaderProps {
  handleHint: () => void;
}

const { width } = Dimensions.get('window');

const TITLE_SIZE = width > 600 ? 28 : 20;
const SUBTITLE_SIZE = width > 600 ? 24 : 16;
const HEADER_WIDTH = width > 600 ? '50%' : '100%';

export const Header = memo(({ handleHint }: HeaderProps) => {
  const difficulty = useSelector((state: RootState) => state.difficulty.difficulty);
  const progress = useSelector(
    (state: RootState) => state.difficulty.difficulties[difficulty].currentProgress,
  );

  const handleExitBtn = () => {
    router.back();
  };

  return (
    <View style={styles.header}>
      <Ionicons onPress={handleExitBtn} name="arrow-back-outline" size={32} color="white" />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.txt}>{DIFFICULTIES[difficulty].name}</Text>
        <Text style={styles.subTxt}>Уровень: {progress}</Text>
      </View>
      <TouchableOpacity onPress={handleHint}>
        <Image
          source={require('assets/imgs/hint_bulb.png')}
          style={{ width: 32, resizeMode: 'contain', height: 32 }}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    width: HEADER_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Layout.smallSpacing,
    flexDirection: 'row',
    paddingHorizontal: Layout.mediumSpacing,
  },
  txt: {
    fontSize: TITLE_SIZE,
    color: 'white',
    fontFamily: 'JetBrainsMono-Bold',
  },
  subTxt: {
    fontSize: SUBTITLE_SIZE,
    color: 'white',
    fontFamily: 'JetBrainsMono-Medium',
  },
  hintIcon: {
    resizeMode: 'contain',
    width: Layout.defaultIconSize,
    height: Layout.defaultIconSize,
  },
});
