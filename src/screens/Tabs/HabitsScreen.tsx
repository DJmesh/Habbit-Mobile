import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Screen, Card, Title, Input, Button } from '@/components/UI';
import { colors } from '@/theme/colors';
import { useHabits } from '@/store/habits';
import { Ionicons } from '@expo/vector-icons';

function HabitIcon({ name }: { name?: string }) {
  const size = 18;
  if (name === 'dumbbell') return <Ionicons name="barbell" size={size} color={colors.text} />;
  if (name === 'book') return <Ionicons name="book" size={size} color={colors.text} />;
  if (name === 'water') return <Ionicons name="water" size={size} color={colors.text} />;
  return <Ionicons name="checkmark-done" size={size} color={colors.text} />;
}

export default function HabitsScreen() {
  const { db, addHabit } = useHabits();
  const [title, setTitle] = useState('Caminhada');
  const [target, setTarget] = useState('1');

  return (
    <Screen>
      <Title>Gerenciar hábitos</Title>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Novo hábito</Text>
        <Input placeholder="Título" value={title} onChangeText={setTitle} />
        <View style={{ height: 8 }} />
        <Input placeholder="Meta por dia (número)" keyboardType="numeric" value={target} onChangeText={setTarget} />
        <View style={{ height: 8 }} />
        <Button title="Adicionar" onPress={() => addHabit(title, Number(target) || 1)} />
      </Card>

      <FlatList
        data={db.habits}
        keyExtractor={h => h.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <HabitIcon name={item.icon} />
              <Text style={{ color: colors.text, fontWeight: '600' }}>{item.title}</Text>
            </View>
            <Text style={{ color: colors.subtext }}>Meta por dia: {item.targetPerDay}</Text>
          </Card>
        )}
      />
    </Screen>
  );
}
