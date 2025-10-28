import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Screen, Card, Title } from '@/components/UI';
import { colors } from '@/theme/colors';
import { addMonths, eachDayOfInterval, endOfMonth, format, startOfMonth, parseISO, isWithinInterval } from 'date-fns';
import { useHabits } from '@/store/habits';
import { useSessionCache } from '@/store/sessionCache';

function DayCell({ date, hasLog, inRange }: { date: Date; hasLog: boolean; inRange: boolean }) {
  const bg = hasLog ? colors.success : (inRange ? colors.primary : colors.card);
  const fg = hasLog || inRange ? '#000' : colors.text;
  return (
    <View style={{ width: '14.28%', padding: 4 }}>
      <View
        style={{
          width: '100%',
          height: 44,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
        }}
      >
        <Text
          style={{ color: fg, fontWeight: '600', textAlign: 'center' }}
          numberOfLines={1}
          allowFontScaling={false}
        >
          {format(date, 'd')}
        </Text>
      </View>
    </View>
  );
}

export default function CalendarScreen() {
  const { db } = useHabits();
  const cache = useSessionCache();
  const [month, setMonth] = useState(new Date());

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  }, [month]);

  const hasLog = (d: Date) => db.logs.some(l => l.date.slice(0,10) === d.toISOString().slice(0,10));

  const inAnyRange = (d: Date) => {
    const all = cache.getAll();
    return all.some(p => {
      if (!p.startISO || !p.endISO) return false;
      const start = parseISO(p.startISO);
      const end = parseISO(p.endISO);
      return isWithinInterval(d, { start, end });
    });
  };

  return (
    <Screen>
      <Title>Calendário — {format(month, 'MM/yyyy')}</Title>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <TouchableOpacity onPress={() => setMonth(addMonths(month, -1))}><Text style={{ color: colors.primary }}>◀ Mês</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setMonth(new Date())}><Text style={{ color: colors.primary }}>Hoje</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setMonth(addMonths(month, 1))}><Text style={{ color: colors.primary }}>Próx mês ▶</Text></TouchableOpacity>
      </View>
      <Card>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {days.map((d) => (
            <DayCell key={d.toISOString()} date={d} hasLog={hasLog(d)} inRange={inAnyRange(d)} />
          ))}
        </View>
      </Card>
      <View style={{ height: 8 }} />
      <Text style={{ color: colors.subtext }}>Verde = dia com log • Azul = dentro do período de algum hábito</Text>
    </Screen>
  );
}
