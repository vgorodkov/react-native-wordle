import React from 'react';
import { Slot } from 'expo-router';

const Layout = () => {
  return <Slot screenOptions={{ headerShown: false }} />;
};

export default Layout;
