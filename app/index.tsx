import React, { useCallback, useEffect } from 'react';
import { View, ImageBackground, Alert, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  Easing,
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
import { START_SCREEN_STRING } from 'constants/strings';
import { DIFFICULTIES } from 'constants/difficulties';
import { UNIVERSAL_STYLES } from 'constants/universalStyles';
import { FONT_SIZES, FONTS } from 'constants/fonts';
import { LAYOUT } from 'constants/layout';

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');

const ANIMATION_DURATION = width > 600 ? 65000 : 40000;
const OFFSET_Y = 80;

const IMG_SIZE = width > 600 ? 200 : 100;

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
          withTiming(width - IMG_SIZE, {
            duration: ANIMATION_DURATION,
            easing: Easing.inOut(Easing.linear),
          }),
          withTiming(0, { duration: ANIMATION_DURATION, easing: Easing.inOut(Easing.linear) }),
        ),
        -1,
      );
      translateY.value = withRepeat(
        withSequence(
          withTiming(-OFFSET_Y, {
            duration: ANIMATION_DURATION,
            easing: Easing.inOut(Easing.linear),
          }),
          withTiming(OFFSET_Y, {
            duration: ANIMATION_DURATION,
            easing: Easing.inOut(Easing.linear),
          }),
          withTiming(0, { duration: ANIMATION_DURATION, easing: Easing.inOut(Easing.linear) }),
        ),
        -1,
      );
      getStoredStr('rules-opened').then((data) => {
        if (!data) {
          router.push(ROUTES.rules);
        }
      });
    }
  }, [fontsLoaded, fontError]);

  const onLAYOUTRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const handlePlayBtn = () => {
    if (!isPlayable) {
      Alert.alert(
        START_SCREEN_STRING.difficultyAlertTitle,
        START_SCREEN_STRING.difficultyAlertMessage,
        [
          {
            text: START_SCREEN_STRING.difficultyBtn,
            onPress: () => {
              router.push(ROUTES.difficulty);
            },
          },
          { text: 'Ok', onPress: () => {} },
        ],
      );
    }
  };

  if (!fontsLoaded && !fontError) {
    return (
      <ImageBackground resizeMode="cover" style={styles.rootContainer} source={backgroundImage} />
    );
  }

  return (
    <View style={styles.rootContainer} onLayout={onLAYOUTRootView}>
      <StatusBar hidden />
      <ImageBackground
        resizeMode="cover"
        style={[styles.contentContainer, UNIVERSAL_STYLES.fullscreen]}
        source={backgroundImage}
      >
        <Animated.Image
          style={[styles.difficultyImg, animatedImage]}
          source={DIFFICULTIES[difficulty].img}
        />
        <Link style={styles.playBtn} onPress={handlePlayBtn} href={!isPlayable ? '' : ROUTES.game}>
          {START_SCREEN_STRING.playBtn}
        </Link>
        <Link style={styles.txt} href={ROUTES.difficulty}>
          {START_SCREEN_STRING.difficultyBtn}
        </Link>
        <Link style={styles.txt} href={ROUTES.rules}>
          {START_SCREEN_STRING.rulesBtn}
        </Link>
      </ImageBackground>
    </View>
  );
};

export default Start;

const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: LAYOUT.defaultSpacing,
  },
  playBtn: {
    fontSize: FONT_SIZES.smallScreen.headingMedium,
    color: 'white',
    fontFamily: FONTS.bold,
    borderBottomWidth: 4,
    borderColor: 'white',
  },
  txt: {
    fontSize: FONT_SIZES.smallScreen.headingSmall,
    color: 'lightgray',
    fontFamily: FONTS.bold,
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
