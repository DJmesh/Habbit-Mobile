import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type Props = { visible: boolean; color?: string };

export default function Fireworks({ visible, color = '#FFD54F' }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    scale.setValue(0);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 380, useNativeDriver: true })
      ])
    ]).start();
  }, [visible, scale, opacity]);

  if (!visible) return null;

  const rays = Array.from({ length: 10 });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        {rays.map((_, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 90,
              backgroundColor: color,
              borderRadius: 2,
              opacity,
              transform: [
                { rotate: `${(360 / rays.length) * i}deg` },
                { translateY: -45 },
                { scale }
              ]
            }}
          />
        ))}
      </View>
    </View>
  );
}
