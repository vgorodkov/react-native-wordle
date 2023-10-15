import { Alert, Dimensions, ImageBackground, StyleSheet, View, Platform } from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import { backgroundImage } from 'assets/imgs';
import { Header } from 'components/Header';
import { Row } from 'components/Game/WordRow';
import { router } from 'expo-router';
import {
  moveToNextRow,
  resetGame,
  setCorrectLetters,
  setHintWasUsed,
} from 'redux/slices/gameSlice';
import { Difficulties, WORDS_BY_DIFFICULTY } from 'redux/slices/difficultySlice';
import CustomKeyboard from 'components/CustomKeyboard/Keyboard';
import { ROUTES } from 'constants/routes';
import { GameScreenString } from 'constants/strings';
import { Layout } from 'constants/layout';

const getCorrectLetters = (target: string, word: string) => {
  const correctLetters = ['', '', '', '', ''];
  for (let i = 0; i < target.length; i++) {
    if (target[i] === word[i]) {
      correctLetters[i] = target[i];
    }
  }
  return correctLetters;
};

const { width, height } = Dimensions.get('window');

const NUM_ROWS = 6;
const NUM_COLS = 5;

const Game = () => {
  const INITIAL_EMPTY_WORDS = useMemo(
    () => Array.from({ length: NUM_ROWS }, () => Array.from({ length: NUM_COLS }, () => '')),
    [],
  );

  const dispatch = useDispatch();

  const currentRow = useSelector((state: RootState) => state.game.currentRow);
  const currentCol = useSelector((state: RootState) => state.game.currentCol);
  const targetWord = useSelector((state: RootState) => state.difficulty.currentWord);
  const isGameEnded = useSelector((state: RootState) => state.game.isGameEnded);
  const words = useSelector((state: RootState) => state.game.words);
  const word = useSelector((state: RootState) => state.game.currentWord);
  const correctLetters = useSelector((state: RootState) => state.game.correctLetters);
  const hintWasUsed = useSelector((state: RootState) => state.game.hintWasUsed);

  const isWordGuessed = word === targetWord;

  const wordsRef = useRef(words);
  console.log(targetWord);

  const handleGameEnd = (isGuessed: boolean) => {
    router.replace({ pathname: ROUTES.RESULT, params: { targetWord, isWordGuessed: isGuessed } });
    dispatch(resetGame());
  };

  const handleHint = () => {
    if (!hintWasUsed) {
      const updatedCorrectLetters = [...correctLetters];
      const letterToShow = targetWord[currentCol];
      updatedCorrectLetters[currentCol] = letterToShow;
      dispatch(setCorrectLetters(updatedCorrectLetters));
      dispatch(setHintWasUsed());
    } else {
      Alert.alert(GameScreenString.HINT_ALERT_TITLE, GameScreenString.HINT_ALERT_TEXT);
    }
  };

  if (isGameEnded) {
    setTimeout(() => handleGameEnd(false), 300 * NUM_COLS);
  }

  if (isWordGuessed) {
    setTimeout(() => handleGameEnd(true), 300 * NUM_COLS);
  }

  useEffect(() => {
    if (word.length === 5) {
      if (WORDS_BY_DIFFICULTY[Difficulties.Universal].includes(word)) {
        const correctLetters = getCorrectLetters(targetWord, word);
        dispatch(setCorrectLetters(correctLetters));
        dispatch(moveToNextRow());
      } else {
      }
    }
  }, [word]);

  return (
    <ImageBackground source={backgroundImage} style={[styles.container, { width, height }]}>
      <Header handleHint={handleHint} />
      <View>
        {INITIAL_EMPTY_WORDS.map((item, index) => (
          <Row
            target={targetWord}
            currentCol={currentRow === index ? currentCol : -1}
            isActive={currentRow === index}
            key={index}
            letters={item}
            rowIndex={index}
          />
        ))}
      </View>
      <CustomKeyboard target={targetWord} wordsRef={wordsRef} />
    </ImageBackground>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
});
