import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Screen, Card, Title, Subtitle, Button, ProgressBar, Input } from '@/components/UI';
import { colors } from '@/theme/colors';
import { useHabits } from '@/store/habits';
import { useNutrition } from '@/store/nutrition';
import { useTasks } from '@/store/tasks';
import { useSessionStats } from '@/store/sessionStats';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { tap } from '@/lib/interaction';

export default function TodayScreen() {
  const { db, setDoneToday } = useHabits();
  const nutri = useNutrition();
  const tasks = useTasks();
  const { recompute } = useSessionStats();

  const todayISO = new Date().toISOString();
  const totals = nutri.totalsForDate(todayISO);

  const [mealName, setMealName] = useState('Lanche');
  const [cal, setCal] = useState('200');
  const [prot, setProt] = useState('10');
  const [carb, setCarb] = useState('20');
  const [fat, setFat] = useState('8');

  const [taskTitle, setTaskTitle] = useState('Beber água agora');

  const todayLogsMap = Object.fromEntries(
    db.logs
      .filter(l => l.date.slice(0,10) === todayISO.slice(0,10))
      .map(l => [l.habitId, l.amount])
  );

  const todayTasks = tasks.db.tasks.filter(t => t.date.slice(0,10) === todayISO.slice(0,10));

  return (
    <Screen>
      <Title>Hoje — {format(new Date(), 'dd/MM')}</Title>
      <Subtitle>Resumo diário de hábitos, tarefas e nutrição.</Subtitle>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Hábitos</Text>
        <FlatList
          data={db.habits}
          keyExtractor={h => h.id}
          renderItem={({ item }) => {
            const done = todayLogsMap[item.id] ?? 0;
            return (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: colors.text, marginBottom: 6 }}>{item.title} ({done}/{item.targetPerDay})</Text>
                <ProgressBar value={done} max={item.targetPerDay} />
                <View style={{ height: 8 }} />
                <Button
                  title="Marcar agora"
                  onPress={() => {
                    setDoneToday(item.id);
                    tap();
                    recompute();
                  }}
                />
              </View>
            );
          }}
        />
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Tarefas do dia</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Input placeholder="Nova tarefa" value={taskTitle} onChangeText={setTaskTitle} />
          </View>
          <View style={{ width: 120 }}>
            <Button
              title="Adicionar"
              onPress={() => {
                tasks.addTask(taskTitle);
                tap();
                recompute();
              }}
            />
          </View>
        </View>
        <View style={{ height: 12 }} />
        {todayTasks.map(t => (
          <View key={t.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
            <Ionicons
              name={t.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={t.done ? colors.success : colors.subtext}
              onPress={() => { tasks.toggleTask(t.id); tap(); recompute(); }}
            />
            <Text
              onPress={() => { tasks.toggleTask(t.id); tap(); recompute(); }}
              style={{ color: t.done ? colors.subtext : colors.text, textDecorationLine: t.done ? 'line-through' : 'none' }}
            >
              {t.title}
            </Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Nutrição</Text>
        <Text style={{ color: colors.text, marginBottom: 6 }}>
          Total de hoje: Cal {totals.calories} • P {totals.protein}g • C {totals.carbs}g • G {totals.fat}g
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Input placeholder="Refeição" value={mealName} onChangeText={setMealName} style={{ flex: 1, color: '#fff'}} />
          <Input placeholder="Cal" keyboardType="numeric" value={cal} onChangeText={setCal} style={{ width: 70, color: '#fff' }} />
          <Input placeholder="P" keyboardType="numeric" value={prot} onChangeText={setProt} style={{ width: 70, color: '#fff' }} />
          <Input placeholder="C" keyboardType="numeric" value={carb} onChangeText={setCarb} style={{ width: 70, color: '#fff' }} />
          <Input placeholder="G" keyboardType="numeric" value={fat} onChangeText={setFat} style={{ width: 70, color: '#fff' }} />
        </View>
        <View style={{ height: 8 }} />
        <Button
          title="Lançar refeição"
          onPress={() => {
            nutri.addMeal(mealName, Number(cal)||0, Number(prot)||0, Number(carb)||0, Number(fat)||0);
            tap();
            recompute();
          }}
        />
      </Card>
    </Screen>
  );
}
