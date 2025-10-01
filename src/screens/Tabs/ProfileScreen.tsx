import React from 'react';
import { Text } from 'react-native';
import { Screen, Card, Title, Button } from '@/components/UI';
import { colors } from '@/theme/colors';
import { useAuth } from '@/store/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AppTabs'>;

export default function ProfileScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  return (
    <Screen>
      <Title>Perfil</Title>
      <Card style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Nome: {user?.name}</Text>
        <Text style={{ color: colors.subtext }}>E-mail: {user?.email}</Text>
      </Card>
      <Button title="Sair" onPress={() => signOut(() => navigation.replace('Login'))} />
    </Screen>
  );
}
