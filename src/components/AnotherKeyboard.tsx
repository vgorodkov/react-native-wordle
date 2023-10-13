import React, { MutableRefObject, memo, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';

import { Layout } from 'constants/layout';
import { useDispatch, useSelector } from 'react-redux';
import { addLetter, deleteAllLetters, deleteLetter } from 'redux/slices/gameSlice';
import { RootState } from 'redux/store';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { handleWordCheck } from 'utils/handleWordCheck';
import { handleKeyboardLetterAnimation } from 'utils/handleKeyboardLetter';
import { Difficulties, WORDS_BY_DIFFICULTY } from 'redux/slices/difficultySlice';

const { width } = Dimensions.get('window');

const Letter = memo(({ letter, color }: { letter: string; color: SharedValue<string> }) => {
  const dispatch = useDispatch();

  const animatedLetterStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: color.value,
    };
  });

  const handleKeyboardLetter = () => {
    dispatch(addLetter(letter));
  };

  return (
    <Pressable
      onPress={handleKeyboardLetter}
      style={({ pressed }) => [pressed ? { opacity: 0.5 } : { opacity: 1 }]}
    >
      <Animated.View style={[styles.letterButton, animatedLetterStyle]}>
        <Text style={styles.letterText}>{letter}</Text>
      </Animated.View>
    </Pressable>
  );
});

const KeyboardRow = memo(
  ({
    rowIndex,
    row,
    colors,
  }: {
    rowIndex: number;
    row: string;
    colors: SharedValue<string>[][];
  }) => {
    return (
      <View style={styles.row}>
        {row.split('').map((item, index) => (
          <Letter key={index} letter={item} color={colors[rowIndex][index]} />
        ))}
      </View>
    );
  },
);

const AnotherKeyboard = memo(
  ({ target, wordsRef }: { target: string; wordsRef: MutableRefObject<string[][]> }) => {
    const dispatch = useDispatch();

    const currentWord = useSelector((state: RootState) => state.game.currentWord);

    const rows = ["йцукенгшўзх'", 'фывапролджэ', 'ячсмітьбю'];
    const colors = rows.map((item) => item.split('').map(() => useSharedValue('#363229')));

    useEffect(() => {
      wordsRef.current.forEach((word) => {
        const letters = handleWordCheck(word.join(''), target);
        for (const [key, value] of Object.entries(letters)) {
          handleKeyboardLetterAnimation(value, rows, colors, key);
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
        <Pressable
          onPress={onDeletePress}
          onLongPress={onLongDeletePress}
          style={({ pressed }) =>
            pressed ? [styles.deleteBtn, styles.deleteBtnPressed] : styles.deleteBtn
          }
        >
          <Text style={styles.deleteBtnTxt}>Выдаліць</Text>
        </Pressable>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingBottom: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: '#363229',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 4,
    marginHorizontal: 32,
    borderRadius: 4,
  },
  deleteBtnPressed: {
    opacity: 0.5,
  },
  deleteBtnTxt: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'JetBrainsMono-Bold',
  },
  letterButton: {
    width: width / 14,
    paddingVertical: Layout.extraSmallPadding,
    backgroundColor: '#363229',
    margin: 2,
    alignItems: 'center',
    borderRadius: 4,
  },
  letterText: {
    fontSize: 20,
    fontFamily: 'JetBrainsMono-Bold',
    color: 'white',
  },
});

export default AnotherKeyboard;
