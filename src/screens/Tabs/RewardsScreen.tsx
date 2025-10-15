import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Animated, Easing } from 'react-native';
import { Screen, Card, Button, Title, Subtitle } from '@/components/UI';
import { useAchievements } from '@/store/achievements';
import Badge from '@/components/Badge';
import ConfettiBurst from '@/components/ConfettiBurst';
import Fireworks from '@/components/Fireworks';
import { colors } from '@/theme/colors';

export default function RewardsScreen() {
  const { badges, unlock, mockUnlockNext, resetAll } = useAchievements();
  const [celebrating, setCelebrating] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  const scale = new Animated.Value(0);
  const pop = () => {
    scale.setValue(0);
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 12 }).start();
  };

  function handleMockUnlock() {
    const id = mockUnlockNext();
    if (!id) return;
    setJustUnlocked(id);
    setCelebrating(true);
    pop();
    setTimeout(() => setCelebrating(false), 1200);
  }

  function handleUnlock(badgeId: string) {
    const ok = unlock(badgeId);
    if (!ok) return;
    setJustUnlocked(badgeId);
    setCelebrating(true);
    pop();
    setTimeout(() => setCelebrating(false), 1200);
  }

  return (
    <Screen>
      <View style={{ gap: 12 }}>
        <Title>Recompensas</Title>
        <Subtitle> Colecione emblemas conforme você completa suas metas. Toque em um emblema bloqueado para reivindicar.</Subtitle>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title="Desbloqueie uma recompensa mock" onPress={handleMockUnlock} />
          <Button title="Reset" onPress={resetAll} style={{ backgroundColor: colors.danger }} />
        </View>

        <Card style={{ marginTop: 8 }}>
          <FlatList
            data={badges}
            keyExtractor={item => item.id}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 18 }}
            renderItem={({ item }) => (
              <Pressable onPress={() => !item.unlocked && handleUnlock(item.id)} style={{ width: '32%', alignItems: 'center' }}>
                <Badge
                  color={item.color}
                  accent={item.accent}
                  icon={item.icon}
                  title={item.title}
                  locked={!item.unlocked}
                />
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
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Achievement Unlocked!</Text>
              <Text style={{ color: colors.subtext, marginTop: 4 }}>
                {badges.find(b => b.id === justUnlocked)?.title ?? 'New Badge'}
              </Text>
            </Animated.View>
          </View>
        </>
      )}
    </Screen>
  );
}
