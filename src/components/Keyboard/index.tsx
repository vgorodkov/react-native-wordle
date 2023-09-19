import React, { MutableRefObject, memo, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SharedValue, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { handleKeyboardLetterAnimation } from 'utils/handleKeyboardLetter';
import { handleWordCheck } from 'utils/handleWordCheck';
import { KeyboardLetter } from './KeyboardLetter';
import { Layout } from 'constants/layout';
import { verticalScale } from 'utils/metrics';

interface CustomKeyboardProps {
  onLetterPress: (letter: string) => void;
  usedLetters: SharedValue<string>;
  shouldCheck: SharedValue<boolean>;
  target: string;
}

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

const CustomKeyboard: React.FC<CustomKeyboardProps> = memo(
  ({ onLetterPress, usedLetters, shouldCheck, target }) => {
    const rows = ["йцукенгшўзх'", 'фывапролджэ', 'ячсмітьбю'];
    const colors = rows.map((item) => item.split('').map(() => useSharedValue('transparent')));
    const unique = useRef<{
      correct: string[];
      inWord: string[];
      notInWord: string[];
    }>({
      correct: [],
      inWord: [],
      notInWord: [],
    });
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

          handleUniqueLetters(unique, letters);
          console.log(unique.current);
          for (const [key, value] of Object.entries(unique.current)) {
            handleKeyboardLetterAnimation(value, rows, colors, key);
          }

          shouldCheck.value = false;
        }
      },
    );

    const renderLetterButtons = () => {
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
    };

    return <View style={styles.container}>{renderLetterButtons()}</View>;
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    paddingVertical: Layout.smallPadding,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default CustomKeyboard;
