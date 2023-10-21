import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DIFFICULTIES } from 'constants/difficulties';
import { router } from 'expo-router';
import { Difficulties } from 'redux/slices/difficultySlice';

export const Header = ({ difficulty }: { difficulty: Difficulties }) => {
  const handleExit = () => {
    router.back();
  };

  return (
    <View style={[styles.header]}>
      <Ionicons name="arrow-back-outline" color={'white'} size={32} onPress={handleExit} />
      <Text style={styles.headerTxt}>{DIFFICULTIES[difficulty].name}</Text>
      <View style={{ width: 32 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTxt: {
    color: 'black',
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 20,
    backgroundColor: '#F6E7BE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
