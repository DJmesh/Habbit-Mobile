import React, { useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Screen, Card, Title, Input, Button, Subtitle } from '@/components/UI';
import { colors } from '@/theme/colors';
import { useNutrition } from '@/store/nutrition';
import { format } from 'date-fns';

export default function NutritionScreen() {
  const nutri = useNutrition();
  const todayISO = new Date().toISOString();
  const [name, setName] = useState('Café');
  const [cal, setCal] = useState('80');
  const [prot, setProt] = useState('2');
  const [carb, setCarb] = useState('10');
  const [fat, setFat] = useState('3');

  const mealsToday = nutri.db.meals.filter(m => m.date.slice(0,10) === todayISO.slice(0,10));
  const totals = nutri.totalsForDate(todayISO);

  return (
    <Screen>
      <Title>Nutrição — {format(new Date(), 'dd/MM')}</Title>
      <Subtitle>Registre suas refeições e acompanhe macros</Subtitle>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Adicionar refeição</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Input placeholder="Nome" value={name} onChangeText={setName} style={{ flex: 1 }} />
          <Input placeholder="Cal" keyboardType="numeric" value={cal} onChangeText={setCal} style={{ width: 70 }} />
          <Input placeholder="P" keyboardType="numeric" value={prot} onChangeText={setProt} style={{ width: 70 }} />
          <Input placeholder="C" keyboardType="numeric" value={carb} onChangeText={setCarb} style={{ width: 70 }} />
          <Input placeholder="G" keyboardType="numeric" value={fat} onChangeText={setFat} style={{ width: 70 }} />
        </View>
        <View style={{ height: 8 }} />
        <Button title="Salvar refeição" onPress={() => nutri.addMeal(name, Number(cal)||0, Number(prot)||0, Number(carb)||0, Number(fat)||0)} />
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.text, fontWeight: '700' }}>Totais do dia</Text>
        <Text style={{ color: colors.text }}>Calorias: {totals.calories} • Proteína: {totals.protein}g • Carbo: {totals.carbs}g • Gordura: {totals.fat}g</Text>
      </Card>

      <FlatList
        data={mealsToday}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>{item.name}</Text>
            <Text style={{ color: colors.subtext }}>Cal {item.calories} • P {item.protein}g • C {item.carbs}g • G {item.fat}g</Text>
          </Card>
        )}
      />
    </Screen>
  );
}
