import { Alert, ImageBackground, Linking, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';

import { useLocalSearchParams } from 'expo-router';

import { Progressbar } from 'components/Progressbar';
import { useSharedValue, withSpring } from 'react-native-reanimated';

import { backgroundImage } from 'assets/imgs';
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
import { FONTS, FONT_SIZES } from 'constants/fonts';
import { getStoredStr, storeStr } from 'utils/asyncStorage';

const Emoji = ({ isGuessed }: { isGuessed: boolean }) => {
  if (isGuessed) {
    return <Text>&#x1F642;</Text>;
  } else {
    return <Text>&#x1F625;</Text>;
  }
};

const ASYNC_RATED_STRING = 'hasRated'; //whether the user rate the app at play store

const PLAYSTORE_LINK = 'https://play.google.com/store/apps/details?id=com.tragediabelok.wordle';

const Result = () => {
  const { target, isWordGuessed } = useLocalSearchParams();

  const difficulty = useSelector((state: RootState) => state.difficulty.difficulty);
  const progress = useSelector(
    (state: RootState) => state.difficulty.difficulties[difficulty].currentProgress,
  );
  const inUnguessed = useSelector((state: RootState) => state.difficulty.isUnguessedWords);

  const dispatch = useDispatch();

  const progressbarValue = useSharedValue(0);
  const totalLength = DIFFICULTIES[difficulty].length;
  const isEachFive = progress % 5 === 0;

  useEffect(() => {
    getStoredStr(ASYNC_RATED_STRING).then((data) => {
      if (!data && isEachFive && isWordGuessed) {
        Alert.alert(
          'Ёсць хвілінка?',
          'Ацэніце, калі ласка, гульню на старонцы Google Play',
          [
            {
              text: 'Пазней',
            },
            {
              text: 'Ацаніць',
              onPress: () => {
                Linking.openURL(PLAYSTORE_LINK);
                storeStr('true', ASYNC_RATED_STRING);
              },
            },
          ],
          {
            cancelable: true,
          },
        );
      }
    });
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
    <ImageBackground style={{ flex: 1 }} source={backgroundImage}>
      <View style={styles.container}>
        <Header isGuessed={isWordGuessed === 'true'} />
        <View style={styles.mainContainer}>
          <Text style={[styles.txt, styles.title]}>
            {isWordGuessed === 'true' ? RESULT_SCREEN_STRING.success : RESULT_SCREEN_STRING.failure}
            <Emoji isGuessed={isWordGuessed === 'true'} />
          </Text>
          <View style={styles.mainContent}>
            <Text style={[styles.txt, styles.targetWord]}>{target}</Text>
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

  txt: {
    color: 'white',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.smallScreen.subHeading,
    textAlign: 'center',
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.smallScreen.headingMedium,
  },
  mainContainer: {
    gap: 16,
  },
  mainContent: {
    alignItems: 'center',
  },
  targetWord: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.smallScreen.headingMedium,
    textTransform: 'uppercase',
    color: '#F6E7BE',
  },
});
