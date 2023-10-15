import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Theme } from 'constants/theme';

interface ProgressbarProps {
  progress?: SharedValue<number>;
  color?: string;
  current: string | number;
  total: string | number;
}

const { width, height } = Dimensions.get('window');
const ANIMATION_DURATION = 500;
const PROGRESS_BAR_HEIGHT = width > 600 ? 24 : 16;
const PROGRESS_BAR_FONT_SIZE = width > 600 ? 16 : 12;

export const Progressbar = ({ color = Theme.colors.primary, current, total }: ProgressbarProps) => {
  const progress = useSharedValue(0);
  const progressBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  useEffect(() => {
    progress.value = withTiming((+current * 100) / +total, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [current]);

  return (
    <View style={{ justifyContent: 'center' }}>
      <View style={[styles.progressbar, styles.backgroundProgressbar]} />
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
  progressbar: {
    height: PROGRESS_BAR_HEIGHT,
    borderRadius: 4,
  },
  backgroundProgressbar: {
    backgroundColor: 'gray',
    position: 'absolute',
    width: '100%',
    borderRadius: 4,
  },
  progressbarLabel: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: PROGRESS_BAR_FONT_SIZE,
    color: 'black',
    fontFamily: 'JetBrainsMono-Bold',
  },
});
