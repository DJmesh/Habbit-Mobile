import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, Animated, Share } from 'react-native';
import { Screen, Card, Button, Title, Subtitle } from '@/components/UI';
import { useAchievements } from '@/store/achievements';
import Badge from '@/components/Badge';
import ConfettiBurst from '@/components/ConfettiBurst';
import Fireworks from '@/components/Fireworks';
import { colors } from '@/theme/colors';

export default function RewardsScreen() {
  const { badges, mockUnlockNext, resetAll, lastUnlockedId, clearLastUnlocked } = useAchievements();
  const [celebrating, setCelebrating] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  const scale = useMemo(() => new Animated.Value(0), []);
  const pop = () => {
    scale.setValue(0);
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 12 }).start();
  };

  useEffect(() => {
    if (!lastUnlockedId) return;
    setJustUnlocked(lastUnlockedId);
    setCelebrating(true);
    pop();
    const t = setTimeout(() => {
      setCelebrating(false);
      clearLastUnlocked();
    }, 1400);
    return () => clearTimeout(t);
  }, [lastUnlockedId, clearLastUnlocked]);

  const onShareAll = () => {
    const unlocked = badges.filter(b => b.unlocked);
    const lines = [
      '🏅 Minhas conquistas no HabitApp:',
      ...unlocked.map(b => `• ${b.title}`),
      unlocked.length ? '' : '• (ainda nenhuma — mas já já vem 💪)',
    ];
    Share.share({ message: lines.join('\n') });
  };

  const onShareUnlocked = () => {
    const b = badges.find(x => x.id === justUnlocked);
    if (!b) return;
    Share.share({
      message: `🏆 Conquista desbloqueada no HabitApp: ${b.title}\n${b.description}`,
    });
  };

  return (
    <Screen>
      <View style={{ gap: 12 }}>
        <Title>Recompensas</Title>
        <Subtitle>
          A 1ª interação libera a primeira conquista; depois em 5, 10 e 15 interações.
        </Subtitle>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Button title="Compartilhar minhas conquistas" onPress={onShareAll} />
          <Button title="Desbloquear mock" onPress={mockUnlockNext} />
          <Button title="Reset" onPress={resetAll} style={{ backgroundColor: colors.danger }} />
        </View>

        <Card style={{ marginTop: 8 }}>
          <FlatList
            data={badges}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 18 }}
            renderItem={({ item }) => (
              <Pressable disabled style={{ width: '32%', alignItems: 'center' }}>
                <Badge color={item.color} accent={item.accent} icon={item.icon} title={item.title} locked={!item.unlocked} />
              </Pressable>
            )}
          />
        </Card>
      </View>

      {celebrating && (
        <>
          <ConfettiBurst visible={true} />
          <Fireworks visible={true} color="#FFD54F" />
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View
              style={{
                transform: [{ scale }],
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12,
                borderRadius: 14,
                backgroundColor: colors.card
              }}
            >
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Parabéns! Conquista desbloqueada 🎉</Text>
              <Text style={{ color: colors.subtext, marginTop: 4 }}>
                {badges.find((b) => b.id === justUnlocked)?.title ?? 'Nova conquista'}
              </Text>
              <View style={{ height: 10 }} />
              <Button title="Compartilhar" onPress={onShareUnlocked} />
            </Animated.View>
          </View>
        </>
      )}
    </Screen>
  );
}
