import { StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import React from 'react';
import { backgroundImage } from 'assets/imgs';
import { Theme } from 'constants/theme';

export const Loading = () => {
  return (
    <ImageBackground
      imageStyle={{ flex: 1 }}
      source={backgroundImage}
      style={styles.loadingContainer}
    >
      <ActivityIndicator color={Theme.colors.primary} size={'large'} />
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
