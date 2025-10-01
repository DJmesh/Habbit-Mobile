# Peer fix
Set `@types/react` to `^19.1.0` to satisfy React Native 0.81.x.
Run:

```bash
rm -rf node_modules package-lock.json
npm install
npx expo install --fix
npx expo doctor --fix
npx expo start -c
```
