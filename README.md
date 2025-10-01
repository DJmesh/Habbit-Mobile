# HabitApp — Expo SDK 53 PRO (Totalmente funcional)

App completo em **Expo SDK 53** com:
- **Login/Cadastro** em cache (AsyncStorage)
- **Hábitos**, **Tarefas**, **Calendário**, **Progresso**
- **Nutrição** com tela dedicada (totais do dia + lançamento)
- **Locais**: gravação manual de localização (lat/lon + horário) usando `expo-location`
- Estado com **Zustand**, navegação **React Navigation**
- Ícones com **@expo/vector-icons**
- Alias `@/*` com **babel-plugin-module-resolver** (instalado)

## Rodar
```bash
npm install
npx expo install --fix   # garante versões exatas do SDK 53
npx expo start
```
Abra no **Expo Go** (SDK 53).

Login de exemplo: `edu@example.com` / `123456`

## Observações
- A gravação de localização funciona com o app **aberto** (foreground). Para background, seria necessário configuração extra e build nativo.
- Permissões estão declaradas em `app.json` (iOS/Android).
- Todos os dados (usuários, hábitos, refeições, tarefas, sessões de GPS) ficam em **AsyncStorage** através de um único objeto `DB_V1`.
