import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { KeyboardLetter } from './KeyboardLetter';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { deleteAllLetters, deleteLetter } from 'redux/slices/gameSlice';

import { moderateScale } from 'utils/metrics';

const { width } = Dimensions.get('window');

const DeleteBtn = () => {
  const dispatch = useDispatch();

  const onDeletePress = () => {
    dispatch(deleteLetter());
  };

  const onLongDeletePress = () => {
    dispatch(deleteAllLetters());
  };

  return (
    <Pressable
      onPress={onDeletePress}
      onLongPress={onLongDeletePress}
      style={({ pressed }) => (pressed ? [styles.deleteBtn, { opacity: 0.8 }] : styles.deleteBtn)}
    >
      <Ionicons size={moderateScale(20, 0.5)} color={'white'} name="trash-outline" />
    </Pressable>
  );
};

export const KeyboardRow = memo(
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
        {row.split('').map((item, index) => {
          if (item === 'd') {
            return <DeleteBtn key={index} />;
          }
          return <KeyboardLetter key={index} letter={item} color={colors[rowIndex][index]} />;
        })}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: width / 9,
    backgroundColor: '#332936',
    margin: 2,
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  enterBtnTxt: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 12,
    color: 'white',
  },
});
