import React from 'react';
import { create } from 'zustand';
import { getItem, setItem } from '@/lib/storage';
import { seed, type DB, type User } from '@/lib/mockDb';
import { Alert } from 'react-native';

const KEY = 'DB_V1';

type AuthState = {
  bootstrapped: boolean;
  db: DB;
  user: User | null;
  login: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
  register: (name: string, email: string, password: string, onSuccess?: () => void) => Promise<void>;
  signOut: (onSuccess?: () => void) => Promise<void>;
  save: (next: DB) => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  bootstrapped: false,
  db: seed,
  user: seed.users.find(u => u.id === seed.currentUserId) ?? null,

  async save(next) {
    set({ db: next });
    await setItem(KEY, next);
  },

  async login(email, password, onSuccess) {
    const { db, save } = get();
    const found = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) { Alert.alert('Login inválido', 'Confira seu e-mail e senha.'); return; }
    const next: DB = { ...db, currentUserId: found.id };
    set({ db: next, user: found });
    await save(next);
    onSuccess?.();
  },

  async register(name, email, password, onSuccess) {
    const { db, save } = get();
    if (db.users.some(u => u.email.toLowerCase() == email.toLowerCase())) {
      Alert.alert('E-mail em uso', 'Tente um e-mail diferente.'); return;
    }
    const user: User = { id: 'u' + (db.users.length + 1), name, email, password };
    const next: DB = { ...db, users: [...db.users, user], currentUserId: user.id };
    set({ db: next, user });
    await save(next);
    onSuccess?.();
  },

  async signOut(onSuccess) {
    const { db, save } = get();
    const next: DB = { ...db, currentUserId: null };
    set({ db: next, user: null });
    await save(next);
    onSuccess?.();
  }
}));

export function useAuthInit() {
  const setState = useAuth.setState;
  React.useEffect(() => {
    (async () => {
      const loaded = await getItem<DB>(KEY, seed);
      const user = loaded.currentUserId ? loaded.users.find(u => u.id === loaded.currentUserId) ?? null : null;
      setState({ db: loaded, user, bootstrapped: true });
      await setItem(KEY, loaded);
    })();
  }, []);
  return { bootstrapped: useAuth.getState().bootstrapped };
}
