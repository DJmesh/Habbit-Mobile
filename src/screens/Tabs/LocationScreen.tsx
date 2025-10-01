import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Screen, Card, Title, Button, Subtitle } from '@/components/UI';
import { colors } from '@/theme/colors';
import { useLocationStore } from '@/store/location';

function fmtTime(ts?: number) {
  if (!ts) return '-';
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

export default function LocationScreen() {
  const loc = useLocationStore();

  const sessions = loc.db.gpsSessions.slice().reverse();

  return (
    <Screen>
      <Title>Locais (gravação manual)</Title>
      <Subtitle>Ative para registrar lat/lon e horário. Funciona com o app aberto.</Subtitle>

      <Card style={{ marginBottom: 12 }}>
        {loc.recording ? (
          <Button title="Parar gravação" onPress={loc.stop} />
        ) : (
          <Button title="Iniciar gravação" onPress={loc.start} />
        )}
        <View style={{ height: 8 }} />
        <Text style={{ color: loc.recording ? colors.success : colors.subtext }}>
          Status: {loc.recording ? 'Gravando...' : 'Parado'}
        </Text>
      </Card>

      <FlatList
        data={sessions}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>Sessão {item.id}</Text>
            <Text style={{ color: colors.subtext }}>Início: {fmtTime(item.startedAt)} • Fim: {fmtTime(item.endedAt)}</Text>
            <View style={{ height: 8 }} />
            {item.points.slice().reverse().slice(0,5).map(p => (
              <Text key={p.id} style={{ color: colors.text }}>
                {new Date(p.timestamp).toLocaleTimeString()} — lat {p.lat.toFixed(5)}, lon {p.lon.toFixed(5)}
              </Text>
            ))}
            {item.points.length > 5 && (
              <Text style={{ color: colors.subtext, marginTop: 4 }}>... (+{item.points.length - 5} pontos)</Text>
            )}
          </Card>
        )}
      />
    </Screen>
  );
}
