import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import Ionicons from '@expo/vector-icons/Ionicons';

import DifficultyItem, { Difficultyitem } from 'components/Difficulty/DifficultyItem';
import { Progressbar } from 'components/Progressbar';

import { router } from 'expo-router';

import { Difficulties, WORDS_BY_DIFFICULTY, changeDifficulty } from 'redux/slices/difficultySlice';
import { RootState } from 'redux/store';

import { Layout } from 'constants/layout';
import { DifficultiesScreenString } from 'constants/strings';
import { Difficulty_Imgs, backgroundImage } from 'assets/imgs';
import { Theme } from 'constants/theme';
import { DIFFICULTIES } from 'constants/difficulties';

const Difficulty = () => {
  const { width, height } = useWindowDimensions();

  const dispatch = useDispatch();
  const difficulty = useSelector((state: RootState) => state.difficulty.difficulty);
  const progresses = useSelector((state: RootState) => state.difficulty.difficulties);

  const [listIndex, setListIndex] = useState(0);

  const listRef = useRef<FlatList | null>(null);

  const progress = progresses[listIndex].currentProgress;
  const total = DIFFICULTIES[listIndex].length;

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
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <Ionicons
        style={styles.exitIcon}
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
          style={[styles.chevronIcon, { left: 8 }]}
          name="chevron-back-outline"
          size={32}
          color={'white'}
          onPress={handleScrollBack}
        />
      )}
      {listIndex !== DIFFICULTIES.length - 1 && (
        <Ionicons
          style={[styles.chevronIcon, { right: 8 }]}
          name="chevron-forward-outline"
          size={32}
          color={'white'}
          onPress={handleScrollForward}
        />
      )}
      <View style={styles.progressbarContainer}>
        <Text style={[styles.txt, { fontSize: 20 }]}>
          {DifficultiesScreenString.PROGRESS_COMPETED}
        </Text>
        <Progressbar color="#F6E7BE" current={progress} total={total} />
      </View>
      <View style={styles.btnContainer}>
        <Pressable
          style={difficulty === listIndex ? [styles.btn, styles.disabledBtn] : styles.btn}
          disabled={difficulty === listIndex}
          onPress={handleDifficultyChoice}
        >
          <Text style={[styles.txt, styles.label]}>{DifficultiesScreenString.CHOOSE_BTN_TEXT}</Text>
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
    paddingBottom: Layout.mediumSpacing,
    paddingTop: Layout.mediumSpacing,
  },
  txt: {
    color: 'white',
    fontFamily: 'JetBrainsMono-Regular',
    textAlign: 'center',
  },
  btnContainer: {
    paddingHorizontal: Layout.mediumSpacing,
  },
  btn: {
    paddingHorizontal: Layout.mediumSpacing,
    paddingVertical: Layout.smallSpacing,
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
    marginBottom: Layout.largeSpacing,
  },
  exitIcon: {
    position: 'absolute',
    top: Layout.mediumSpacing + 4,
    right: Layout.smallSpacing,
    zIndex: 100,
  },
  chevronIcon: {
    position: 'absolute',
    top: '50%',
  },
});
