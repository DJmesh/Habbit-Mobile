import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Screen, Card, Title, ProgressBar } from '@/components/UI';
import { colors } from '@/theme/colors';
import { useHabits } from '@/store/habits';

export default function ProgressScreen() {
  const { db } = useHabits();

  const perHabit = useMemo(() => {
    return db.habits.map(h => {
      const logs = db.logs.filter(l => l.habitId === h.id);
      const total = logs.length;
      return { habit: h.title, total };
    });
  }, [db]);

  const totalLogs = db.logs.length;

  return (
    <Screen>
      <Title>Progresso</Title>
      <Card style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Resumo</Text>
        <Text style={{ color: colors.text }}>Entradas totais: {totalLogs}</Text>
      </Card>

      {perHabit.map((row) => (
        <Card key={row.habit} style={{ marginBottom: 8 }}>
          <Text style={{ color: colors.text, marginBottom: 6 }}>{row.habit}</Text>
          <ProgressBar value={row.total} max={50} />
        </Card>
      ))}
    </Screen>
  );
}
