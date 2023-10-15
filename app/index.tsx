import React, { useCallback, useEffect } from 'react';
import { View, ImageBackground, Alert, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { getStoredStr } from 'utils/asyncStorage';
import { backgroundImage } from 'assets/imgs';
import { RootState } from 'redux/store';

import { ROUTES } from 'constants/routes';
import { StartScreenString } from 'constants/strings';
import { DIFFICULTIES } from 'constants/difficulties';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

const ANIMATION_DURATION = width > 600 ? 65000 : 40000;
const IMG_SIZE = width > 600 ? 200 : 100;
const OFFSET_Y = 80;
const PLAY_BTN_FONT_SIZE = width > 600 ? 32 : 24;
const OTHER_BTN_FONT_SIZE = width > 600 ? 28 : 20;

const Start = () => {
  const difficulty = useSelector((state: RootState) => state.difficulty.difficulty);
  const isPlayable = useSelector((state: RootState) => state.difficulty.isPlayable);

  const [fontsLoaded, fontError] = useFonts({
    'JetBrainsMono-Regular': require('assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Bold': require('assets/fonts/JetBrainsMono-Bold.ttf'),
    'JetBrainsMono-Medium': require('assets/fonts/JetBrainsMono-Medium.ttf'),
  });

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
          withTiming(width - IMG_SIZE, { duration: ANIMATION_DURATION }),
          withTiming(0, { duration: ANIMATION_DURATION }),
        ),
        -1,
      );
      translateY.value = withRepeat(
        withSequence(
          withTiming(-OFFSET_Y, { duration: ANIMATION_DURATION }),
          withTiming(OFFSET_Y, { duration: ANIMATION_DURATION }),
          withTiming(0, { duration: ANIMATION_DURATION }),
        ),
        -1,
      );
      getStoredStr('rules-opened').then((data) => {
        if (!data) {
          router.push(ROUTES.RULES);
        }
      });
    }
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const handlePlayBtn = () => {
    if (!isPlayable) {
      Alert.alert(
        StartScreenString.DIFFICULTY_ALERT_TITLE,
        StartScreenString.DIFFICULTY_ALERT_MESSAGE,
        [
          {
            text: StartScreenString.DIFFICULTY_BTN_TEXT,
            onPress: () => {
              router.push(ROUTES.DIFFICULTY);
            },
          },
          { text: 'Ok', onPress: () => {} },
        ],
      );
    }
  };

  if (!fontsLoaded && !fontError) {
    return <ImageBackground resizeMode="cover" style={styles.bgImg} source={backgroundImage} />;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar hidden />
      <ImageBackground
        resizeMode="cover"
        style={[styles.bgImg, { width, height }]}
        source={backgroundImage}
      >
        <Animated.Image
          style={[styles.difficultyImg, animatedImage]}
          source={DIFFICULTIES[difficulty].img}
        />
        <Link style={styles.playBtn} onPress={handlePlayBtn} href={!isPlayable ? '' : ROUTES.GAME}>
          {StartScreenString.PLAY_BTN_TEXT}
        </Link>
        <Link style={styles.txt} href={ROUTES.DIFFICULTY}>
          {StartScreenString.DIFFICULTY_BTN_TEXT}
        </Link>
        <Link style={styles.txt} href={ROUTES.RULES}>
          {StartScreenString.RULES_BTN_TEXT}
        </Link>
      </ImageBackground>
    </View>
  );
};

export default Start;

const styles = StyleSheet.create({
  container: { flex: 1 },
  playBtn: {
    fontSize: PLAY_BTN_FONT_SIZE,
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
    fontSize: OTHER_BTN_FONT_SIZE,
    color: 'lightgray',
    fontFamily: 'JetBrainsMono-Bold',
  },
  difficultyImg: {
    position: 'absolute',
    top: 64,
    left: 64,
    height: IMG_SIZE,
    resizeMode: 'contain',
    width: IMG_SIZE,
  },
});
