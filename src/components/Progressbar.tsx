import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface ProgressbarProps {
  progress: SharedValue<number>;
  color?: string;
  current?: string | number;
  total?: string | number;
}

export const Progressbar = ({ progress, color = '#B32926', current, total }: ProgressbarProps) => {
  const progressBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progress.value}%`, { duration: 500, easing: Easing.out(Easing.cubic) }),
    };
  });
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
    backgroundColor: '#A9A9A9',
    position: 'absolute',
    width: '100%',
    borderRadius: 4,
  },
  progressbarLabel: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 12,
    color: 'white',
    fontFamily: 'JetBrainsMono-Bold',
  },
});
