import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  NativeScrollEvent,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

import DifficultyItem, { Difficultyitem } from 'components/Difficulty/DifficultyItem';
import { Progressbar } from 'components/Progressbar';

import { RootState } from 'redux/store';
import { useSelector } from 'react-redux';

import { backgroundImage } from 'assets/imgs';

import { LAYOUT } from 'constants/layout';
import { DIFFICULTIES_SCREEN_STRING } from 'constants/strings';
import { DIFFICULTIES } from 'constants/difficulties';
import { FONT_SIZES, FONTS } from 'constants/fonts';
import { THEME } from 'constants/theme';
import Footer from 'components/Difficulty/Footer';

const Difficulty = () => {
  const { width, height } = useWindowDimensions();

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
          size={LAYOUT.defaultIconSize}
          color={'white'}
          onPress={handleScrollForward}
        />
      )}
      <View style={styles.progressbarContainer}>
        <Text style={[styles.progressBarHeaderTxt]}>{DIFFICULTIES_SCREEN_STRING.completed}</Text>
        <Progressbar color={THEME.colors.primary} current={progress} total={total} />
      </View>
      <Footer listIndex={listIndex} isCurrentDifficulty={isCurrentDifficulty} />
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
    paddingHorizontal: LAYOUT.largeSpacing,
    marginBottom: LAYOUT.largeSpacing,
  },
  progressBarHeaderTxt: {
    color: 'white',
    fontFamily: FONTS.medium,
    textAlign: 'center',
    fontSize: FONT_SIZES.smallScreen.subHeading,
  },
  exitIcon: {
    position: 'absolute',
    top: LAYOUT.mediumSpacing + 4,
    right: LAYOUT.defaultSpacing,
    zIndex: 100,
  },
});
