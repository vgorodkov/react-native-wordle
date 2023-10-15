import React, { MutableRefObject, memo, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform, Keyboard } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { addLetter, deleteAllLetters, deleteLetter } from 'redux/slices/gameSlice';
import { RootState } from 'redux/store';
import { useSharedValue } from 'react-native-reanimated';
import { handleWordCheck } from 'utils/handleWordCheck';
import { handleKeyboardLetterAnimation } from 'utils/handleKeyboardLetter';
import { Difficulties, WORDS_BY_DIFFICULTY } from 'redux/slices/difficultySlice';
import { KeyboardRow } from './KeyboardRow';

const { width } = Dimensions.get('window');

const CONTAINER_WIDTH = width > 600 ? '50%' : '100%';
const DELETE_BTN_FONT_SIZE = width > 600 ? 24 : 16;

const CustomKeyboard = memo(
  ({ target, wordsRef }: { target: string; wordsRef: MutableRefObject<string[][]> }) => {
    const dispatch = useDispatch();

    const currentWord = useSelector((state: RootState) => state.game.currentWord);

    const rows = ["йцукенгшўзх'", 'фывапролджэ', 'dячсмітьбюd'];
    const colors = rows.map((item) => item.split('').map(() => useSharedValue('#363229')));

    useEffect(() => {
      wordsRef.current.forEach((word) => {
        const letters = handleWordCheck(word.join(''), target);
        for (const [key, value] of Object.entries(letters)) {
          handleKeyboardLetterAnimation(value, rows, colors, key);
        }
      });

      const handleKeyUp = (event) => {
        if (rows.join('').includes(event.key) && event.key !== 'd') {
          dispatch(addLetter(event.key));
        }
        if (event.key === 'Backspace' || event.key === 'Delete') {
          dispatch(deleteLetter());
        }
      };

      if (Platform.OS === 'web') {
        window.addEventListener('keyup', handleKeyUp);
      }

      () => window.removeEventListener('keyup', handleKeyUp);
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

    const onDeletePress = () => {
      dispatch(deleteLetter());
    };

    const onLongDeletePress = () => {
      dispatch(deleteAllLetters());
    };

    return (
      <View style={styles.container}>
        {rows.map((row, rowIndex) => (
          <KeyboardRow key={rowIndex} row={row} rowIndex={rowIndex} colors={colors} />
        ))}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
    paddingBottom: 16,
    paddingVertical: 8,
  },
  deleteBtn: {
    backgroundColor: '#363229',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 4,
    marginHorizontal: 32,
    borderRadius: 4,
  },
  deleteBtnPressed: {
    opacity: 0.5,
  },
  deleteBtnTxt: {
    color: 'white',
    fontSize: DELETE_BTN_FONT_SIZE,
    fontWeight: '600',
    fontFamily: 'JetBrainsMono-Bold',
  },
});

export default CustomKeyboard;
