import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { DIFFICULTIES_SCREEN_STRING } from 'constants/strings';
import { LAYOUT } from 'constants/layout';
import { THEME } from 'constants/theme';
import { FONTS, FONT_SIZES } from 'constants/fonts';
import { useDispatch } from 'react-redux';
import { changeDifficulty } from 'redux/slices/difficultySlice';

export const Footer = ({
  isCurrentDifficulty,
  listIndex,
}: {
  isCurrentDifficulty: boolean;
  listIndex: number;
}) => {
  const dispatch = useDispatch();

  const chooseDifficulty = () => {
    dispatch(changeDifficulty(listIndex));
  };

  return (
    <View style={styles.btnContainer}>
      <Pressable
        style={({ pressed }) =>
          isCurrentDifficulty
            ? [styles.btn, styles.disabledBtn]
            : [styles.btn, { opacity: pressed ? 0.7 : 1 }]
        }
        disabled={isCurrentDifficulty}
        onPress={chooseDifficulty}
      >
        <Text style={[styles.btnText]}>{DIFFICULTIES_SCREEN_STRING.chooseBtn}</Text>
      </Pressable>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  btnContainer: {
    paddingHorizontal: LAYOUT.mediumSpacing,
  },
  btn: {
    paddingHorizontal: LAYOUT.mediumSpacing,
    paddingVertical: LAYOUT.smallSpacing,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: THEME.colors.primary,
    borderRadius: LAYOUT.defaultBorderRadius,
  },
  disabledBtn: {
    borderColor: THEME.colors.disabled,
    backgroundColor: THEME.colors.disabled,
  },
  btnText: {
    fontSize: FONT_SIZES.smallScreen.bodyText,
    fontFamily: FONTS.bold,
    color: 'black',
    textAlign: 'center',
  },
});
