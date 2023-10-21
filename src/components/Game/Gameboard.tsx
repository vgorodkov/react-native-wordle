import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { Row } from './WordRow';

const NUM_ROWS = 6;
const NUM_COLS = 5;

export const Gameboard = ({ target }: { target: string }) => {
  const INITIAL_EMPTY_WORDS = useMemo(
    () => Array.from({ length: NUM_ROWS }, () => Array.from({ length: NUM_COLS }, () => '')),
    [],
  );

  const currentRow = useSelector((state: RootState) => state.game.currentRow);
  const currentCol = useSelector((state: RootState) => state.game.currentCol);

  return (
    <View style={styles.gameContainer}>
      {INITIAL_EMPTY_WORDS.map((item, index) => (
        <Row
          target={target}
          currentCol={currentRow === index ? currentCol : -1}
          isActive={currentRow === index}
          key={index}
          letters={item}
          rowIndex={index}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    padding: 16,
  },
});
