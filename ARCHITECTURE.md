# Finance Bag — Architecture

## Stack Technique

| Couche | Technologie |
|--------|------------|
| Framework | React Native + Expo 52 |
| Navigation | Expo Router 4 (file-based) |
| État | Zustand 5 |
| Persistance | AsyncStorage |
| Animations | React Native Reanimated 3 |
| Charts | SVG natif (DonutChart custom) |
| i18n | i18next + react-i18next |
| Style | StyleSheet natif |

## Structure des Dossiers

```
finance-bag/
├── app/                    # Routes Expo Router
│   ├── _layout.tsx         # Layout racine (init app)
│   ├── onboarding/         # Flux d'onboarding
│   │   ├── welcome.tsx     # Écran d'accueil + features
│   │   ├── language.tsx    # Sélection langue
│   │   └── setup.tsx       # Config initiale (nom, salaire, devise)
│   └── (tabs)/             # Navigation par onglets
│       ├── dashboard.tsx   # Tableau de bord principal
│       ├── salary.tsx      # Gestion salaire + répartition
│       ├── credits.tsx     # Suivi crédits
│       ├── emergency.tsx   # Fonds d'urgence
│       └── goals.tsx       # Objectifs financiers
│
├── src/
│   ├── theme/              # Design system
│   │   ├── colors.ts       # Palette complète
│   │   ├── typography.ts   # Échelle typographique
│   │   └── spacing.ts      # Espacements + radii + ombres
│   ├── i18n/               # Internationalisation
│   │   ├── fr.ts           # Français
│   │   ├── ar.ts           # Arabe
│   │   └── en.ts           # Anglais
│   ├── store/              # État global Zustand
│   │   ├── index.ts        # Store unifié
│   │   └── types.ts        # Types TypeScript
│   ├── components/ui/      # Composants réutilisables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── AmountInput.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── DonutChart.tsx
│   │   ├── Badge.tsx
│   │   ├── StatCard.tsx
│   │   ├── GradientCard.tsx
│   │   └── BottomSheet.tsx
│   └── utils/
│       ├── currency.ts     # Formatage monétaire
│       └── date.ts         # Utilitaires dates
│
└── assets/                 # Icônes, splash screen
```

## Les 5 Piliers

1. **Dashboard** — Vue d'ensemble, transactions rapides, santé budgétaire
2. **Salaire** — Répartition 50/30/20, catégories personnalisées, sources de revenus
3. **Crédits** — Suivi dette, taux d'endettement, stratégies avalanche/boule-de-neige
4. **Fonds d'urgence** — Constitution progressive, objectif 3/6/12 mois
5. **Objectifs** — Création buts financiers, suivi mensuel, contributions

## Flux de Données

```
AsyncStorage ←→ Zustand Store ←→ React Components
```

Toutes les mutations passent par le store Zustand qui:
1. Met à jour l'état en mémoire
2. Persiste dans AsyncStorage de façon asynchrone

## Build

```bash
# Développement
npx expo start

# APK Android (preview)
eas build --platform android --profile preview

# AAB Android (production)
eas build --platform android --profile production

# IPA iOS
eas build --platform ios
```
