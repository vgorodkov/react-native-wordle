import AsyncStorage from '@react-native-async-storage/async-storage';

export const removeValue = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {}
};
