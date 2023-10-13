import React, { MutableRefObject, memo, useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';
import { SharedValue, runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { handleKeyboardLetterAnimation } from 'utils/handleKeyboardLetter';
import { handleWordCheck } from 'utils/handleWordCheck';
import { KeyboardLetter } from './KeyboardLetter';
import { UniqueLetters } from '../../../app/(game)/game';
import { getStoredObj, storeObj } from 'utils/asyncStorage';

const { width } = Dimensions.get('window');

const handleUniqueLetters = (
  uniqueLetters: MutableRefObject<{ correct: string[]; inWord: string[]; notInWord: string[] }>,
  newLetters: { correct: string[]; inWord: string[]; notInWord: string[] },
) => {
  'worklet';
  for (const [key, value] of Object.entries(newLetters)) {
    switch (key) {
      case 'correct':
        value.forEach((letter) => {
          if (!uniqueLetters.current.correct.includes(letter)) {
            uniqueLetters.current.correct.push(letter);
            if (uniqueLetters.current.inWord.includes(letter)) {
              uniqueLetters.current.inWord.splice(0, 1);
            }
          }
        });
        break;
      case 'inWord':
        value.forEach((letter) => {
          if (
            !uniqueLetters.current.correct.includes(letter) &&
            !uniqueLetters.current.inWord.includes(letter)
          ) {
            uniqueLetters.current.inWord.push(letter);
          }
        });
        break;
      case 'notInWord':
        value.forEach((letter) => {
          if (
            !uniqueLetters.current.correct.includes(letter) &&
            !uniqueLetters.current.inWord.includes(letter) &&
            !uniqueLetters.current.notInWord.includes(letter)
          ) {
            uniqueLetters.current.notInWord.push(letter);
          }
        });
        break;
      default:
        break;
    }
  }
};

interface CustomKeyboardProps {
  onLetterPress: (letter: string) => void;
  usedLetters: SharedValue<string>;
  shouldCheck: SharedValue<boolean>;
  target: string;
  handleLetterDelete: () => void;
  handleLongLetterDelete: () => void;
}

const CustomKeyboard: React.FC<CustomKeyboardProps> = memo(
  ({
    onLetterPress,
    usedLetters,
    shouldCheck,
    target,
    handleLetterDelete,
    handleLongLetterDelete,
  }) => {
    const rows = ["йцукенгшўзх'", 'фывапролджэ', 'ячсмітьбю'];

    const uniqueLetters = useRef<{
      correct: string[];
      inWord: string[];
      notInWord: string[];
    }>({
      correct: [],
      inWord: [],
      notInWord: [],
    });
    const colors = rows.map((item) => item.split('').map(() => useSharedValue('#363229')));
    let isUsed = false;
    const handleLetterLongPress = (letter: string) => {
      if (letter === 'е') {
        onLetterPress('ё');
      }
    };

    //react to shouldCheck and check whick Keyboard letters were used
    useAnimatedReaction(
      () => shouldCheck.value,
      () => {
        if (shouldCheck.value) {
          const letters = handleWordCheck(usedLetters.value, target);
          handleUniqueLetters(uniqueLetters, letters);

          for (const [key, value] of Object.entries(uniqueLetters.current)) {
            handleKeyboardLetterAnimation(value, rows, colors, key);
          }

          shouldCheck.value = false;
        }
      },
    );

    const renderLetterButtons = useCallback(() => {
      return rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.split('').map((item, index) => (
            <KeyboardLetter
              letter={item}
              key={index}
              onLetterPress={onLetterPress}
              handleLongPress={handleLetterLongPress}
              color={colors[rowIndex][index]}
            />
          ))}
        </View>
      ));
    }, []);

    return (
      <View style={styles.container}>
        {renderLetterButtons()}
        <Pressable
          onPress={handleLetterDelete}
          onLongPress={handleLongLetterDelete}
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
});

export default CustomKeyboard;
