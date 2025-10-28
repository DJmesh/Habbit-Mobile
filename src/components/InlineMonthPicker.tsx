import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';
import { colors } from '@/theme/colors';
import { Card, Button } from './UI';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (isoYYYYMMDD: string) => void;
  initial?: string | null;
};

type Cell = { key: string; day?: number; iso?: string; isPlaceholder?: boolean };

const WEEK_LABELS = ['D','S','T','Q','Q','S','S'];

export default function InlineMonthPicker({ visible, onClose, onPick, initial }: Props) {
  const [month, setMonth] = useState(() => {
    const d = initial ? new Date(initial) : new Date();
    d.setDate(1);
    return d;
  });

  const { title, matrix } = useMemo(() => {
    const first = startOfMonth(month);
    const last = endOfMonth(month);
    const startWeekday = first.getDay();
    const daysInMonth = last.getDate();

    const cells: Cell[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ key: `ph-${i}`, isPlaceholder: true });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(month); date.setDate(d);
      const iso = date.toISOString().slice(0, 10);
      cells.push({ key: `d-${iso}`, day: d, iso });
    }
    while (cells.length % 7 !== 0) cells.push({ key: `pt-${cells.length}`, isPlaceholder: true });
    while (cells.length < 42) cells.push({ key: `pt-${cells.length}`, isPlaceholder: true });

    const grid: Cell[][] = [];
    for (let r = 0; r < 6; r++) grid.push(cells.slice(r * 7, r * 7 + 7));

    return { title: format(month, 'MMMM yyyy'), matrix: grid };
  }, [month, initial]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#0009', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ width: '92%', paddingBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity onPress={() => setMonth(addMonths(month, -1))}><Text style={{ color: colors.primary, fontSize: 18 }}>◀</Text></TouchableOpacity>
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{title}</Text>
            <TouchableOpacity onPress={() => setMonth(addMonths(month, 1))}><Text style={{ color: colors.primary, fontSize: 18 }}>▶</Text></TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            {WEEK_LABELS.map((w, i) => (
              <View key={`w-${i}`} style={{ width: `${100/7}%`, paddingVertical: 6, alignItems: 'center' }}>
                <Text style={{ color: colors.subtext, fontWeight: '700' }}>{w}</Text>
              </View>
            ))}
          </View>

          <View>
            {matrix.map((row, i) => (
              <View key={`r-${i}`} style={{ flexDirection: 'row' }}>
                {row.map((c) => {
                  if (c.isPlaceholder) {
                    return (
                      <View key={c.key} style={{ width: `${100/7}%`, padding: 4 }}>
                        <View style={{ paddingVertical: 12, borderRadius: 8, alignItems: 'center', backgroundColor: colors.card, opacity: 0.35 }}>
                          <Text style={{ color: colors.subtext }}> </Text>
                        </View>
                      </View>
                    );
                  }
                  return (
                    <TouchableOpacity key={c.key} onPress={() => c.iso && onPick(c.iso)} style={{ width: `${100/7}%`, padding: 4 }}>
                      <View style={{ paddingVertical: 12, borderRadius: 8, alignItems: 'center', backgroundColor: colors.card }}>
                        <Text style={{ color: colors.text, fontWeight: '600' }}>{c.day}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={{ height: 10 }} />
          <Button title="Fechar" onPress={onClose} />
        </Card>
      </View>
    </Modal>
  );
}
