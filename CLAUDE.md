# Finance Bag — CLAUDE.md

## Project Overview

A React Native personal finance app (Expo SDK 52, managed workflow). Local-first, fully offline, encrypted SQLite database. No backend, no cloud sync.

## Tech Stack

- **React Native** 0.76.9 + **Expo** SDK 52 + **Expo Router** 4
- **TypeScript** 5.3 strict mode
- **State**: Zustand 5
- **DB**: drizzle-orm + expo-sqlite (SQLCipher encrypted)
- **i18n**: i18next + react-i18next (fr / ar / en)
- **Linter**: Biome 1.9

## Architecture

Clean Architecture layers: Domain → Application → Infrastructure → Presentation

```
src/
  application/       # Use cases (pure business logic)
  core/              # Shared types (Result<T,E>)
  domain/            # Domain models + errors
  i18n/              # Translations (fr, en, ar)
  infrastructure/    # DB, crypto, secure storage
  presentation/      # Hooks, stores, auth
  store/             # Zustand store + types
  theme/             # Colors, typography, spacing
  utils/             # date, currency utilities
  components/ui/     # Shared UI components
app/                 # Expo Router screens
  (auth)/            # PIN setup + unlock
  (tabs)/            # Main tabs: dashboard, salary, credits, emergency, goals, settings
  onboarding/        # First-run onboarding
```

## Security — CRITICAL CONSTRAINTS (NEVER CHANGE)

- **PBKDF2 iterations = 600,000** (SPEC-SEC-001 §6.2) — never reduce
- Derived key is **never stored** — re-derived on each unlock
- Only the **verifier** (`SHA-256(derivedKey + ':finance_bag_v1_verify')`) is stored in SecureStore
- SQLCipher key set via `PRAGMA key = "x'hexkey'"` (raw-key notation)
- Local auth v1.0 — no cloud sync, no remote auth, no biometric unlock (key cannot be stored)
- Auth: iOS Keychain / Android Keystore via `expo-secure-store`

## ID Generation

Use `Crypto.randomUUID()` from `expo-crypto` (the store's `generateId` helper). Do **not** use the `ulid` package.

## Patterns

```ts
// Result type
return Ok({ value });
return Err(ValidationError('message'));
if (!result.ok) { /* handle error */ }

// Amount parsing — always use regex replace
const amount = Number.parseFloat(input.replace(/,/g, '.'));

// Never use global parseFloat / isNaN
Number.parseFloat(...)  // correct
Number.isNaN(...)       // correct
```

## i18n

- Language codes: `fr` | `ar` | `en`
- Arabic (`ar`) is RTL — `I18nManager.forceRTL(true)` applied at startup
- RTL layout changes require app restart (`restartRequired` flag in `updateLanguage`)
- Translation files: `src/i18n/fr.ts`, `src/i18n/en.ts`, `src/i18n/ar.ts`
- **Never hardcode French placeholder strings** — use `t('key.placeholder')` keys

## Build

```bash
npm run lint          # biome check
npm run format        # biome format --write
npm run build:apk     # EAS Build — Android preview APK
npm run build:android # EAS Build — Android production
npm run build:ios     # EAS Build — iOS production
npm run db:generate   # drizzle-kit generate migrations
```

## MVP Status — v1.0.0 (MVP Freeze)

All features implemented and critical bugs fixed. Pending production EAS build.

### Known Pre-existing Lint Warnings (non-blocking)

The following 9 biome lint issues exist in library-adjacent code and are non-blocking:
- `src/utils/date.ts` — `useTemplate` (string concatenation style)
- `assets/generate-assets.js` — `useNodejsImportProtocol`, `noForEach`
- `src/components/ui/BottomSheet.tsx` — `useExhaustiveDependencies`
- `src/components/ui/DonutChart.tsx` — `noArrayIndexKey`
- `src/components/ui/ProgressBar.tsx` — `useExhaustiveDependencies` (×3), `noArrayIndexKey`
