import { Alert, Button, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import CustomKeyboard from 'components/Keyboard';

import { useDifficulty } from 'components/DifficultyProvider';

import { WordRow } from 'components/Playground/WordRow';
import { router } from 'expo-router';
import { getStoredObj, getStoredStr, removeValue, storeObj, storeStr } from 'utils/asyncStorage';
import { StatusBar } from 'expo-status-bar';
import { Header } from 'components/Header';
import * as Haptics from 'expo-haptics';
import { Loading } from 'components/Loading';

const NUM_ROWS = 6;
const NUM_COLS = 5;

const Game = () => {
  const INITIAL_EMPTY_WORDS = useMemo(
    () => Array.from({ length: NUM_ROWS }, () => Array.from({ length: NUM_COLS }, () => '')),
    [],
  );

  const { canBeUsedWords, allWords, progress } = useDifficulty();
  const [target, setTarget] = useState(
    progress < canBeUsedWords.length ? canBeUsedWords[progress] : 'кавун', //prevent going out of range.
  );
  const [activeCol, setActiveCol] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [correctLetters, setCorrectLetters] = useState(['', '', '', '', '']);
  const [words, setWords] = useState(INITIAL_EMPTY_WORDS);

  const currentRow = useRef(0);
  const currentCol = useRef(0);
  const hintWasUsed = useRef(false);

  //for keyboard letters animation
  const usedLetters = useSharedValue<string>('');
  const shouldCheck = useSharedValue(false);

  const word = words[currentRow.current].join('');
  const isLongEnough = word.length === 5;
  const isExistingWord = allWords.includes(word);
  const isGameEnded = currentRow.current === 5;
  const isWordGuessed = word === target;
  const hasGameStarted = words[0].join('').trim().length === 5;

  useEffect(() => {
    setIsLoading(true);
    getStoredObj('words')
      .then((data) => {
        if (data) {
          setWords(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const addLetter = useCallback((letter: string) => {
    setWords((prevWord) => {
      if (prevWord[currentRow.current].join('').length < 5 && currentCol.current < 5) {
        const updatedWord = [...prevWord];
        updatedWord[currentRow.current][currentCol.current] = letter;
        return updatedWord;
      } else {
        return prevWord;
      }
    });
    setActiveCol((prevCol) => {
      if (prevCol < 4) {
        currentCol.current++;
        return prevCol + 1;
      } else {
        return prevCol;
      }
    });
  }, []);

  const handleLetterDelete = useCallback(() => {
    setWords((prevWords) => {
      const updatedWords = [...prevWords];
      const row = updatedWords[currentRow.current];

      if (row.join('').length > 0) {
        if (row[currentCol.current] !== '') {
          row[currentCol.current] = '';
        } else if (currentCol.current > 0) {
          row[currentCol.current - 1] = '';
          currentCol.current--;
        }
        return updatedWords;
      } else {
        return prevWords;
      }
    });
    setActiveCol(currentCol.current);
  }, []);

  const handleLongLetterDelete = useCallback(() => {
    setWords((prevWords) => {
      const updatedWords = [...prevWords];
      updatedWords[currentRow.current] = ['', '', '', '', ''];
      currentCol.current = 0;
      return updatedWords;
    });
    setActiveCol(currentCol.current);
  }, []);

  const onWordLetter = useCallback((letterIndex: number) => {
    currentCol.current = letterIndex;
    setActiveCol(letterIndex);
  }, []);

  //get correct letters which are displayed on active row
  const handleCorrectLetters = () => {
    for (let i = 0; i < word.length; i++) {
      if (word[i] === target[i]) {
        setCorrectLetters((prev) => {
          const updatedLetters = [...prev];
          updatedLetters[i] = target[i];
          return updatedLetters;
        });
      }
    }
  };

  const handleHint = useCallback(() => {
    if (!hintWasUsed.current) {
      if (!correctLetters.includes(target[currentCol.current])) {
        setCorrectLetters((prev) => {
          const updatedLetters = [...prev];
          updatedLetters[currentCol.current] = target[currentCol.current];
          return updatedLetters;
        });
        setWords((prev) => {
          const updatedWords = [...prev];
          updatedWords[currentRow.current][currentCol.current] = '';
          return updatedWords;
        });
        hintWasUsed.current = true;
        storeStr('true', 'hint-used');
      }
    } else {
      Alert.alert('Пачакайце...', 'Вы ўжо выкарыстоўвалі падказку!');
    }
  }, []);

  const handleGameEnd = (isWordGuessed: boolean) => {
    router.replace({ pathname: '/result', params: { target, isWordGuessed } });
  };

  if ((isGameEnded || isWordGuessed) && isLongEnough && isExistingWord) {
    setTimeout(() => handleGameEnd(isWordGuessed), 300 * word.length);
  }

  //get to new Row if word is correct
  if (isLongEnough && isExistingWord && currentRow.current < 5) {
    usedLetters.value = word;
    shouldCheck.value = true;
    currentCol.current = 0;
    currentRow.current++;
    handleCorrectLetters();
    setActiveCol(currentCol.current);
    if (hasGameStarted) {
      storeObj(words, 'words');
    }
  }

  if (isLongEnough && isExistingWord) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } else if (isLongEnough) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ImageBackground source={require('assets/imgs/background-stars.png')} style={styles.container}>
      <StatusBar hidden />
      <Header handleHint={handleHint} />
      <View>
        {words.map((item, index) => (
          <WordRow
            onWordLetter={onWordLetter}
            letters={item}
            key={item.toString() + index} //use this in oreder to trigger rerender when letter is deleted and activeCol is the same
            correctLetters={currentRow.current === index ? correctLetters : null}
            target={target}
            activeCol={currentRow.current === index ? activeCol : -1}
            isActive={currentRow.current === index}
          />
        ))}
      </View>

      <CustomKeyboard
        onLetterPress={addLetter}
        shouldCheck={shouldCheck}
        usedLetters={usedLetters}
        handleLongLetterDelete={handleLongLetterDelete}
        handleLetterDelete={handleLetterDelete}
        target={target}
      />
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
    backgroundColor: 'gray',
  },
});
