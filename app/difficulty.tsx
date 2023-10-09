import {
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  ALL_WORDS,
  EASY_NOUNS,
  HARD_NOUNS,
  MEDIUM_NOUNS,
  useDifficulty,
} from 'components/DifficultyProvider';
import { Theme } from 'assets/theme';
import { getStoredStr, removeValue } from 'utils/asyncStorage';

import DifficultyItem, { Difficultyitem } from 'components/Difficulty/DifficultyItem';
import { Layout } from 'constants/layout';
import { router } from 'expo-router';
import { Progressbar } from 'components/Progressbar';

const DIFFICULTIES = [
  {
    description: 'Толькі назоўнікі. Простыя словы.',
    img: require('assets/imgs/sun.png'),
    name: 'Лёгкая',
  },
  {
    description: 'Усе часціны мовы. Простыя словы.',
    img: require('assets/imgs/halfmoon.png'),
    name: 'Сярэдняя',
  },
  {
    description: 'Усе часціны мовы. Толькі складаныя словы.',
    img: require('assets/imgs/moon.png'),
    name: 'Складаная',
  },
  {
    description: 'Усе словы. Можа трапіцца як складанае, так і лёгкае слова.',
    img: require('assets/imgs/flower.png'),
    name: 'Універсальная',
  },
];

const Difficulty = () => {
  const { difficulty, setDifficulty } = useDifficulty();
  const { width, height } = useWindowDimensions();
  const [listIndex, setListIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const getDifficultyWordLength = (difficulty: number) => {
    switch (difficulty) {
      case 0:
        return EASY_NOUNS.length;
      case 1:
        return MEDIUM_NOUNS.length;
      case 2:
        return HARD_NOUNS.length;
      case 3:
        return ALL_WORDS.length;
      default:
        return 1;
    }
  };
  const total = getDifficultyWordLength(listIndex);

  useEffect(() => {
    getStoredStr(`difficulty-${listIndex}-progress`).then((data) => {
      if (data) {
        setProgress(+data);
      } else {
        setProgress(0);
      }
    });
  }, [listIndex]);

  const listRef = useRef<FlatList | null>(null);

  useEffect(() => {
    setListIndex(difficulty);
  }, []);

  const renderItem = ({ item, index }: { item: Difficultyitem; index: number }) => {
    return (
      <View style={{ width }}>
        <DifficultyItem
          description={item.description}
          name={item.name}
          img={item.img}
          difficultyIndex={index}
          activeDifficulty={difficulty}
        />
      </View>
    );
  };

  const handleScrollForward = () => {
    if (listIndex < DIFFICULTIES.length - 1) {
      listRef.current?.scrollToIndex({ animated: true, index: listIndex + 1 });
      setListIndex((prev) => prev + 1);
    }
  };

  const handleScrollBack = () => {
    if (listIndex > 0) {
      listRef.current?.scrollToIndex({ animated: true, index: listIndex - 1 });
      setListIndex((prev) => prev - 1);
    }
  };

  const onMomentumScrollEnd = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    setListIndex(Math.round(nativeEvent.contentOffset.x / width));
  };

  const handleDifficultyChoice = () => {
    setDifficulty(listIndex);
    removeValue('target');
    removeValue('word-rows');
  };

  return (
    <ImageBackground source={require('assets/imgs/background-stars.png')} style={styles.container}>
      <Ionicons
        style={{
          position: 'absolute',
          top: Layout.mediumPadding + 4,
          right: Layout.smallPadding,
          zIndex: 100,
        }}
        name="exit-outline"
        size={32}
        color={'white'}
        onPress={() => router.back()}
      />
      <FlatList
        data={DIFFICULTIES}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        ref={listRef}
        initialScrollIndex={difficulty}
        getItemLayout={(_, index) => ({ length: height, offset: width * index, index })}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
      {listIndex !== 0 && (
        <Ionicons
          style={{ position: 'absolute', top: '50%', left: 8 }}
          name="chevron-back-outline"
          size={42}
          color={'white'}
          onPress={handleScrollBack}
        />
      )}
      {listIndex !== DIFFICULTIES.length - 1 && (
        <Ionicons
          style={{ position: 'absolute', top: '50%', right: 8 }}
          name="chevron-forward-outline"
          size={42}
          color={'white'}
          onPress={handleScrollForward}
        />
      )}
      <View style={styles.progressbarContainer}>
        <Text style={[styles.txt, { fontSize: 20 }]}>Пройдзена:</Text>
        <Progressbar color="#F6E7BE" current={progress} total={total} />
      </View>
      <View style={styles.btnContainer}>
        <Pressable
          style={difficulty === listIndex ? [styles.btn, styles.disabledBtn] : styles.btn}
          disabled={difficulty === listIndex}
          onPress={handleDifficultyChoice}
        >
          <Text style={[styles.txt, styles.label]}>Выбраць</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default Difficulty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingBottom: Layout.mediumPadding,
    paddingTop: Layout.mediumPadding,
  },
  txt: {
    color: 'white',
    fontFamily: 'JetBrainsMono-Regular',
    textAlign: 'center',
  },
  btnContainer: {
    paddingHorizontal: Layout.mediumPadding,
  },
  btn: {
    paddingHorizontal: Layout.mediumPadding,
    paddingVertical: Layout.extraSmallPadding,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
  },
  disabledBtn: {
    borderColor: Theme.colors.disabled,
    backgroundColor: Theme.colors.disabled,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
  },
  progressbarContainer: {
    gap: 4,
    paddingHorizontal: 32,
    marginBottom: Layout.largePadding,
  },
});
