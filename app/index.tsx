import React, { useCallback, useEffect } from 'react';
import { View, ImageBackground, useWindowDimensions, Alert, StyleSheet } from 'react-native';
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
import { scale } from 'utils/metrics';
import { Difficulty_Imgs, backgroundImage } from 'assets/imgs';
import { RootState } from 'redux/store';
import { getDifficultyImg } from 'utils/getImgByDifficulty';

SplashScreen.preventAutoHideAsync();

const ANIMATION_DURATION = 40000;
const IMG_SIZE = scale(100);

const PLAY_BUTTON_TEXT = 'Гуляць';
const SELECT_DIFFICULTY_TEXT = 'Выбраць складанасць';
const RULES_TEXT = 'Правілы гульні';
const DIFFICULTY_ALERT_TITLE = 'Абярыце іншую складанасць!';
const DIFFICULTY_ALERT_MESSAGE =
  'Падаецца, Вы прайшлі ўсе ўзроўні на гэтай складанасці. Вы можаце выбраць іншую складанасць і працягнуць гуляць.';

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
          withTiming(-80, { duration: ANIMATION_DURATION }),
          withTiming(20, { duration: ANIMATION_DURATION }),
          withTiming(0, { duration: ANIMATION_DURATION }),
        ),
        -1,
      );
      getStoredStr('rules-opened').then((data) => {
        if (!data) {
          router.push('rules');
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
      Alert.alert(DIFFICULTY_ALERT_TITLE, DIFFICULTY_ALERT_MESSAGE, [
        {
          text: 'Выбраць складанасць',
          onPress: () => {
            router.push('difficulty');
          },
        },
        { text: 'Ok', onPress: () => {} },
      ]);
    }
  };

  if (!fontsLoaded && !fontError) {
    return <ImageBackground resizeMode="cover" style={styles.bgImg} source={backgroundImage} />;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar hidden />
      <ImageBackground resizeMode="cover" style={styles.bgImg} source={backgroundImage}>
        <Animated.Image
          style={[styles.difficultyImg, animatedImage]}
          source={getDifficultyImg(difficulty)}
        />
        <Link style={styles.playBtn} onPress={handlePlayBtn} href={!isPlayable ? '' : '/game'}>
          {PLAY_BUTTON_TEXT}
        </Link>
        <Link style={styles.txt} href={'/difficulty'}>
          {SELECT_DIFFICULTY_TEXT}
        </Link>
        <Link style={styles.txt} href={'/rules'}>
          {RULES_TEXT}
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
    height: IMG_SIZE,
    resizeMode: 'contain',
    width: IMG_SIZE,
  },
});
