import { StyleSheet, Text, View, Image } from 'react-native';
import React, { memo } from 'react';

import { LAYOUT } from 'constants/layout';
import { THEME } from 'constants/theme';
import { FONT_SIZES, FONTS } from 'constants/fonts';
import { moderateScale } from 'utils/metrics';

export interface Difficultyitem {
  img: number;
  description: string;
  name: string;
}

interface DifficultyItemProps extends Difficultyitem {
  difficultyIndex: number;
  activeDifficulty: number;
}

const IMG_SIZE = moderateScale(100, 0.5);

export const DifficultyItem = memo(
  ({ description, difficultyIndex, activeDifficulty, img, name }: DifficultyItemProps) => {
    const isActive = activeDifficulty === difficultyIndex;

    return (
      <View style={styles.difficultyItemContainer}>
        <Text style={[styles.title, isActive && styles.activeTxt]}>{name}</Text>
        <View style={styles.difficultyItemContent}>
          <Image style={styles.img} source={img} />
          <Text style={[styles.body]}>{description}</Text>
        </View>
        <View />
      </View>
    );
  },
);

export default DifficultyItem;

const styles = StyleSheet.create({
  activeTxt: {
    color: 'black',
    backgroundColor: THEME.colors.primary,
    borderRadius: LAYOUT.defaultBorderRadius,
    paddingVertical: LAYOUT.smallSpacing,
    paddingHorizontal: LAYOUT.defaultSpacing,
  },
  title: {
    color: 'white',
    fontSize: FONT_SIZES.smallScreen.headingSmall,
    fontFamily: FONTS.bold,
    alignSelf: 'center',
    paddingVertical: LAYOUT.smallSpacing,
    paddingHorizontal: LAYOUT.defaultSpacing,
  },
  body: {
    color: 'white',
    textAlign: 'center',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.smallScreen.subHeading,
  },
  difficultyItemContainer: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: LAYOUT.mediumSpacing,
    justifyContent: 'space-between',
    paddingBottom: LAYOUT.smallSpacing,
    width: '80%',
  },
  difficultyItemContent: {
    gap: LAYOUT.mediumSpacing,
    alignItems: 'center',
  },
  img: {
    height: IMG_SIZE,
    marginTop: LAYOUT.mediumSpacing,
    resizeMode: 'contain',
  },
});
