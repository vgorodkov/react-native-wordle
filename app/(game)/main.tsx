import {
  StyleSheet,
  View,
  ImageBackground,
  InteractionManager,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useSharedValue } from 'react-native-reanimated';

import { router } from 'expo-router';
import { WordRow } from 'components/WordRow';
import { getRandomWord } from 'utils/getRandomWord';

import { StatusBar } from 'expo-status-bar';
import CustomKeyboard from 'components/Keyboard';
import { verticalScale } from 'utils/metrics';

const NUM_ROWS = 6;
const ROW_LENGTH = 5;
const ANIMATION_DURATION = 300;

const GameScreen = () => {
  const WORDS = require('../../src/data/be-5.json');
  const [isLoading, setIsLoading] = useState(true);
  const [target, setTarget] = useState(getRandomWord(WORDS));
  const [wordRows, setWordRows] = useState(['', '', '', '', '', '']);

  const activeRow = useRef(0);

  const usedLetters = useSharedValue<string>('');
  const shouldCheck = useSharedValue(false);

  const isReadyToCheck =
    wordRows[activeRow.current].length === 5 && WORDS.includes(wordRows[activeRow.current]);

  const isGameEnded = activeRow.current === 5 || wordRows[activeRow.current] === target;

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsLoading(false);
    });
  }, []);
  if (wordRows[activeRow.current].length > 4) {
    usedLetters.value = wordRows[activeRow.current];
  }

  const onKeyboardLetterPress = useCallback((letter: string) => {
    setWordRows((prevRow) => {
      if (prevRow[activeRow.current].length < 5) {
        const updatedWord = [...prevRow];
        updatedWord[activeRow.current] += letter;
        return updatedWord;
      } else {
        return prevRow;
      }
    });
  }, []);

  const handleLetterDelete = useCallback((letterIndex: number, rowIndex: number) => {
    //check if pressed row is active
    if (rowIndex === activeRow.current) {
      setWordRows((prevRows) => {
        const updatedRows = [...prevRows];
        const currentRow = updatedRows[activeRow.current];
        updatedRows[activeRow.current] = currentRow.slice(0, letterIndex);
        return updatedRows;
      });
    }
  }, []);

  const handleGameEnd = () => {
    router.replace({ pathname: '/result', params: { target } });
  };

  if (isReadyToCheck) {
    if (isGameEnded) {
      setTimeout(() => handleGameEnd(), ANIMATION_DURATION * ROW_LENGTH);
    } else {
      activeRow.current++;
      shouldCheck.value = true;
    }
  }

  if (isLoading) {
    return (
      <ImageBackground
        imageStyle={{ flex: 1 }}
        source={require('assets/first_theme.png')}
        style={styles.loadingContainer}
      >
        <ActivityIndicator color={'white'} size={'large'} />
      </ImageBackground>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={true} style="light" />
      <ImageBackground
        imageStyle={{ flex: 1 }}
        source={require('assets/first_theme.png')}
        style={styles.container}
      >
        <View>
          {wordRows.map((row, rowIndex) => (
            <WordRow
              handleLetterDelete={handleLetterDelete}
              target={target}
              row={row}
              rowIndex={rowIndex}
              rowLength={ROW_LENGTH}
              key={rowIndex}
            />
          ))}
        </View>
        <CustomKeyboard
          shouldCheck={shouldCheck}
          usedLetters={usedLetters}
          onLetterPress={onKeyboardLetterPress}
          target={target}
        />
      </ImageBackground>
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingVertical: verticalScale(64),
    backgroundColor: 'white',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
