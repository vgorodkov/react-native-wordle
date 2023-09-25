import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';

const Result = () => {
  const { target } = useLocalSearchParams();
  return (
    <ImageBackground
      style={styles.container}
      imageStyle={{ flex: 1 }}
      source={require('assets/first_theme.png')}
    >
      <Text style={styles.txt}>Правільнае слова:</Text>
      <Text style={[styles.targetWord, styles.txt]}>{target}</Text>
      <View style={styles.btnContainer}>
        <Pressable style={styles.btn} onPress={() => router.replace('/')}>
          <Text style={styles.txt}>У меню</Text>
        </Pressable>
        <Pressable
          style={styles.btn}
          onPress={() => Linking.openURL(`https://ru.wiktionary.org/wiki/${target}`)}
        >
          <Text style={styles.txt}>Значэнне слова</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => router.replace('/main')}>
          <Text style={styles.txt}>Далей</Text>
        </Pressable>
      </View>
    </ImageBackground>
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
    justifyContent: 'space-between',
  },
  btn: {
    borderWidth: 1,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderColor: 'white',

    borderRadius: 4,
  },
  targetWord: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '700',
  },
  txt: {
    color: 'white',
    fontFamily: 'JetBrainsMono-Regular',
  },
});
