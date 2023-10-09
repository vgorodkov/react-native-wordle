import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ProgressbarProps {
  progress?: SharedValue<number>;
  color?: string;
  current: string | number;
  total: string | number;
}

export const Progressbar = ({ color = '#B32926', current, total }: ProgressbarProps) => {
  const progress = useSharedValue(0);
  const progressBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  useEffect(() => {
    progress.value = withTiming((+current * 100) / +total, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [current]);

  return (
    <View>
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
    height: 16,
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
    fontSize: 12,
    color: 'black',
    fontFamily: 'JetBrainsMono-Bold',
  },
});
