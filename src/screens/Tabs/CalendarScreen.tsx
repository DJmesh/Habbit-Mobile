import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Screen, Card, Title } from '@/components/UI';
import { colors } from '@/theme/colors';
import { addMonths, eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import { useHabits } from '@/store/habits';

function DayCell({ date, has }: { date: Date; has: boolean }) {
  return (
    <View style={{ width: '14.28%', padding: 4 }}>
      <View style={{ paddingVertical: 10, borderRadius: 8, alignItems: 'center', backgroundColor: has ? colors.success : colors.card }}>
        <Text style={{ color: has ? 'white' : colors.text }}>{format(date, 'd')}</Text>
      </View>
    </View>
  );
}

export default function CalendarScreen() {
  const { db } = useHabits();
  const [month, setMonth] = useState(new Date());

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  }, [month]);

  const hasLog = (d: Date) => db.logs.some(l => l.date.slice(0,10) === d.toISOString().slice(0,10));

  return (
    <Screen>
      <Title>Calendário — {format(month, 'MM/yyyy')}</Title>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <TouchableOpacity onPress={() => setMonth(addMonths(month, -1))}><Text style={{ color: colors.primary }}>◀ Mês anterior</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setMonth(new Date())}><Text style={{ color: colors.primary }}>Hoje</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setMonth(addMonths(month, 1))}><Text style={{ color: colors.primary }}>Próximo mês ▶</Text></TouchableOpacity>
      </View>
      <Card>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {days.map((d) => (
            <DayCell key={d.toISOString()} date={d} has={hasLog(d)} />
          ))}
        </View>
      </Card>
    </Screen>
  );
}
