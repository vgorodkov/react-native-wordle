import { ImageBackground, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect } from 'react';

import { useLocalSearchParams } from 'expo-router';

import { Progressbar } from 'components/Progressbar';
import { useSharedValue, withSpring } from 'react-native-reanimated';

import { Happy_Faces_Imgs, Result_Imgs, Unhappy_Faces_Imgs, backgroundImage } from 'assets/imgs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import {
  addToUnguessedWords,
  increaseCurrentWordIndex,
  increaseProgress,
  removeFromUnguessedWords,
  setIsPlayable,
} from 'redux/slices/difficultySlice';
import { resetGame } from 'redux/slices/gameSlice';
import { DIFFICULTIES } from 'constants/difficulties';
import { RESULT_SCREEN_STRING } from 'constants/strings';
import { Header } from 'components/Result/Header';
import { Footer } from 'components/Result/Footer';
import { UNIVERSAL_STYLES } from 'constants/universalStyles';
import { FONTS } from 'constants/fonts';
import { getRandomImg } from 'utils/getRandom';

const Result = () => {
  const { target, isWordGuessed } = useLocalSearchParams();

  const dispatch = useDispatch();

  const difficulty = useSelector((state: RootState) => state.difficulty.difficulty);
  const progress = useSelector(
    (state: RootState) => state.difficulty.difficulties[difficulty].currentProgress,
  );
  const inUnguessed = useSelector((state: RootState) => state.difficulty.isUnguessedWords);

  const progressbarValue = useSharedValue(0);

  const totalLength = DIFFICULTIES[difficulty].length;

  useEffect(() => {
    progressbarValue.value = withSpring((progress * 100) / totalLength, { duration: 300 });
    //expo router casts boolean to string
    if (isWordGuessed === 'true') {
      dispatch(increaseProgress());
      if (inUnguessed) {
        dispatch(removeFromUnguessedWords(target));
      }
    } else {
      if (!inUnguessed) {
        dispatch(addToUnguessedWords(target));
      }
    }
    dispatch(setIsPlayable());
    dispatch(increaseCurrentWordIndex());
    dispatch(resetGame());
  }, []);

  return (
    <ImageBackground
      style={UNIVERSAL_STYLES.fullscreen}
      imageStyle={{ flex: 1 }}
      source={backgroundImage}
    >
      <View style={styles.container}>
        <Header difficulty={difficulty} />
        <View style={styles.mainContainer}>
          <Image
            style={styles.mainImg}
            source={
              isWordGuessed === 'true'
                ? getRandomImg(Happy_Faces_Imgs)
                : getRandomImg(Unhappy_Faces_Imgs)
            }
          />
          <Text style={[styles.txt, styles.title]}>
            {isWordGuessed === 'true' ? RESULT_SCREEN_STRING.success : RESULT_SCREEN_STRING.failure}
          </Text>
          <View style={styles.mainContent}>
            <Text style={styles.txt}>{RESULT_SCREEN_STRING.correctWord}</Text>
            <Text style={[styles.txt, styles.targetWord]}> {target}</Text>
          </View>
          <Progressbar
            progress={progressbarValue}
            color="#F6E7BE"
            current={progress}
            total={totalLength}
          />
        </View>
        <Footer target={target} />
      </View>
    </ImageBackground>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: 24,
  },
  mainImg: { alignSelf: 'center', width: 100, height: 100, resizeMode: 'contain' },
  txt: {
    color: 'white',
    fontFamily: FONTS.regular,
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 24,
  },
  mainContainer: {
    gap: 16,
  },
  mainContent: {
    alignItems: 'center',
    gap: 4,
  },
  targetWord: {
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    color: '#F6E7BE',
  },
});
