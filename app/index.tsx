import { StyleSheet, View, ImageBackground, Image, useWindowDimensions } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useDifficulty } from 'components/DifficultyProvider';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { getStoredStr } from 'utils/asyncStorage';

SplashScreen.preventAutoHideAsync();

const ANIMATION_DURATION = 40000;

const Start = () => {
  const [fontsLoaded, fontError] = useFonts({
    'JetBrainsMono-Regular': require('assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Bold': require('assets/fonts/JetBrainsMono-Bold.ttf'),
    'JetBrainsMono-Medium': require('assets/fonts/JetBrainsMono-Medium.ttf'),
  });

  const { difficulty } = useDifficulty();

  const { width } = useWindowDimensions();

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  const animatedImage = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    };
  });

  useEffect(() => {
    if (fontsLoaded && !fontError) {
      translateX.value = withRepeat(
        withSequence(
          withTiming(width - 100, { duration: ANIMATION_DURATION }),
          withTiming(0, { duration: ANIMATION_DURATION }),
        ),
        -1,
      );
      translateY.value = withRepeat(
        withSequence(
          withTiming(-80, { duration: ANIMATION_DURATION }),
          withTiming(20, { duration: ANIMATION_DURATION }),
          withTiming(0, { duration: ANIMATION_DURATION }),
        ),
        -1,
      );
    }

    getStoredStr('rules-opened').then((data) => {
      if (!data && fontsLoaded && !fontError) {
        router.push('rules');
      }
    });
  }, [fontsLoaded, fontError]);

  const getDifficultyImg = (difficulty: number) => {
    switch (difficulty) {
      case 0:
        return require('assets/sun.png');
      case 1:
        return require('assets/halfmoon.png');
      case 2:
        return require('assets/moon.png');
      case 3:
        return require('assets/flower.png');
      default:
        return require('assets/sun.png');
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <ImageBackground
        resizeMode="cover"
        style={styles.bgImg}
        source={require('assets/background-stars.png')}
      />
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar translucent style="light" />

      <ImageBackground
        resizeMode="cover"
        style={styles.bgImg}
        source={require('../src/assets/background-stars.png')}
      >
        <Animated.Image
          style={[styles.difficultyImg, animatedImage]}
          source={getDifficultyImg(difficulty)}
        />
        <Link style={styles.playBtn} href={'/game'}>
          Гуляць
        </Link>
        <Link style={styles.txt} href={'/difficulty'}>
          Выбраць складанасць
        </Link>
        <Link style={styles.txt} href={'/rules'}>
          Правілы гульні
        </Link>
      </ImageBackground>
    </View>
  );
};

export default Start;

const styles = StyleSheet.create({
  container: { flex: 1 },
  playBtn: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'JetBrainsMono-Bold',
    borderBottomWidth: 4,
    borderColor: 'white',
  },
  bgImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  txt: {
    fontSize: 20,
    color: 'lightgray',
    fontFamily: 'JetBrainsMono-Bold',
  },
  difficultyImg: {
    position: 'absolute',
    top: 64,
    left: 64,
    width: 100,
    resizeMode: 'contain',
  },
});
