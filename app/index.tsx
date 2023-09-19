import { StyleSheet, View, ImageBackground, Image } from 'react-native';
import React, { useCallback } from 'react';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const Start = () => {
  const [fontsLoaded, fontError] = useFonts({
    'JetBrainsMono-Regular': require('assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Bold': require('assets/fonts/JetBrainsMono-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <ImageBackground
        resizeMode="cover"
        style={styles.bgImg}
        source={require('../src/assets/first_theme.png')}
      />
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar translucent style="light" />
      <ImageBackground
        resizeMode="cover"
        style={styles.bgImg}
        source={require('../src/assets/first_theme.png')}
      >
        <Link style={styles.playBtn} href={'/main'}>
          Гуляць
        </Link>
        <Link style={styles.txt} href={'/rules'}>
          Правілы гульні
        </Link>
      </ImageBackground>
    </View>
  );
};

export default Start;

const styles = StyleSheet.create({
  container: { flex: 1 },
  playBtn: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'JetBrainsMono-Bold',
    borderBottomWidth: 4,
    borderColor: 'white',
  },
  bgImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  txt: {
    fontSize: 20,
    color: 'lightgray',
    fontFamily: 'JetBrainsMono-Bold',
  },
});
