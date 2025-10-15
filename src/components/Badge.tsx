import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  size?: number;
  color: string;
  accent: string;
  icon: 'trophy' | 'star' | 'flame' | 'diamond' | 'medal';
  title?: string;
  locked?: boolean;
};

export default function Badge({ size = 96, color, accent, icon, title, locked }: Props) {
  const dim = size;
  const inner = size * 0.62;

  const iconMap: Record<Props['icon'], keyof typeof Ionicons.glyphMap> = {
    trophy: 'trophy',
    star: 'star',
    flame: 'flame',
    diamond: 'diamond',
    medal: 'medal'
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: dim, height: dim, alignItems: 'center', justifyContent: 'center' }}>
        {/* anel/acento */}
        <View style={{
          position: 'absolute',
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          borderWidth: Math.max(4, Math.round(size * 0.08)),
          borderColor: locked ? '#3a3f48' : accent
        }} />
        <View style={{
          width: inner, height: inner, borderRadius: inner/2,
          backgroundColor: locked ? '#2A3440' : color,
          alignItems: 'center', justifyContent: 'center'
        }}>
          <Ionicons
            name={iconMap[icon]}
            size={Math.max(18, size * 0.38)}
            color={locked ? '#7C8696' : 'white'}
          />
        </View>
      </View>
      {title ? (
        <Text style={{ color: locked ? '#7C8696' : 'white', marginTop: 6, fontWeight: '600' }} numberOfLines={1}>
          {title}
        </Text>
      ) : null}
      {locked ? <Text style={{ color: '#7C8696', fontSize: 12 }}>Locked</Text> : null}
    </View>
  );
}
