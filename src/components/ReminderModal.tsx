import React from 'react';
import { Modal, View, Text, Vibration } from 'react-native';
import { Button, Card } from '@/components/UI';
import { colors } from '@/theme/colors';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
};

export default function ReminderModal({ visible, title, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onShow={() => Vibration.vibrate(400)} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#0009', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ width: '88%' }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Hora do hábito! ⏰</Text>
          <Text style={{ color: colors.subtext, marginTop: 6 }}>
            {title}
          </Text>
          <View style={{ height: 10 }} />
          <Button title="Ok, vou fazer" onPress={onClose} />
        </Card>
      </View>
    </Modal>
  );
}
