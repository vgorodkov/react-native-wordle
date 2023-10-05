import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { getStoredStr, removeValue, storeStr } from 'utils/asyncStorage';
import { EASY_NOUNS, useDifficulty } from 'components/DifficultyProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';
import { Progressbar } from 'components/Progressbar';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

const Result = () => {
  const { target, isWordGuessed } = useLocalSearchParams();

  const { difficulty, setProgress, progress } = useDifficulty();
  const totalLength = EASY_NOUNS.length;
  const progressbarValue = useSharedValue(0);

  useEffect(() => {
    removeValue('words');
    if (isWordGuessed) {
      setProgress(progress + 1);
      AsyncStorage.setItem(`difficulty-${difficulty}-progress`, (progress + 1).toString());
    }
    progressbarValue.value = withSpring((progress * 100) / totalLength, { duration: 300 });
  }, []);

  const handleExit = () => {
    router.back();
  };

  return (
    <ImageBackground
      style={styles.container}
      imageStyle={{ flex: 1 }}
      source={require('assets/background-stars.png')}
    >
      <StatusBar hidden />
      <LottieView
        style={{ position: 'absolute', top: -100 }}
        source={require('assets/animation.json')}
        loop={false}
        autoPlay
      />
      <View style={styles.header}>
        <Ionicons name="arrow-back-outline" color={'white'} size={32} onPress={handleExit} />
        <Text style={styles.headerTxt}>Лёгкая</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.mainContainer}>
        <Text
          style={[
            styles.txt,
            { alignSelf: 'center', fontFamily: 'JetBrainsMono-Medium', fontSize: 24 },
          ]}
        >
          Вы прошли!
        </Text>
        <View style={styles.mainContent}>
          <Text style={styles.txt}>Правильное слово:</Text>
          <Text style={[styles.txt, styles.targetWord]}> {target}</Text>
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
          onPress={() => Linking.openURL(`https://ru.wiktionary.org/wiki/${target}`)}
        >
          <Ionicons name="book-outline" color={'#F6E7BE'} size={24} />
          <Text style={[styles.btnTxt, styles.txtBtnTxt]}>Значение слова</Text>
        </Pressable>
        <Pressable
          onPress={() => router.replace('/game')}
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
