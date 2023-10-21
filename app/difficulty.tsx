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

import { LAYOUT } from 'constants/layout';
import { DIFFICULTIES_SCREEN_STRING } from 'constants/strings';
import { Difficulty_Imgs, backgroundImage } from 'assets/imgs';
import { Theme } from 'constants/theme';
import { DIFFICULTIES } from 'constants/difficulties';
import { FONT_SIZES, FONTS } from 'constants/fonts';

const Difficulty = () => {
  const { width, height } = useWindowDimensions();

  const dispatch = useDispatch();
  const difficulty = useSelector((state: RootState) => state.difficulty.difficulty);
  const progresses = useSelector((state: RootState) => state.difficulty.difficulties);

  const [listIndex, setListIndex] = useState(0);

  const listRef = useRef<FlatList | null>(null);

  const progress = progresses[listIndex].currentProgress;
  const total = DIFFICULTIES[listIndex].length;
  const isLastDifficulty = listIndex === DIFFICULTIES.length - 1;
  const isFirstDifficulty = listIndex === 0;
  const isCurrentDifficulty = difficulty === listIndex;

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
        size={LAYOUT.defaultIconSize}
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
      {!isFirstDifficulty && (
        <Ionicons
          style={[styles.chevronIcon, { left: LAYOUT.smallSpacing }]}
          name="chevron-back-outline"
          size={LAYOUT.defaultIconSize}
          color={'white'}
          onPress={handleScrollBack}
        />
      )}
      {!isLastDifficulty && (
        <Ionicons
          style={[styles.chevronIcon, { right: LAYOUT.smallSpacing }]}
          name="chevron-forward-outline"
          size={32}
          color={'white'}
          onPress={handleScrollForward}
        />
      )}
      <View style={styles.progressbarContainer}>
        <Text style={[styles.progressBarHeaderTxt]}>{DIFFICULTIES_SCREEN_STRING.completed}</Text>
        <Progressbar color={Theme.colors.primary} current={progress} total={total} />
      </View>
      <View style={styles.btnContainer}>
        <Pressable
          style={({ pressed }) =>
            isCurrentDifficulty
              ? [styles.btn, styles.disabledBtn]
              : [styles.btn, { opacity: pressed ? 0.7 : 1 }]
          }
          disabled={isCurrentDifficulty}
          onPress={handleDifficultyChoice}
        >
          <Text style={[styles.btnText]}>{DIFFICULTIES_SCREEN_STRING.chooseBtn}</Text>
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
    paddingBottom: LAYOUT.mediumSpacing,
    paddingTop: LAYOUT.mediumSpacing,
  },
  chevronIcon: {
    position: 'absolute',
    top: '50%',
  },
  progressbarContainer: {
    gap: LAYOUT.smallSpacing,
    paddingHorizontal: LAYOUT.mediumSpacing,
    marginBottom: LAYOUT.largeSpacing,
  },
  progressBarHeaderTxt: {
    color: 'white',
    fontFamily: FONTS.medium,
    textAlign: 'center',
    fontSize: FONT_SIZES.smallScreen.subheading,
  },
  btnContainer: {
    paddingHorizontal: LAYOUT.mediumSpacing,
  },
  btn: {
    paddingHorizontal: LAYOUT.mediumSpacing,
    paddingVertical: LAYOUT.smallSpacing,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
  },
  disabledBtn: {
    borderColor: Theme.colors.disabled,
    backgroundColor: Theme.colors.disabled,
  },
  btnText: {
    fontSize: FONT_SIZES.smallScreen.bodyText,
    fontFamily: FONTS.bold,
    color: 'black',
    textAlign: 'center',
  },
  exitIcon: {
    position: 'absolute',
    top: LAYOUT.mediumSpacing + 4,
    right: LAYOUT.defaultSpacing,
    zIndex: 100,
  },
});
