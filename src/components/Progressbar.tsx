import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { THEME } from 'constants/theme';
import { LAYOUT } from 'constants/layout';
import { FONTS, FONT_SIZES } from 'constants/fonts';

interface ProgressbarProps {
  progress?: SharedValue<number>;
  color?: string;
  current: string | number;
  total: string | number;
}

const { width } = Dimensions.get('window');
const ANIMATION_DURATION = 500;
const PROGRESS_BAR_HEIGHT = width > 600 ? 32 : 24;

export const Progressbar = ({ color = THEME.colors.primary, current, total }: ProgressbarProps) => {
  const progress = useDerivedValue(
    () =>
      withTiming((+current * 100) / +total, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    [current, total],
  );

  const progressBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  return (
    <View style={styles.progressbarContainer}>
      <Animated.View
        style={[styles.progressbar, { backgroundColor: color }, progressBarAnimatedStyle]}
      />
      <Text style={styles.progressbarLabel}>
        {current} / {total}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressbarContainer: {
    height: PROGRESS_BAR_HEIGHT,
    backgroundColor: 'gray',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: LAYOUT.defaultBorderRadius,
  },
  progressbar: {
    height: PROGRESS_BAR_HEIGHT,
    width: 0,
    borderRadius: LAYOUT.defaultBorderRadius,
  },
  progressbarLabel: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: FONT_SIZES.smallScreen.smallText,
    color: 'black',
    fontFamily: FONTS.bold,
  },
});
