import { Alert, ImageBackground, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { removeValue } from 'utils/asyncStorage';

import LottieView from 'lottie-react-native';
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

const Result = () => {
  const { targetWord, isWordGuessed } = useLocalSearchParams();
  const difficulty = useSelector((state: RootState) => state.difficulty.difficulty);

  const progress = useSelector(
    (state: RootState) => state.difficulty.difficulties[difficulty].currentProgress,
  );
  const dispatch = useDispatch();

  const isPlayable = useSelector((state: RootState) => state.difficulty.isPlayable);
  const inUnguessed = useSelector((state: RootState) => state.difficulty.isUnguessedWords);

  const totalLength = 418;
  const progressbarValue = useSharedValue(0);

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
      router.replace('/game');
    } else {
      Alert.alert(
        'Абярыце іншую складанасць!',
        'Падаецца, Вы прайшлі ўсе ўзроўні на гэтай складанасці. Вы можаце выбраць іншую складанасць і працягнуць гуляць.',
        [
          {
            text: 'Выбраць складанасць',
            onPress: () => {
              router.replace('difficulty');
            },
          },
          {
            text: 'Ok',
            onPress: () => {
              router.back();
            },
          },
        ],
      );
    }
  };

  return (
    <ImageBackground style={styles.container} imageStyle={{ flex: 1 }} source={backgroundImage}>
      <StatusBar hidden />
      {isWordGuessed === 'true' && (
        <LottieView
          style={{ position: 'absolute', top: -100 }}
          source={require('assets/lotties/animation.json')}
          loop={false}
          autoPlay
        />
      )}
      <View style={styles.header}>
        <Ionicons name="arrow-back-outline" color={'white'} size={32} onPress={handleExit} />
        <Text style={styles.headerTxt}>Лёгкая</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.mainContainer}>
        <Image
          style={{ alignSelf: 'center', width: scale(100), height: scale(100), aspectRatio: 1 }}
          source={isWordGuessed === 'true' ? Result_Imgs.succes : Result_Imgs.failure}
        />
        <Text
          style={[
            styles.txt,
            { alignSelf: 'center', fontFamily: 'JetBrainsMono-Medium', fontSize: 24 },
          ]}
        >
          {isWordGuessed === 'true' ? 'Вы прайшлі!' : 'Вы не прайшлі!'}
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
      <View style={styles.footer}>
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
            pressed ? [styles.btn, styles.fillBtn, { opacity: 0.7 }] : [styles.btn, styles.fillBtn]
          }
        >
          <Ionicons name="play-circle" color={'black'} size={24} />
          <Text style={styles.btnTxt}>Играть дальше</Text>
        </Pressable>
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
});
