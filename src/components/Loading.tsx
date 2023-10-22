import { StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import React from 'react';
import { backgroundImage } from 'assets/imgs';
import { THEME } from 'constants/theme';
import { UNIVERSAL_STYLES } from 'constants/universalStyles';

export const Loading = () => {
  return (
    <ImageBackground
      imageStyle={[{ flex: 1 }, UNIVERSAL_STYLES.fullscreen]}
      source={backgroundImage}
      style={styles.loadingContainer}
    >
      <ActivityIndicator color={THEME.colors.primary} size={'large'} />
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
