import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const UNIVERSAL_STYLES = StyleSheet.create({
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreen: {
    width,
    height,
  },
  txt: {
    color: 'white',
  },
});
