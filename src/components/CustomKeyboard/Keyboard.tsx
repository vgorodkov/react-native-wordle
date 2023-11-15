import React, { MutableRefObject, memo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';

import { RootState } from 'redux/store';
import { useSharedValue } from 'react-native-reanimated';
import { handleWordCheck } from 'utils/handleWordCheck';
import { handleKeyboardLetterAnimation } from 'utils/handleKeyboardLetter';
import { Difficulties, WORDS_BY_DIFFICULTY } from 'redux/slices/difficultySlice';
import { KeyboardRow } from './KeyboardRow';
import { LAYOUT } from 'constants/layout';
import { THEME } from 'constants/theme';

interface CustomKeyboardProps {
  target: string;
  wordsRef: MutableRefObject<string[][]>;
}

const CustomKeyboard = memo(({ target, wordsRef }: CustomKeyboardProps) => {
  const currentWord = useSelector((state: RootState) => state.game.currentWord);

  const rows = ["йцукенгшўзх'", 'фывапролджэ', 'dячсмітьбюd']; //d for delete btn)
  const colors = rows.map((item) => item.split('').map(() => useSharedValue('#363229')));

  useEffect(() => {
    wordsRef.current.forEach((wordLetters) => {
      const word = wordLetters.join('');
      if (WORDS_BY_DIFFICULTY[Difficulties.Universal].includes(word)) {
        const letters = handleWordCheck(word, target);
        for (const [key, value] of Object.entries(letters)) {
          handleKeyboardLetterAnimation(value, rows, colors, key);
        }
      }
    });
  }, []);

  if (
    currentWord.length === 5 &&
    WORDS_BY_DIFFICULTY[Difficulties.Universal].includes(currentWord)
  ) {
    const letters = handleWordCheck(currentWord, target);

    for (const [key, value] of Object.entries(letters)) {
      handleKeyboardLetterAnimation(value, rows, colors, key);
    }
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <KeyboardRow key={rowIndex} row={row} rowIndex={rowIndex} colors={colors} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: THEME.colors.surfaceContainer,
    paddingVertical: LAYOUT.defaultSpacing,
    paddingTop: LAYOUT.mediumSpacing,
  },
});

export default CustomKeyboard;
