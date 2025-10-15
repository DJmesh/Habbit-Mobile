import React from 'react';
import { Pressable, Text, TextInput, View, ViewProps, TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

export function Screen({ children, style, ...rest }: ViewProps & { children: React.ReactNode }) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[{ flex: 1, padding: 16 }, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

export function Card({ children, style, ...rest }: ViewProps & { children: React.ReactNode }) {
  return (
    <View style={[{ backgroundColor: colors.card, borderRadius: 16, padding: 16 }, style]} {...rest}>
      {children}
    </View>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 8 }}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: colors.subtext, fontSize: 14, marginBottom: 12 }}>{children}</Text>;
}

type ButtonProps = { title: string; onPress?: () => void; disabled?: boolean; style?: any; };

export function Button({ title, onPress, disabled, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? colors.muted : colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ color: colors.text, fontWeight: '700' }}>{title}</Text>
    </Pressable>
  );
}

export const Input = React.forwardRef<TextInput, TextInputProps>((props, ref) => (
  <TextInput
    ref={ref}
    placeholderTextColor={colors.subtext}
    style={{ backgroundColor: colors.muted, color: colors.text, padding: 12, borderRadius: 10 }}
    {...props}
  />
));
Input.displayName = 'Input';

export function ProgressBar({ value, max = 1 }: { value: number; max?: number }) {
  const pct = Math.min(1, value / max);
  return (
    <View style={{ height: 10, backgroundColor: colors.muted, borderRadius: 999, overflow: 'hidden' }}>
      <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: colors.success }} />
    </View>
  );
}
