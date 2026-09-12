# Ping

Ping is a minimal, human-first social app prototype built with Expo, React Native, TypeScript, and Expo Router.

## Run locally

```bash
pnpm install
pnpm start
```

Then scan the QR code with Expo Go, or press `i`, `a`, or `w` for iOS, Android, or web.

## Checks

```bash
pnpm typecheck
pnpm check:deps
```

Sprint 1 is intentionally local-only. Identity/profile, conversations, messages, groups, and appearance preference persist on the device with AsyncStorage. Suggested replies are fixed local examples; Ping does not connect to an AI API, blockchain, or backend.

Appearance follows the system by default and can be changed to Light, Dark, or System in Settings.
