import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

type Props = {
  size?: number;
};

export default function LogoSpinner({ size = 100 }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;

  const spinnerRadius = size * 0.36; 
  const strokeWidth = Math.max(4, Math.round(size * 0.06));
  const logoDiameter = size * 0.36;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: spinnerRadius * 2,
          height: spinnerRadius * 2,
          borderRadius: spinnerRadius,
          borderWidth: strokeWidth,
          borderColor: colors.muted,
        }}
      />

      <Animated.View
        style={{
          position: 'absolute',
          width: spinnerRadius * 2,
          height: spinnerRadius * 2,
          borderRadius: spinnerRadius,
          borderWidth: strokeWidth,
          borderTopColor: colors.accent,
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          transform: [{ rotate }],
        }}
      />

      <View
        style={{
          width: logoDiameter,
          height: logoDiameter,
          borderRadius: logoDiameter / 2,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name="checkmark"
          size={Math.max(16, size * 0.18)}
          color={colors.text}
        />
      </View>
    </View>
  );
}
