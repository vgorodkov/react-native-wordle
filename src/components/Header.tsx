import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useDifficulty } from './DifficultyProvider';

interface HeaderProps {
  handleHint: () => void;
}

export const Header = memo(({ handleHint }: HeaderProps) => {
  const { difficulty, progress } = useDifficulty();

  const handleDifficultyName = () => {
    switch (difficulty) {
      case 0:
        return 'Лёгкая';
      case 1:
        return 'Сярэдняя';
      case 2:
        return 'Складаная';
      case 3:
        return 'Універсальная';

      default:
        return 'Невядомая';
    }
  };

  const handleExitBtn = () => {
    router.back();
  };

  return (
    <View style={styles.header}>
      <Ionicons onPress={handleExitBtn} name="arrow-back-outline" size={32} color="white" />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.txt}>{handleDifficultyName()}</Text>
        <Text style={styles.subTxt}>Уровень: {progress}</Text>
      </View>
      <TouchableOpacity onPress={handleHint}>
        <Image
          source={require('assets/bulb_2.png')}
          style={{ width: 32, resizeMode: 'contain', height: 32 }}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    width: '100%',
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  txt: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'JetBrainsMono-Bold',
  },
  subTxt: {
    fontSize: 16,
    color: 'white',

    fontFamily: 'JetBrainsMono-Medium',
  },
});
