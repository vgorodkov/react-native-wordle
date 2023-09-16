import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const Result = () => {
  const { target } = useLocalSearchParams();
  return (
    <LinearGradient colors={['#26232A', '#372D35', '#554958']} style={styles.container}>
      <Text style={styles.txt}>Правільнае слова:</Text>
      <Text style={[styles.targetWord, styles.txt]}>{target}</Text>
      <View style={styles.btnContainer}>
        <Pressable style={styles.btn} onPress={() => router.replace('/')}>
          <Text style={styles.txt}>У меню</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => router.replace('/main')}>
          <Text style={styles.txt}>Далей</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  btn: {
    borderWidth: 1,
    padding: 12,
    borderColor: 'white',
    borderRadius: 4,
  },
  targetWord: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: '600',
  },
  txt: {
    color: 'white',
    fontFamily: 'JetBrainsMono-Regular',
  },
});
