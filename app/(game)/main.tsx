import { StyleSheet, View, ImageBackground, InteractionManager, Text } from 'react-native';
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { router } from 'expo-router';
import { WordRow } from 'components/WordRow';
import { getRandomWord } from 'utils/getRandomWord';
import { StatusBar } from 'expo-status-bar';
import CustomKeyboard from 'components/Keyboard';
import { verticalScale } from 'utils/metrics';
import { Loading } from 'components/Loading';
import { useDifficulty } from 'components/DifficultyProvider';
import * as Haptics from 'expo-haptics';
import { getStoredObj, getStoredStr, removeValue, storeObj, storeStr } from 'utils/asyncStorage';

const NUM_ROWS = 6;
const ROW_LENGTH = 5;
const ANIMATION_DURATION = 300;

const setCorrectLetters = (
  wordRow: string,
  correctLetters: MutableRefObject<string[]>,
  target: string,
) => {
  const letters = wordRow.split('');
  for (let i = 0; i < letters.length; i++) {
    if (letters[i] === target[i]) {
      correctLetters.current[i] = letters[i];
    }
  }
};

const GameScreen = () => {
  const { difficulty, canBeUsedWords, allWords } = useDifficulty();

  const [isLoading, setIsLoading] = useState(true);
  const [target, setTarget] = useState('');
  const [wordRows, setWordRows] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    setIsLoading(true);

    getStoredObj('word-rows')
      .then((data) => {
        if (data) {
          setWordRows(data);
          let active = 0;
          for (let i = 0; i < data.length; i++) {
            if (data[i].length === 5) {
              active++;
            }
          }
          activeRow.current = active;
        } else {
          setWordRows(['', '', '', '', '', '']);
        }
      })
      .catch((e) => {});
    getStoredStr('target')
      .then((data) => {
        if (data) {
          setTarget(data);
        } else {
          setTarget(getRandomWord(canBeUsedWords));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeRow = useRef(0);

  //only correct letters to activeRow
  const correctLetters = useRef<string[]>([]);

  //all used letters to Keyboard.
  const usedLetters = useSharedValue<string>('');
  const shouldCheck = useSharedValue(false);

  const isGameEnded = activeRow.current === 5 || wordRows[activeRow.current] === target;
  const isLongEnough = wordRows[activeRow.current].length === ROW_LENGTH;
  const isExistingWord = allWords.includes(wordRows[activeRow.current]);
  const isReadyToCheck = isLongEnough && isExistingWord;
  const hasGameStarted = wordRows[0].length === 5;

  if (isLongEnough) {
    usedLetters.value = wordRows[activeRow.current];
    if (isExistingWord) {
      setCorrectLetters(wordRows[activeRow.current], correctLetters, target);
    }
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

  if (hasGameStarted) {
    storeStr(target, 'target');
  }

  if (isReadyToCheck) {
    if (isGameEnded) {
      //wait for animation end and end game

      removeValue('word-rows');
      removeValue('target');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => handleGameEnd(), ANIMATION_DURATION * ROW_LENGTH);
    } else {
      activeRow.current++;
      shouldCheck.value = true;
      storeObj(wordRows, 'word-rows');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={true} style="light" />
      <ImageBackground
        imageStyle={{ flex: 1 }}
        source={require('assets/background-stars.png')}
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
              correctLetters={correctLetters}
              isActive={activeRow.current === rowIndex}
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
});
