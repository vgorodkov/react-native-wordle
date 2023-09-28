import {
  Button,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Difficulties, useDifficulty } from 'components/DifficultyProvider';
import { Theme } from 'assets/theme';
import { removeValue } from 'utils/asyncStorage';

const DIFFICULTIES = [
  {
    description: 'Толькі назоўнікі. Простыя словы.',
    img: require('assets/sun.png'),
    name: 'Лёгкая',
  },
  {
    description: 'Усе часціны мовы. Простыя словы.',
    img: require('assets/halfmoon.png'),
    name: 'Сярэдняя',
  },
  {
    description: 'Усе часціны мовы. Толькі складаныя словы.',
    img: require('assets/moon.png'),
    name: 'Складаная',
  },
  {
    description: 'Усе словы. Можа трапіцца як складанае, так і лёгкае слова.',
    img: require('assets/flower.png'),
    name: 'Універсальная',
  },
];

interface Difficultyitem {
  img: number;
  description: string;
  name: string;
}

interface DifficultyItemProps extends Difficultyitem {
  setDifficulty: (difficulty: Difficulties) => void;
  difficultyIndex: number;
  activeDifficulty: number;
}

const DifficultyItem = ({
  description,
  setDifficulty,
  difficultyIndex,
  activeDifficulty,
  img,
  name,
}: DifficultyItemProps) => {
  const isActive = activeDifficulty === difficultyIndex;

  return (
    <View style={styles.difficultyItemContainer}>
      <View style={styles.difficultyItemContent}>
        <Text style={[styles.title, styles.txt, isActive && styles.activeTxt]}>{name}</Text>
        <Image style={styles.img} source={img} />
        <Text style={[styles.txt, styles.body, isActive && styles.activeTxt]}>{description}</Text>
      </View>
      <>
        {isActive && (
          <Text style={[styles.txt, styles.label, styles.activeTxt]}>Абраная зараз</Text>
        )}
      </>
    </View>
  );
};

const Difficulty = () => {
  const { difficulty, setDifficulty } = useDifficulty();
  const { width, height } = useWindowDimensions();
  const renderItem = ({ item, index }: { item: Difficultyitem; index: number }) => {
    return (
      <View style={{ width }}>
        <DifficultyItem
          description={item.description}
          name={item.name}
          img={item.img}
          setDifficulty={setDifficulty}
          difficultyIndex={index}
          activeDifficulty={difficulty}
        />
      </View>
    );
  };

  const listRef = useRef<FlatList | null>(null);

  const listPosition = useRef(difficulty);

  const handleScrollForward = () => {
    if (listPosition.current < DIFFICULTIES.length - 1) {
      listRef.current?.scrollToIndex({ animated: true, index: listPosition.current + 1 });
      listPosition.current++;
    }
  };

  const handleScrollBack = () => {
    if (listPosition.current > 0) {
      listRef.current?.scrollToIndex({ animated: true, index: listPosition.current - 1 });
      listPosition.current--;
    }
  };

  return (
    <ImageBackground source={require('assets/background-stars.png')} style={styles.container}>
      <FlatList
        data={DIFFICULTIES}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        ref={listRef}
        initialScrollIndex={difficulty}
        getItemLayout={(data, index) => ({ length: height, offset: width * index, index })}
        onMomentumScrollEnd={({ nativeEvent }) => {
          listPosition.current = Math.round(nativeEvent.contentOffset.x / width);
        }}
      />
      <Ionicons
        style={{ position: 'absolute', top: '50%', right: 8 }}
        name="chevron-forward-circle-outline"
        size={42}
        color={'white'}
        onPress={handleScrollForward}
      />
      <Ionicons
        style={{ position: 'absolute', top: '50%', left: 8 }}
        name="chevron-back-circle-outline"
        size={42}
        color={'white'}
        onPress={handleScrollBack}
      />
      <View style={{ paddingHorizontal: 32 }}>
        <Pressable
          style={styles.btn}
          onPress={() => {
            setDifficulty(listPosition.current);

            removeValue('target');
            removeValue('word-rows');
          }}
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
    paddingBottom: 32,

    paddingTop: 64,
  },
  txt: {
    color: 'white',
    fontFamily: 'JetBrainsMono-Regular',
    textAlign: 'center',
  },
  activeTxt: {
    color: '#F6E7BE',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  body: {
    fontSize: 18,
    fontWeight: '500',
  },
  difficultyItemContainer: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingBottom: 16,
    width: '80%',
  },
  difficultyItemContent: {
    gap: 32,
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'white',

    backgroundColor: '#F6E7BE',
    borderRadius: 15,
  },
  activeDifficulty: {
    backgroundColor: Theme.colors.correctLetter,
  },
  img: {
    height: 130,
    marginTop: 32,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
  },
});
