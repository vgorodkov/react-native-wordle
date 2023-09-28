import AsyncStorage from '@react-native-async-storage/async-storage';

export const removeValue = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {}
};

export const storeObj = async (wordRows: string[], key: string) => {
  try {
    const jsonValue = JSON.stringify(wordRows);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {}
};

export const storeStr = async (target: string, key: string) => {
  try {
    await AsyncStorage.setItem(key, target);
  } catch (e) {}
};

export const getStoredObj = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);

    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {}
};

export const getStoredStr = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {}
};
