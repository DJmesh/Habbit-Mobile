# Mock Login enabled
- App starts directly in **AppTabs** (no real auth).
- Login/Register screens remain in the stack for manual navigation/testing.

## Install & Run
```bash
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml
npm install
npx expo install --fix
npx expo doctor --fix
npx expo start -c
```
Open with **Expo Go (SDK 54)**.
