import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen, Card, Input, Button, Title, Subtitle } from '@/components/UI';
import { useAuth } from '@/store/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Title>Criar conta</Title>
          <Subtitle>Use dados fictícios — tudo fica em cache local.</Subtitle>
          <Input placeholder="Nome" value={name} onChangeText={setName} />
          <View style={{ height: 12 }} />
          <Input placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <View style={{ height: 12 }} />
          <Input placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
          <View style={{ height: 16 }} />
          <Button title="Cadastrar" onPress={() => register(name, email, password, () => navigation.replace('AppTabs'))} />
        </Card>
      </View>
    </Screen>
  );
}
