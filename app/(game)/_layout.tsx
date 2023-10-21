import React from 'react';
import { Slot } from 'expo-router';

const LAYOUT = () => {
  return <Slot screenOptions={{ headerShown: false }} />;
};

export default LAYOUT;
