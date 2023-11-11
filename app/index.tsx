import React, { useCallback, useEffect } from 'react';
import { View, ImageBackground, Alert, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { Link, router } from 'expo-router';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { backgroundImage } from 'assets/imgs';

import { getStoredStr } from 'utils/asyncStorage';
import { scale } from 'utils/metrics';

import { ROUTES } from 'constants/routes';
import { START_SCREEN_STRING } from 'constants/strings';
import { UNIVERSAL_STYLES } from 'constants/universalStyles';
import { FONTS, FONT_SIZES } from 'constants/fonts';
import { LAYOUT } from 'constants/layout';
import { DIFFICULTIES } from 'constants/difficulties';
import { StatusBar } from 'expo-status-bar';
import { Loading } from 'components/Loading';

SplashScreen.preventAutoHideAsync(); //prevent while fonts are loading

const OFFSET_Y = 80;
const IMG_SIZE = scale(100);

const ANIMATION_DURATION = 35000;

const Start = () => {
  const { width } = useWindowDimensions();

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

  //image animation on main screen.
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

  const onLayoutRootView = useCallback(async () => {
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
    return <Loading />;
  }

  return (
    <View style={styles.rootContainer} onLayout={onLayoutRootView}>
      <StatusBar hidden />
      <ImageBackground resizeMode="cover" style={styles.contentContainer} source={backgroundImage}>
        <Animated.Image
          style={[styles.difficultyImg, animatedImage]}
          source={DIFFICULTIES[difficulty].img}
        />

        <Link
          testID="play-btn"
          style={styles.playBtn}
          onPress={handlePlayBtn}
          href={!isPlayable ? '' : ROUTES.game}
        >
          {START_SCREEN_STRING.playBtn}
        </Link>
        <Link style={styles.txtBtn} href={ROUTES.difficulty}>
          {START_SCREEN_STRING.difficultyBtn}
        </Link>
        <Link style={styles.txtBtn} href={ROUTES.rules}>
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
  txtBtn: {
    fontSize: FONT_SIZES.smallScreen.subHeading,
    color: 'lightgray',
    fontFamily: FONTS.bold,
  },
  difficultyImg: {
    position: 'absolute',
    top: 64,
    left: 64,
    width: IMG_SIZE,
    height: IMG_SIZE,
    resizeMode: 'contain',
  },
});
