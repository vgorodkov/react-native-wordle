import { StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import React from 'react';

export const Loading = () => {
  return (
    <ImageBackground
      imageStyle={{ flex: 1 }}
      source={require('assets/first_theme.png')}
      style={styles.loadingContainer}
    >
      <ActivityIndicator color={'white'} size={'large'} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
