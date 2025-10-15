import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type Piece = {
  x: Animated.Value;
  y: Animated.Value;
  r: Animated.Value;
  s: Animated.Value;
  o: Animated.Value;
  color: string;
  size: number;
  duration: number;
  angle: number;
};

type Props = {
  visible: boolean;
  onDone?: () => void;
  count?: number;
  colors?: string[];
};

const DEFAULT_COLORS = ['#2EAAB0','#7C4DFF','#FFC107','#FF5252','#00C853','#42A5F5','#FF7043','#1DE9B6'];

export default function ConfettiBurst({ visible, onDone, count = 28, colors = DEFAULT_COLORS }: Props) {
  const pieces = useMemo<Piece[]>(() => {
    return Array.from({ length: count }).map(() => {
      const x = new Animated.Value(0);
      const y = new Animated.Value(0);
      const r = new Animated.Value(0);
      const s = new Animated.Value(0.7 + Math.random() * 0.6);
      const o = new Animated.Value(0);
      const angle = (Math.random() * 2 * Math.PI);
      const distance = 90 + Math.random() * 140;
      const duration = 600 + Math.random() * 500;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 6 + Math.round(Math.random() * 8);

      // pré-posiciona para onde cada pedaço vai
      x.setValue(Math.cos(angle) * 16); // pequeno empurrão inicial
      y.setValue(Math.sin(angle) * 16);
      return { x, y, r, s, o, color, size, duration, angle, };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const started = useRef(false);

  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;

    const anims = pieces.map(p =>
      Animated.parallel([
        Animated.timing(p.o, { toValue: 1, duration: 120, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(p.x, { toValue: Math.cos(p.angle) * (90 + Math.random()*140), duration: p.duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(p.y, { toValue: Math.sin(p.angle) * (90 + Math.random()*140), duration: p.duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(p.r, { toValue: (Math.random() > 0.5 ? 1 : -1) * (Math.PI * (1 + Math.random()*2)), duration: p.duration, easing: Easing.linear, useNativeDriver: true }),
      ])
    );

    Animated.stagger(8, anims).start(() => {
      Animated.timing(new Animated.Value(1), { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        onDone && onDone();
        started.current = false;
      });
    });
  }, [visible, pieces, onDone]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        {pieces.map((p, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size * (0.6 + Math.random()*0.9),
              backgroundColor: p.color,
              opacity: p.o,
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                { rotate: p.r.interpolate({ inputRange: [-Math.PI, Math.PI], outputRange: ['-180deg','180deg'] }) },
                { scale: p.s }
              ],
              borderRadius: 2
            }}
          />
        ))}
      </View>
    </View>
  );
}
