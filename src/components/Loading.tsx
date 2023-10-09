import { StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import React from 'react';

export const Loading = () => {
  return (
    <ImageBackground
      imageStyle={{ flex: 1 }}
      source={require('assets/imgs/background-stars.png')}
      style={styles.loadingContainer}
    >
      <ActivityIndicator color={'#F6E7BE'} size={'large'} />
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
