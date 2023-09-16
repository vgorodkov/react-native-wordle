import React, { memo } from 'react';
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

const CustomKeyboard: React.FC<CustomKeyboardProps> = memo(
  ({ onLetterPress, usedLetters, shouldCheck, target }) => {
    const rows = ["йцукенгшўзх'", 'фывапролджэ', 'ячсмітьбю'];
    const colors = rows.map((item) => item.split('').map(() => useSharedValue('transparent')));

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
          const word = usedLetters.value;

          const letters = handleWordCheck(word, target);
          for (const [key, value] of Object.entries(letters)) {
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
