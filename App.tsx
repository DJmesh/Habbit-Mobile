import React, { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from '@/screens/Auth/LoginScreen';
import RegisterScreen from '@/screens/Auth/RegisterScreen';
import Tabs from '@/navigation/Tabs';
import TransitionOverlay from '@/components/TransitionOverlay';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AppTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const routeNameRef = useRef<string | undefined>(undefined);
  const overlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const triggerOverlay = () => {
    if (overlayTimer.current) clearTimeout(overlayTimer.current);
    setOverlayVisible(true);
    overlayTimer.current = setTimeout(() => setOverlayVisible(false), 650);
  };

  useEffect(() => {
    return () => {
      if (overlayTimer.current) clearTimeout(overlayTimer.current);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        }}
        onStateChange={() => {
          const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
          if (routeNameRef.current && currentRouteName && routeNameRef.current !== currentRouteName) {
            triggerOverlay();
          }
          routeNameRef.current = currentRouteName;
        }}
      >
        {/* StatusBar translúcida e clara */}
        <StatusBar style="light" translucent backgroundColor="transparent" />

        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade', // pode trocar p/ 'slide_from_right' etc.
          }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="AppTabs" component={Tabs} />
        </Stack.Navigator>

        {/* Overlay animado entre transições */}
        <TransitionOverlay visible={overlayVisible} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
