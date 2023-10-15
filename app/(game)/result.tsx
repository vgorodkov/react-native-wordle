import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import { Progressbar } from 'components/Progressbar';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { scale } from 'utils/metrics';
import { Result_Imgs, backgroundImage } from 'assets/imgs';
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
import { ResultScreenString } from 'constants/strings';
import { ROUTES } from 'constants/routes';

const { width, height } = Dimensions.get('window');
const IMG_SIZE = width > 600 ? 200 : 100;

const Result = () => {
  const { targetWord, isWordGuessed } = useLocalSearchParams();

  const dispatch = useDispatch();

  const difficulty = useSelector((state: RootState) => state.difficulty.difficulty);
  const progress = useSelector(
    (state: RootState) => state.difficulty.difficulties[difficulty].currentProgress,
  );

  const isPlayable = useSelector((state: RootState) => state.difficulty.isPlayable);
  const inUnguessed = useSelector((state: RootState) => state.difficulty.isUnguessedWords);

  const progressbarValue = useSharedValue(0);

  const totalLength = DIFFICULTIES[difficulty].length;

  useEffect(() => {
    progressbarValue.value = withSpring((progress * 100) / totalLength, { duration: 300 });
    //expo router casts boolean to string
    if (isWordGuessed === 'true') {
      dispatch(increaseProgress());
      if (inUnguessed) {
        dispatch(removeFromUnguessedWords(targetWord));
      }
    } else {
      if (!inUnguessed) {
        dispatch(addToUnguessedWords(targetWord));
      }
    }
    dispatch(setIsPlayable());
    dispatch(increaseCurrentWordIndex());
    dispatch(resetGame());
  }, []);

  const handleExit = () => {
    router.back();
  };

  const handleNextGame = () => {
    if (isPlayable) {
      router.replace(ROUTES.GAME);
    } else {
      Alert.alert(ResultScreenString.HINT_ALERT_TITLE, ResultScreenString.HINT_ALERT_TEXT, [
        {
          text: 'Выбраць складанасць',
          onPress: () => {
            router.replace(ROUTES.DIFFICULTY);
          },
        },
        {
          text: 'Ok',
          onPress: () => {
            router.back();
          },
        },
      ]);
    }
  };

  return (
    <ImageBackground style={[{ width, height }]} imageStyle={{ flex: 1 }} source={backgroundImage}>
      <StatusBar hidden />
      <View style={styles.container}>
        <View style={[styles.header]}>
          <Ionicons name="arrow-back-outline" color={'white'} size={32} onPress={handleExit} />
          <Text style={styles.headerTxt}>{DIFFICULTIES[difficulty].name}</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.mainContainer}>
          <Image
            style={{ alignSelf: 'center', width: IMG_SIZE, resizeMode: 'contain' }}
            source={isWordGuessed === 'true' ? Result_Imgs.succes : Result_Imgs.failure}
          />
          <Text
            style={[
              styles.txt,
              { alignSelf: 'center', fontFamily: 'JetBrainsMono-Medium', fontSize: 24 },
            ]}
          >
            {isWordGuessed === 'true'
              ? ResultScreenString.SUCCESS_TEXT
              : ResultScreenString.FAILURE_TEXT}
          </Text>
          <View style={styles.mainContent}>
            <Text style={styles.txt}>Правильное слово:</Text>
            <Text style={[styles.txt, styles.targetWord]}> {targetWord}</Text>
          </View>
          <Progressbar
            progress={progressbarValue}
            color="#F6E7BE"
            current={progress}
            total={totalLength}
          />
        </View>
        <View style={[styles.footer]}>
          <Pressable
            style={({ pressed }) =>
              pressed ? [styles.btn, styles.txtBtn, { opacity: 0.7 }] : [styles.btn, styles.txtBtn]
            }
            onPress={() => Linking.openURL(`https://ru.wiktionary.org/wiki/${targetWord}`)}
          >
            <Ionicons name="book-outline" color={'#F6E7BE'} size={24} />
            <Text style={[styles.btnTxt, styles.txtBtnTxt]}>Значение слова</Text>
          </Pressable>
          <Pressable
            onPress={handleNextGame}
            style={({ pressed }) =>
              pressed
                ? [styles.btn, styles.fillBtn, { opacity: 0.7 }]
                : [styles.btn, styles.fillBtn]
            }
          >
            <Ionicons name="play-circle" color={'black'} size={24} />
            <Text style={styles.btnTxt}>Играть дальше</Text>
          </Pressable>
        </View>
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
  header: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTxt: {
    color: 'black',
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 20,
    backgroundColor: '#F6E7BE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  txt: {
    color: 'white',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 20,
  },
  mainContainer: {
    gap: 16,
  },
  mainContent: {
    alignItems: 'center',
    gap: 4,
  },
  targetWord: {
    textTransform: 'uppercase',
    fontFamily: 'JetBrainsMono-Bold',
    color: '#F6E7BE',
  },
  footer: {
    width: '100%',
    gap: 8,
  },
  btn: {
    flexDirection: 'row',
    gap: 4,

    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  fillBtn: {
    backgroundColor: '#F6E7BE',
  },
  txtBtn: {
    backgroundColor: 'none',

    borderColor: '#F6E7BE',
  },

  btnTxt: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 16,
  },
  txtBtnTxt: {
    color: '#F6E7BE',
  },
  lottie: {
    position: 'absolute',
    top: -80,
  },
});
