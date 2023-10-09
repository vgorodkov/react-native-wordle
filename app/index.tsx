import { StyleSheet, View, ImageBackground, useWindowDimensions, Alert } from 'react-native';
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
  withTiming,
} from 'react-native-reanimated';
import { getStoredStr } from 'utils/asyncStorage';
import { scale } from 'utils/metrics';
import { Difficulty_Imgs, backgroundImage } from 'assets/imgs';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

const ANIMATION_DURATION = 40000;
const IMG_SIZE = scale(100);

const Start = () => {
  const { width } = useWindowDimensions();
  const { difficulty, isPlayable } = useDifficulty();
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

  const getDifficultyImg = (difficulty: number) => {
    switch (difficulty) {
      case 0:
        return Difficulty_Imgs.difficulty_0;
      case 1:
        return Difficulty_Imgs.difficulty_1;
      case 2:
        return Difficulty_Imgs.difficulty_2;
      case 3:
        return Difficulty_Imgs.difficulty_3;
      default:
        return Difficulty_Imgs.difficulty_0;
    }
  };

  const handlePlayBtn = () => {
    if (!isPlayable) {
      Alert.alert(
        'Абярыце іншую складанасць!',
        'Падаецца, Вы прайшлі ўсе ўзроўні на гэтай складанасці. Вы можаце выбраць іншую складанасць і працягнуць гуляць.',
        [
          {
            text: 'Выбраць складанасць',
            onPress: () => {
              router.push('difficulty');
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
      <ImageBackground resizeMode="cover" style={styles.bgImg} source={backgroundImage}>
        <Animated.Image
          style={[styles.difficultyImg, animatedImage]}
          source={getDifficultyImg(difficulty)}
        />
        <Link style={styles.playBtn} onPress={handlePlayBtn} href={!isPlayable ? '' : '/game'}>
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
    height: IMG_SIZE,
    resizeMode: 'contain',
    width: IMG_SIZE,
  },
});
