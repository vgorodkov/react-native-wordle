import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { addLetter } from 'redux/slices/gameSlice';

import { FONT_SIZES, FONTS } from 'constants/fonts';
import { Theme } from 'constants/theme';

const { width } = Dimensions.get('window');

export const KeyboardLetter = memo(
  ({ letter, color }: { letter: string; color: SharedValue<string> }) => {
    const [isDoubleLetterVisible, setDoubleLetterVisible] = useState(false);
    const [isDoubleLetterActive, setDoubleLetterActive] = useState(false);

    const dispatch = useDispatch();

    const isDoubleLetter = letter === 'е';

    const doubleLetterColor = isDoubleLetterActive
      ? Theme.colors.activeKeyboardLetter
      : Theme.colors.keyboardLetter;

    const animatedLetterStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: color.value,
      };
    });

    const handlePress = () => {
      dispatch(addLetter(letter));
    };

    const handlePressOut = () => {
      if (isDoubleLetter) {
        if (isDoubleLetterActive) {
          dispatch(addLetter('ё'));
        }
        setDoubleLetterActive(false);
        setDoubleLetterVisible(false);
      }
    };

    const handleLongPress = () => {
      setDoubleLetterActive(true);
    };

    const handlePressIn = () => {
      if (isDoubleLetter) {
        setDoubleLetterVisible(true);
      }
    };

    return (
      <View>
        {isDoubleLetterVisible && (
          <View
            style={[
              styles.letterButton,
              styles.doubleLetterContainer,
              { backgroundColor: doubleLetterColor },
            ]}
          >
            <Text style={styles.letterText}>ё</Text>
          </View>
        )}
        <Pressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : { opacity: 1 })}
        >
          <Animated.View style={[styles.letterButton, animatedLetterStyle]}>
            {isDoubleLetter && <Text style={styles.doubleLetter}>ё</Text>}
            <Text style={styles.letterText}>{letter}</Text>
          </Animated.View>
        </Pressable>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  letterButton: {
    width: width / 15,
    paddingVertical: 10,
    backgroundColor: '#363229',
    margin: 3,
    alignItems: 'center',
    borderRadius: 4,
  },
  letterText: {
    fontSize: FONT_SIZES.smallScreen.headingSmall,
    fontFamily: FONTS.medium,
    color: 'white',
  },
  doubleLetter: {
    position: 'absolute',
    color: 'white',
    fontFamily: FONTS.medium,
    right: 1,
    top: 1,
  },
  doubleLetterContainer: {
    position: 'absolute',
    width: width / 10,
    paddingVertical: 16,
    top: -72,
  },
});
