import { ImageBackground, StyleSheet, View, InteractionManager } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { moveToNextRow, resetGame, setCorrectLetters } from 'redux/slices/gameSlice';
import { Difficulties, WORDS_BY_DIFFICULTY } from 'redux/slices/difficultySlice';

import { router } from 'expo-router';
import { ROUTES } from 'constants/routes';

import CustomKeyboard from 'components/CustomKeyboard/Keyboard';
import { backgroundImage } from 'assets/imgs';

import { UNIVERSAL_STYLES } from 'constants/universalStyles';
import { Loading } from 'components/Loading';
import { Gameboard, Header } from 'components/Game';

const getCorrectLetters = (target: string, word: string) => {
  const correctLetters = ['', '', '', '', ''];
  for (let i = 0; i < target.length; i++) {
    if (target[i] === word[i]) {
      correctLetters[i] = target[i];
    }
  }
  return correctLetters;
};

const NUM_COLS = 5;
const LETTER_ANIMATION_DURATION = 300;

const Game = () => {
  const [isLoading, setIsLoading] = useState(true);

  const target = useSelector((state: RootState) => state.difficulty.currentWord);
  const isGameEnded = useSelector((state: RootState) => state.game.isGameEnded);
  const words = useSelector((state: RootState) => state.game.words);
  const word = useSelector((state: RootState) => state.game.currentWord);

  const dispatch = useDispatch();

  const wordsRef = useRef(words);

  const isWordGuessed = word === target;

  const handleGameEnd = (isGuessed: boolean) => {
    router.replace({ pathname: ROUTES.result, params: { target, isWordGuessed: isGuessed } });
    dispatch(resetGame());
  };

  if (isGameEnded) {
    setTimeout(() => handleGameEnd(isWordGuessed), LETTER_ANIMATION_DURATION * NUM_COLS);
  }

  if (isWordGuessed) {
    setTimeout(() => handleGameEnd(isWordGuessed), LETTER_ANIMATION_DURATION * NUM_COLS);
  }

  useEffect(() => {
    if (word.length === 5) {
      if (WORDS_BY_DIFFICULTY[Difficulties.Universal].includes(word)) {
        const correctLetters = getCorrectLetters(target, word);
        dispatch(setCorrectLetters(correctLetters));
        dispatch(moveToNextRow());
      }
    }
  }, [word]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ImageBackground source={backgroundImage} style={(UNIVERSAL_STYLES.fullscreen, { flex: 1 })}>
      <View style={styles.container}>
        <Header target={target} />
        <Gameboard target={target} />
        <CustomKeyboard target={target} wordsRef={wordsRef} />
      </View>
    </ImageBackground>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
