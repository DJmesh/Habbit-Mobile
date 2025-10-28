import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { Screen, Card, Title, Input, Button } from '@/components/UI';
import { colors } from '@/theme/colors';
import { useHabits } from '@/store/habits';
import { useReminders } from '@/store/reminders';
import { Ionicons } from '@expo/vector-icons';
import { tap } from '@/lib/interaction';
import { useSessionCache } from '@/store/sessionCache';
import InlineMonthPicker from '@/components/InlineMonthPicker';

type Weekday = 0|1|2|3|4|5|6;
const WEEK_LABELS = ['D','S','T','Q','Q','S','S'];

function HabitIcon({ name }: { name?: string }) {
  const size = 18;
  if (name === 'dumbbell') return <Ionicons name="barbell" size={size} color={colors.text} />;
  if (name === 'book') return <Ionicons name="book" size={size} color={colors.text} />;
  if (name === 'water') return <Ionicons name="water" size={size} color={colors.text} />;
  return <Ionicons name="checkmark-done" size={size} color={colors.text} />;
}

type LocalState = {
  hour: string;
  minute: string;
  days: Weekday[];
  startISO: string;
  endISO: string;
};

export default function HabitsScreen() {
  const { db, addHabit } = useHabits();
  const reminders = useReminders();
  const cache = useSessionCache();

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('1');

  const [mapState, setMapState] = useState<Record<string, LocalState>>({});
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerFor, setPickerFor] = useState<{ habitId: string; field: 'start'|'end' } | null>(null);

  useEffect(() => { reminders.load(); cache.load(); }, []);

  useEffect(() => {
    const next: Record<string, LocalState> = {};
    for (const h of db.habits) {
      const rem = reminders.reminders.find(r => r.habitId === h.id);
      const period = cache.getPeriod(h.id);
      next[h.id] = {
        hour: String(rem?.hour ?? 8).padStart(2, '0'),
        minute: String(rem?.minute ?? 0).padStart(2, '0'),
        days: (rem?.days as Weekday[]) ?? [1,2,3,4,5],
        startISO: period?.startISO ?? '',
        endISO: period?.endISO ?? '',
      };
    }
    setMapState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db.habits.length, reminders.reminders.length]);

  const toggleDay = (habitId: string, d: Weekday) => {
    setMapState((s) => {
      const cur = s[habitId];
      const ndays = cur.days.includes(d) ? cur.days.filter(x => x !== d) : [...cur.days, d].sort();
      return { ...s, [habitId]: { ...cur, days: ndays } };
    });
  };

  const setHour = (habitId: string, v: string) =>
    setMapState(s => ({ ...s, [habitId]: { ...s[habitId], hour: v } }));
  const setMinute = (habitId: string, v: string) =>
    setMapState(s => ({ ...s, [habitId]: { ...s[habitId], minute: v } }));

  const openPicker = (habitId: string, field: 'start'|'end') => {
    setPickerFor({ habitId, field });
    setPickerVisible(true);
  };

  const onPicked = async (iso: string) => {
    if (!pickerFor) return;
    const { habitId, field } = pickerFor;
    setPickerVisible(false);
    setPickerFor(null);

    setMapState(s => {
      const cur = s[habitId];
      const ns = { ...cur, [field === 'start' ? 'startISO' : 'endISO']: iso };
      return { ...s, [habitId]: ns };
    });

    if (field === 'start') await cache.setStart(habitId, iso);
    else await cache.setEnd(habitId, iso);
    tap();
  };

  return (
    <Screen>
      <Title>Hábitos</Title>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.subtext, marginBottom: 6 }}>Adicionar novo hábito</Text>
        <Input placeholder="Título" value={title} onChangeText={setTitle} />
        <View style={{ height: 8 }} />
        <Input placeholder="Meta por dia" keyboardType="numeric" value={target} onChangeText={setTarget} />
        <View style={{ height: 12 }} />
        <Button
          title="Salvar hábito"
          onPress={() => {
            if (!title.trim()) return;
            addHabit(title.trim(), Number(target) || 1);
            tap();
            setTitle('');
            setTarget('1');
          }}
        />
      </Card>

      <FlatList
        data={db.habits}
        keyExtractor={h => h.id}
        renderItem={({ item }) => {
          const local = mapState[item.id];
          if (!local) return null;
          const rem = reminders.reminders.find(r => r.habitId === item.id);

          return (
            <Card style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <HabitIcon name={item.icon} />
                <Text style={{ color: colors.text, fontWeight: '600' }}>{item.title}</Text>
              </View>
              <Text style={{ color: colors.subtext, marginBottom: 8 }}>Meta por dia: {item.targetPerDay}</Text>

              <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 6 }}>Período (cache sessão)</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                <View style={{ flex: 1, gap: 6 }}>
                  <Input placeholder="Início (yyyy-mm-dd)" value={local.startISO} onChangeText={() => {}} editable={false} style={{ color: '#fff' }} />
                  <Button title="Escolher início" onPress={() => openPicker(item.id, 'start')} />
                </View>
                <View style={{ flex: 1, gap: 6 }}>
                  <Input placeholder="Fim (yyyy-mm-dd)" value={local.endISO} onChangeText={() => {}} editable={false} style={{ color: '#fff' }} />
                  <Button title="Escolher fim" onPress={() => openPicker(item.id, 'end')} />
                </View>
              </View>

              <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 6 }}>Lembrete</Text>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <Input placeholder="HH" keyboardType="numeric" value={local.hour} onChangeText={(v) => setHour(item.id, v)} style={{ width: 64, color: '#fff' }} />
                <Text style={{ color: colors.text }}>:</Text>
                <Input placeholder="MM" keyboardType="numeric" value={local.minute} onChangeText={(v) => setMinute(item.id, v)} style={{ width: 64, color: '#fff' }} />
              </View>

              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                {WEEK_LABELS.map((lbl, idx) => {
                  const d = idx as Weekday;
                  const active = local.days.includes(d);
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => toggleDay(item.id, d)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: active ? colors.primary : colors.border,
                        backgroundColor: active ? colors.primary : 'transparent',
                        marginBottom: 6,
                      }}
                    >
                      <Text style={{ color: active ? '#000' : colors.text, fontWeight: '700' }}>{lbl}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button
                  title={rem ? 'Atualizar lembrete' : 'Ativar lembrete'}
                  onPress={() => {
                    const h = Math.max(0, Math.min(23, Number(local.hour) || 0));
                    const m = Math.max(0, Math.min(59, Number(local.minute) || 0));
                    reminders.setReminder(item.id, h, m, local.days);
                    tap();
                  }}
                />
                {rem && (
                  <Button variant="secondary" title="Remover" onPress={() => { reminders.removeReminder(item.id); tap(); }} />
                )}
              </View>

              {rem && (
                <Text style={{ color: colors.subtext, marginTop: 6 }}>
                  Ativo em {rem.days.length} dia(s) • {String(rem.hour).padStart(2,'0')}:{String(rem.minute).padStart(2,'0')}
                </Text>
              )}
            </Card>
          );
        }}
      />

      <InlineMonthPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onPick={onPicked}
        initial={pickerFor ? (pickerFor.field === 'start' ? mapState[pickerFor.habitId]?.startISO : mapState[pickerFor.habitId]?.endISO) : undefined}
      />
    </Screen>
  );
}
