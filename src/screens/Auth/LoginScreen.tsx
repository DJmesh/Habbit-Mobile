import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Screen, Card, Input, Button, Title, Subtitle } from '@/components/UI';
import { colors } from '@/theme/colors';
import { useAuth } from '@/store/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('edu@example.com');
  const [password, setPassword] = useState('123456');

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Title>Bem-vindo 👋</Title>
          <Subtitle>Entre para acompanhar seus hábitos, tarefas e nutrição.</Subtitle>
          <Input placeholder="E-mail" keyboardType="email-addresss" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <View style={{ height: 12 }} />
          <Input placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
          <View style={{ height: 16 }} />
          <Button title="Entrar" onPress={() => login(email, password, () => navigation.replace('AppTabs'))} />
          <View style={{ height: 12 }} />
          <Text style={{ color: colors.subtext, textAlign: 'center' }}>
            Não tem conta? <Text onPress={() => navigation.navigate('Register')} style={{ color: colors.primary }}>Cadastre-se</Text>
          </Text>
        </Card>
      </View>
    </Screen>
  );
}
