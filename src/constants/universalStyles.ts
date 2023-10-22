import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const UNIVERSAL_STYLES = StyleSheet.create({
  fullscreen: {
    width,
    height,
  },
});
