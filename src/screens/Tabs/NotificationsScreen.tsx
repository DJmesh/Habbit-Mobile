import React, { useEffect, useMemo } from 'react';
import { View, Text, Vibration } from 'react-native';
import { Screen, Card, Title, Button } from '@/components/UI';
import { colors } from '@/theme/colors';
import { useReminders } from '@/store/reminders';

const FIVE_MIN = 5 * 60 * 1000;

function isToday(days: number[]) {
  const wd = new Date().getDay();
  return days.includes(wd as any);
}

function msToMin(ms: number) {
  return Math.max(0, Math.ceil(ms / 60000));
}

export default function NotificationsScreen() {
  const { reminders, load } = useReminders();
  useEffect(() => { load(); }, [load]);

  const today = useMemo(() => reminders.filter(r => isToday(r.days)), [reminders]);

  const dueSoon = useMemo(() => {
    const now = new Date();
    return today
      .map(r => {
        const t = new Date();
        t.setHours(r.hour, r.minute, 0, 0);
        const diff = +t - +now;
        return { r, diff };
      })
      .filter(x => x.diff >= 0 && x.diff <= FIVE_MIN)
      .sort((a,b) => a.diff - b.diff);
  }, [today]);

  return (
    <Screen>
      <Title>Notificações</Title>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Para hoje</Text>
        {today.length === 0 && <Text style={{ color: colors.subtext }}>Nenhum lembrete hoje.</Text>}
        {today.map((r) => {
          const t = new Date(); t.setHours(r.hour, r.minute, 0, 0);
          return (
            <View key={`${r.habitId}-${r.hour}-${r.minute}`} style={{ marginBottom: 8 }}>
              <Text style={{ color: colors.text }}>
                • {r.habitId} — {String(r.hour).padStart(2,'0')}:{String(r.minute).padStart(2,'0')}
              </Text>
            </View>
          );
        })}
      </Card>

      <Card>
        <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Faltando ≤ 5 min</Text>
        {dueSoon.length === 0 && <Text style={{ color: colors.subtext }}>Nada nos próximos 5 minutos.</Text>}
        {dueSoon.map(({ r, diff }) => (
          <View key={`soon-${r.habitId}-${r.hour}-${r.minute}`} style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.text }}>
              • {r.habitId} — em ~{msToMin(diff)} min ({String(r.hour).padStart(2,'0')}:{String(r.minute).padStart(2,'0')})
            </Text>
          </View>
        ))}
        <View style={{ height: 8 }} />
        <Button title="Testar alerta (vibração)" onPress={() => Vibration.vibrate(500)} />
      </Card>
    </Screen>
  );
}
