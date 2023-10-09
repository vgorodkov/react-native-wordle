import { StyleSheet, Text, View, Image } from 'react-native';
import React, { memo } from 'react';

import { Theme } from 'assets/theme';
import { Layout } from 'constants/layout';
import { scale } from 'utils/metrics';

export interface Difficultyitem {
  img: number;
  description: string;
  name: string;
}

interface DifficultyItemProps extends Difficultyitem {
  difficultyIndex: number;
  activeDifficulty: number;
}

const IMG_SIZE = scale(100);

export const DifficultyItem = memo(
  ({ description, difficultyIndex, activeDifficulty, img, name }: DifficultyItemProps) => {
    const isActive = activeDifficulty === difficultyIndex;

    return (
      <View style={styles.difficultyItemContainer}>
        <Text style={[styles.title, styles.txt, isActive && styles.activeTxt]}>{name}</Text>
        <View style={styles.difficultyItemContent}>
          <Image style={styles.img} source={img} />
          <Text style={[styles.txt, styles.body]}>{description}</Text>
        </View>
        <View />
      </View>
    );
  },
);

export default DifficultyItem;

const styles = StyleSheet.create({
  txt: {
    color: 'white',
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeTxt: {
    color: 'black',
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    alignSelf: 'center',
  },
  body: {
    fontSize: 18,
    fontWeight: '500',
  },
  difficultyItemContainer: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: Layout.mediumPadding,
    justifyContent: 'space-between',
    paddingBottom: Layout.smallPadding,

    width: '80%',
  },
  difficultyItemContent: {
    gap: Layout.mediumPadding,
    alignItems: 'center',
  },
  img: {
    height: IMG_SIZE,
    marginTop: Layout.mediumPadding,
    resizeMode: 'contain',
  },
});
