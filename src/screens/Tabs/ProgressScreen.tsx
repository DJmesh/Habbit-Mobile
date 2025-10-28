import React, { useEffect } from 'react';
import { View, Text, Share } from 'react-native';
import { Screen, Card, Title, ProgressBar, Button } from '@/components/UI';
import { colors } from '@/theme/colors';
import { useSessionStats } from '@/store/sessionStats';

export default function ProgressScreen() {
  const { current, recompute } = useSessionStats();

  useEffect(() => { recompute(); }, [recompute]);

  if (!current) {
    return (
      <Screen>
        <Title>Progresso</Title>
        <Text style={{ color: colors.text }}>Carregando…</Text>
      </Screen>
    );
  }

  const onShare = () => {
    const lines = [
      '📊 Relatório Semanal (sessão)',
      `Total de marcações de hábitos: ${current.totalLogs}`,
      `Maior streak (dias seguidos): ${current.bestStreak}`,
      '',
      '📌 Por hábito:',
      ...current.perHabit.map(x => `• ${x.title}: ${x.count}`),
      '',
      '✅ Conclusão estimada por hábito:',
      ...current.completionPctByHabit.map(x => `• ${x.title}: ${x.pct}%`),
      '',
      '🗒️ Tarefas:',
      `Hoje: ${current.tasks.todayDone}/${current.tasks.todayTotal}`,
      `Semana: ${current.tasks.weekDone}/${current.tasks.weekTotal}`,
      '',
      '🍽️ Nutrição (hoje):',
      `Cal ${current.nutritionToday.calories} • P ${current.nutritionToday.protein}g • C ${current.nutritionToday.carbs}g • G ${current.nutritionToday.fat}g`,
      '',
      '🍽️ Nutrição (semana):',
      `Cal ${current.nutritionWeek.calories} • P ${current.nutritionWeek.protein}g • C ${current.nutritionWeek.carbs}g • G ${current.nutritionWeek.fat}g`,
    ];
    Share.share({ message: lines.join('\n') });
  };

  return (
    <Screen>
      <Title>Progresso</Title>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Resumo</Text>
        <Text style={{ color: colors.text }}>Entradas (hábitos/semana): {current.totalLogs}</Text>
        <Text style={{ color: colors.text }}>Maior streak: {current.bestStreak} dia(s)</Text>
        <View style={{ height: 8 }} />
        <Text style={{ color: colors.text, marginBottom: 6 }}>
          Tarefas — Hoje: {current.tasks.todayDone}/{current.tasks.todayTotal} • Semana: {current.tasks.weekDone}/{current.tasks.weekTotal}
        </Text>
        <Text style={{ color: colors.text }}>
          Nutrição (hoje) — Cal {current.nutritionToday.calories} • P {current.nutritionToday.protein}g • C {current.nutritionToday.carbs}g • G {current.nutritionToday.fat}g
        </Text>
        <Text style={{ color: colors.subtext }}>
          Nutrição (semana) — Cal {current.nutritionWeek.calories} • P {current.nutritionWeek.protein}g • C {current.nutritionWeek.carbs}g • G {current.nutritionWeek.fat}g
        </Text>
        <View style={{ height: 8 }} />
        <Button title="Compartilhar relatório" onPress={onShare} />
      </Card>

      {current.perHabit.map((row) => (
        <Card key={row.habitId} style={{ marginBottom: 8 }}>
          <Text style={{ color: colors.text, marginBottom: 6 }}>{row.title} — {row.count}</Text>
          <ProgressBar value={row.count} max={50} />
          <Text style={{ color: colors.subtext, marginTop: 6 }}>
            Conclusão estimada: {current.completionPctByHabit.find(x => x.habitId === row.habitId)?.pct ?? 0}%
          </Text>
        </Card>
      ))}
    </Screen>
  );
}
