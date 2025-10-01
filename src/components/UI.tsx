import React from 'react';
import { colors } from '@/theme/colors';
import { Pressable, Text, TextInput, View, ViewProps } from 'react-native';

export function Screen({ children, style, ...rest }: ViewProps & { children: React.ReactNode }) {
  return <View style={[{ flex: 1, backgroundColor: colors.bg, padding: 16 }, style]} {...rest}>{children}</View>;
}

export function Card({ children, style, ...rest }: ViewProps & { children: React.ReactNode }) {
  return <View style={[{ backgroundColor: colors.card, borderRadius: 16, padding: 16 }, style]} {...rest}>{children}</View>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 8 }}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: colors.subtext, fontSize: 14, marginBottom: 12 }}>{children}</Text>;
}

export function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}>
      <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>{title}</Text>
    </Pressable>
  );
}

export const Input = React.forwardRef<TextInput, React.ComponentProps<typeof TextInput>>((props, ref) => (
  <TextInput
    ref={ref}
    placeholderTextColor={colors.subtext}
    style={{ backgroundColor: colors.muted, color: colors.text, padding: 12, borderRadius: 10 }}
    {...props}
  />
));
Input.displayName = 'Input';

export function ProgressBar({ value, max=1 }: { value: number; max?: number }) {
  const pct = Math.min(1, value / max);
  return (
    <View style={{ height: 10, backgroundColor: colors.muted, borderRadius: 999, overflow: 'hidden' }}>
      <View style={{ width: `${pct*100}%`, height: '100%', backgroundColor: colors.success }} />
    </View>
  );
}
