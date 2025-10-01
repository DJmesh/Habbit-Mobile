# Quick Start (Fixed by ChatGPT)

This bundle adds missing Babel preset and config required by Metro/Expo.

## What changed
- Added **babel-preset-expo** to `devDependencies` (version ^11.0.12).
- Ensured **@babel/core** is present in devDependencies.
- Ensured **babel.config.js** uses `presets: ['babel-preset-expo']`.

## Install & Run
```bash
# from the project root (where package.json lives)
npm install
# or: pnpm install / yarn

# run Expo
npx expo start -c
# then press "a" for Android or "w" for web
```

If you still see a Babel missing‑preset error, delete lockfile and node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml
npm install
npx expo start -c
```

> SDK 53 requires a compatible babel preset. The preset lives in your app's node_modules; Metro loads it from `babel.config.js`.
