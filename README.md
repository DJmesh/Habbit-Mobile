
# HabitApp — Expo SDK 53 PRO

App completo em **Expo SDK 53** com:
- **Login/Cadastro** em cache (AsyncStorage)
- **Hábitos**, **Tarefas**, **Calendário**, **Progresso**
- **Nutrição** com tela dedicada (totais do dia + lançamento)
- **Locais**: gravação manual de localização (lat/lon + horário) usando `expo-location`
- Estado com **Zustand**, navegação **React Navigation**
- Ícones com **@expo/vector-icons**
- Alias `@/*` com **babel-plugin-module-resolver** (instalado)

> **Nota de compatibilidade:** `package.json` atual está com **Expo 54.0.20** e React Native **0.81.5**.  
> O texto acima mantém a seção “SDK 53 PRO” **mas** o projeto já está no SDK 54. Se quiser fixar no **SDK 53**, troque a versão de `expo` no `package.json` para a faixa do SDK 53 e rode `npx expo install --fix`. Se preferir **manter SDK 54**, o restante do README vale do mesmo jeito; apenas ignore a menção direta ao SDK 53.

## Rodar
```bash
npm install
npx expo install --fix   # garante versões compatíveis com o SDK em uso (53 ou 54)
npx expo start
```
Abra no **Expo Go** (garanta que a versão do Expo Go é compatível com o SDK).

Login de exemplo: `edu@example.com` / `123456`

## Observações
- A gravação de localização funciona com o app **aberto** (foreground). Para background, é necessária configuração extra e build nativo (podemos adicionar depois).
- Permissões estão declaradas em `app.json` (iOS/Android).
- Os dados (usuários, hábitos, refeições, tarefas, sessões de GPS) ficam em **AsyncStorage** através de objetos chaves (`AUTH_V1`, `DB_V1`, etc.), manipulados pelos *stores* (Zustand).

---

# Habit App (Expo)

## Versão do projeto e dependências

`package.json` (resumo):
```json
{
  "name": "habit-app-expo",
  "version": "1.3.0",
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.2",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-navigation/bottom-tabs": "^6.6.1",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/native-stack": "^6.10.0",
    "date-fns": "^3.6.0",
    "expo": "54.0.20",
    "expo-location": "~19.0.7",
    "expo-speech": "~14.0.7",
    "expo-status-bar": "~3.0.8",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.1.10",
    "babel-plugin-module-resolver": "^5.0.2",
    "babel-preset-expo": "~54.0.0",
    "typescript": "~5.9.2"
  }
}
```

### Para que serve cada dependência?
- **expo**: toolchain e runtime do app (build, Metro, APIs nativas).
- **react / react-native**: base do app.
- **@react-navigation/native, native-stack, bottom-tabs**: navegação por abas + pilhas.
- **zustand**: estado global simples e performático.
- **@react-native-async-storage/async-storage**: persistência local.
- **date-fns**: cálculos de datas (intervalos, formatação, etc.).
- **expo-location**: captura de localização no `LocationScreen`.
- **expo-speech**: sintetiza voz para avisos/lembrar hábitos.
- **expo-status-bar**: controle de status bar.
- **@expo/vector-icons**: ícones (Ionicons/Feather).
- **react-native-gesture-handler, react-native-screens, react-native-safe-area-context**: infra de navegação/gestos.
- **babel-plugin-module-resolver**: alias `@/*` para imports limpos.
- **TypeScript** e **@types/react**: tipagem.

### Scripts
- `npm start` – inicia o projeto (QR code).
- `npm run android` – build/exec no Android nativo (EAS project).
- `npm run ios` – build/exec no iOS nativo.
- `npm run web` – modo web (experimental).

---

## Arquitetura de pastas
```
src/
├─ components/
│  ├─ Badge.tsx
│  ├─ ConfettiBurst.tsx
│  ├─ DueSoonWatcher.tsx
│  ├─ Fireworks.tsx
│  ├─ InlineMonthPicker.tsx
│  ├─ LogoSpinner.tsx
│  ├─ Notifier.tsx
│  ├─ ReminderModal.tsx
│  ├─ TransitionOverlay.tsx
│  └─ UI.tsx
│
├─ lib/
│  ├─ interaction.ts
│  ├─ mockDb.ts
│  ├─ notifications.ts
│  └─ storage.ts
│
├─ navigation/
│  └─ Tabs.tsx
│
├─ screens/
│  ├─ Auth/
│  │  ├─ LoginScreen.tsx
│  │  └─ RegisterScreen.tsx
│  └─ Tabs/
│     ├─ CalendarScreen.tsx
│     ├─ HabitsScreen.tsx
│     ├─ LocationScreen.tsx
│     ├─ NotificationsScreen.tsx
│     ├─ NutritionScreen.tsx
│     ├─ ProfileScreen.tsx
│     ├─ ProgressScreen.tsx
│     ├─ RewardsScreen.tsx
│     └─ TodayScreen.tsx
│
├─ store/
│  ├─ achievements.ts
│  ├─ auth.ts
│  ├─ habits.ts
│  ├─ location.ts
│  ├─ nutrition.ts
│  ├─ reminders.ts
│  ├─ sessionCache.ts
│  ├─ sessionStats.ts
│  └─ tasks.ts
│
└─ theme/
   └─ colors.ts
```

### O que cada arquivo faz (resumo)

#### `components/`
- **UI.tsx** — *Design system* leve: `Screen`, `Card`, `Title`, `Subtitle`, `Input`, `Button`, `ProgressBar` etc.
- **InlineMonthPicker.tsx** — seletor inline de mês/dia para definir início/fim de um hábito (agora com chaves únicas nos headers e mês atual por padrão).
- **Badge.tsx** — exibe emblemas (cores, ícone, bloqueado/desbloqueado).
- **ConfettiBurst.tsx / Fireworks.tsx** — efeitos visuais para conquistas.
- **ReminderModal.tsx** — modal que aparece quando falta ≤5 min para um lembrete do dia.
- **Notifier.tsx** — central de integração com lembretes: fala (expo-speech), vibração e dispara `ReminderModal`.
- **DueSoonWatcher.tsx** — verificador periódico (minuto a minuto) dos lembretes “quase vencendo” (≤5 min).
- **LogoSpinner.tsx / TransitionOverlay.tsx** — UX visual.

#### `lib/`
- **storage.ts** — `getItem/setItem` em AsyncStorage com JSON seguro.
- **notifications.ts** — *shim* de notificações sem `expo-notifications` (voz + vibração + modal).
- **interaction.ts** — `tap()` com feedback (vibração leve), helpers de UX.
- **mockDb.ts** — dados mock para iniciar experiências/telas.

#### `navigation/`
- **Tabs.tsx** — bottom tabs para: Today, Habits, Calendar, Progress, Nutrition, Location, Rewards, Notifications, Profile.

#### `screens/Tabs/`
- **TodayScreen.tsx** — visão do dia: marca hábitos, adiciona tarefas, lança refeições (usa `useHabits`, `useTasks`, `useNutrition`).
- **HabitsScreen.tsx** — cria hábitos, define lembretes por-hábito, seleciona **período** (início/fim) que alimenta o **Calendar**. Estado local por-hábito para evitar “mexer todos“ ao editar um.
- **CalendarScreen.tsx** — grade mensal: **verde** = dia com log; **azul** = dentro do período de algum hábito (usa `sessionCache`); células com tamanho fixo para exibir “10, 11, 12…” corretamente.
- **ProgressScreen.tsx** — estatísticas de sessão (`sessionStats`) e botão **Compartilhar** (Share API).
- **NutritionScreen.tsx** — totais do dia e inputs rápidos de refeição.
- **LocationScreen.tsx** — registra localização (lat/lon/time) com `expo-location`.
- **RewardsScreen.tsx** — lista conquistas; quando ganha, toca Confetti/Fireworks + card de parabéns.
- **NotificationsScreen.tsx** — lista lembretes ativos e botão de testar vibração.
- **ProfileScreen.tsx** — perfil mock.

#### `store/` (Zustand)
- **auth.ts** — login/cadastro simples em cache.
- **habits.ts** — coleção de hábitos e `logs` por data (`setDoneToday`).
- **reminders.ts** — lembretes (hora/min/dias) por hábito, persistidos.
- **sessionCache.ts** — guarda `startISO`/`endISO` por hábito (usado no Calendar).
- **sessionStats.ts** — computa métricas por sessão (total logs, maior streak, % de conclusão por hábito).
- **nutrition.ts** — refeições com macros e agregados por dia.
- **tasks.ts** — tarefas do dia.
- **achievements.ts** — controle de conquistas (unlock/reset/mock).
- **location.ts** — dados de localização.

#### `theme/colors.ts`
- Paleta dark usada por todos os componentes/telas.

---

## Fluxo de dados principal
1. **Criar hábito → configurar período e lembrete (HabitsScreen)**  
   - Período (início/fim) vai para `sessionCache`.
   - Lembrete (hora/min/dias) vai para `reminders`.
2. **Marcar hábito (TodayScreen)** → cria log na data atual em `habits.logs`.
3. **Calendário (CalendarScreen)**  
   - Verde = existe log para o dia.  
   - Azul = o dia está dentro de **qualquer** intervalo salvo em `sessionCache`.
4. **DueSoonWatcher/Notifier**  
   - A cada minuto verifica lembretes do **dia atual**: se faltar ≤5 min, vibra, fala e abre **ReminderModal** (funciona em qualquer aba).

---

## Padrões de commit
- **feat**: nova funcionalidade
- **fix**: correção
- **refactor**: refatoração sem mudança de comportamento
- **docs**: documentação/README
- **chore**: manutenção/infra

Ex.: `fix(calendar): render two-digit days with fixed-size cells`

---

## Roadmap (próximos passos)
- Notificações **em segundo plano** (Android service).  
- Exportar dados de progresso e nutrição (CSV/JSON).  
- Sincronizar com backend real (opcional).
---

## Créditos
Feito com ❤️ usando React Native + Expo + Zustand.