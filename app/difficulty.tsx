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

import { Theme } from 'assets/theme';
import { getStoredStr, removeValue } from 'utils/asyncStorage';

import DifficultyItem, { Difficultyitem } from 'components/Difficulty/DifficultyItem';
import { Layout } from 'constants/layout';
import { router } from 'expo-router';
import { Progressbar } from 'components/Progressbar';
import { useDispatch, useSelector } from 'react-redux';
import { Difficulties, WORDS_BY_DIFFICULTY, changeDifficulty } from 'redux/slices/difficultySlice';
import { RootState } from 'redux/store';

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
  const difficulty = useSelector((state: RootState) => state.difficulty.difficulty);

  const progresses = useSelector((state: RootState) => state.difficulty.difficulties);

  const { width, height } = useWindowDimensions();
  const [listIndex, setListIndex] = useState(0);

  const dispatch = useDispatch();

  const progress = progresses[listIndex].currentProgress;

  const getDifficultyWordLength = (difficulty: Difficulties) => {
    return WORDS_BY_DIFFICULTY[difficulty].length;
  };
  const total = getDifficultyWordLength(listIndex);

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
    dispatch(changeDifficulty(listIndex));
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
