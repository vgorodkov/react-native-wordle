import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router } from 'expo-router';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { DIFFICULTIES } from 'constants/difficulties';
import { LAYOUT } from 'constants/layout';
import { setCorrectLetters, setHintWasUsed } from 'redux/slices/gameSlice';
import { GAME_SCREEN_STRING } from 'constants/strings';
import { Theme } from 'constants/theme';

interface HeaderProps {
  target: string;
}

export const Header = ({ target }: HeaderProps) => {
  const difficulty = useSelector((state: RootState) => state.difficulty.difficulty);
  const progress = useSelector(
    (state: RootState) => state.difficulty.difficulties[difficulty].currentProgress,
  );
  const hintWasUsed = useSelector((state: RootState) => state.game.hintWasUsed);
  const currentCol = useSelector((state: RootState) => state.game.currentCol);
  const correctLetters = useSelector((state: RootState) => state.game.correctLetters);

  const dispatch = useDispatch();

  const handleHint = () => {
    if (!hintWasUsed) {
      const updatedCorrectLetters = [...correctLetters];
      const letterToShow = target[currentCol];
      updatedCorrectLetters[currentCol] = letterToShow;
      dispatch(setCorrectLetters(updatedCorrectLetters));
      dispatch(setHintWasUsed());
    } else {
      Alert.alert(GAME_SCREEN_STRING.hintAlertTitle, GAME_SCREEN_STRING.hintAlertMessage);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.iconsContainer}>
        <Link asChild href={'../'}>
          <Ionicons name="arrow-back-outline" size={LAYOUT.defaultIconSize} color="white" />
        </Link>
        <View style={{ width: LAYOUT.defaultIconSize }} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.txt}>{DIFFICULTIES[difficulty].name}</Text>
        <Text style={styles.subTxt}>Узровень: {progress}</Text>
      </View>
      <View style={styles.iconsContainer}>
        <Link asChild href={'rules'}>
          <Ionicons name="help-circle-outline" color={Theme.colors.primary} size={32} />
        </Link>
        <TouchableOpacity onPress={handleHint}>
          <Image source={require('assets/imgs/hint_bulb.png')} style={styles.hintIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: LAYOUT.defaultSpacing,
    flexDirection: 'row',
    paddingHorizontal: LAYOUT.mediumSpacing,
  },
  txt: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'JetBrainsMono-Bold',
  },
  subTxt: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'JetBrainsMono-Medium',
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  hintIcon: {
    width: LAYOUT.defaultIconSize,
    resizeMode: 'contain',
    height: LAYOUT.defaultIconSize,
  },
});
