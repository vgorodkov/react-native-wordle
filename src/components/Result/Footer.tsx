import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { RESULT_SCREEN_STRING, START_SCREEN_STRING } from 'constants/strings';
import { ROUTES } from 'constants/routes';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { LAYOUT } from 'constants/layout';
import { THEME } from 'constants/theme';
import { moderateScale } from 'utils/metrics';
import { FONT_SIZES } from 'constants/fonts';

interface BtnProps {
  onPress?: () => void;
  variant: 'text' | 'filled';
  label: string;
  iconName?: 'book-outline' | 'play-circle';
  iconColor?: string;
  iconSize?: number;
}

const Btn = ({
  onPress,
  variant = 'filled',
  iconColor = 'white',
  iconName,
  iconSize = LAYOUT.defaultIconSize,
  label = 'Button',
}: BtnProps) => {
  const btnStyles =
    variant === 'filled' ? [styles.btn, styles.fillBtn] : [styles.btn, styles.txtBtn];
  const txtStyles = variant === 'filled' ? styles.btnTxt : [styles.txtBtnTxt, styles.btnTxt];

  return (
    <Pressable
      style={({ pressed }) => (pressed ? [btnStyles, { opacity: 0.7 }] : btnStyles)}
      onPress={onPress}
    >
      {iconName && <Ionicons name={iconName} color={iconColor} size={iconSize} />}
      <Text style={txtStyles}>{label}</Text>
    </Pressable>
  );
};

export const Footer = ({ target }: { target: string }) => {
  const isPlayable = useSelector((state: RootState) => state.difficulty.isPlayable);

  const handleNextGame = () => {
    if (isPlayable) {
      router.replace(ROUTES.game);
    } else {
      Alert.alert(
        START_SCREEN_STRING.difficultyAlertTitle,
        START_SCREEN_STRING.difficultyAlertMessage,
        [
          {
            text: 'Выбраць складанасць',
            onPress: () => {
              router.replace(ROUTES.difficulty);
            },
          },
          {
            text: 'Ok',
            onPress: () => {
              router.back();
            },
          },
        ],
      );
    }
  };

  const openWikiWordDefinition = () => {
    Linking.openURL(`https://ru.wiktionary.org/wiki/${target}`);
  };

  return (
    <View style={[styles.footer]}>
      <Btn
        variant="text"
        label={RESULT_SCREEN_STRING.definitionBtn}
        iconName="book-outline"
        iconColor={THEME.colors.primary}
        iconSize={LAYOUT.smallIconSize}
        onPress={openWikiWordDefinition}
      />
      <Btn
        variant="filled"
        label={RESULT_SCREEN_STRING.nextBtn}
        iconName="play-circle"
        iconColor="black"
        iconSize={LAYOUT.smallIconSize}
        onPress={handleNextGame}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
  },
  btn: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: LAYOUT.defaultBorderRadius,
  },
  fillBtn: {
    backgroundColor: '#F6E7BE',
  },
  txtBtn: {
    backgroundColor: 'none',
    borderColor: '#F6E7BE',
  },
  btnTxt: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: FONT_SIZES.smallScreen.bodyText,
  },
  txtBtnTxt: {
    color: '#F6E7BE',
  },
});
