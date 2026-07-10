export const Colors = {
  // Backgrounds
  bg: {
    primary: '#090E1A',
    secondary: '#111827',
    tertiary: '#1F2937',
    card: '#141C2E',
    elevated: '#1E2A40',
    overlay: 'rgba(9,14,26,0.85)',
  },

  // Brand
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#8B5CF6',
  accent: '#06B6D4',

  // Semantic
  success: '#10B981',
  successLight: '#34D399',
  successBg: 'rgba(16,185,129,0.12)',
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningBg: 'rgba(245,158,11,0.12)',
  danger: '#EF4444',
  dangerLight: '#F87171',
  dangerBg: 'rgba(239,68,68,0.12)',
  info: '#3B82F6',
  infoBg: 'rgba(59,130,246,0.12)',

  // Text
  text: {
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
    tertiary: '#6B7280',
    inverse: '#090E1A',
    accent: '#6366F1',
  },

  // Borders
  border: {
    default: 'rgba(255,255,255,0.08)',
    subtle: 'rgba(255,255,255,0.04)',
    strong: 'rgba(255,255,255,0.15)',
    accent: 'rgba(99,102,241,0.4)',
  },

  // Gradients (arrays for LinearGradient)
  gradient: {
    primary: ['#6366F1', '#8B5CF6'] as const,
    success: ['#10B981', '#059669'] as const,
    warning: ['#F59E0B', '#D97706'] as const,
    danger: ['#EF4444', '#DC2626'] as const,
    dark: ['#1E2A40', '#141C2E'] as const,
    card: ['#1A2535', '#111827'] as const,
    salary: ['#6366F1', '#3B82F6'] as const,
    credits: ['#EF4444', '#DC2626'] as const,
    emergency: ['#F59E0B', '#10B981'] as const,
    goals: ['#8B5CF6', '#6366F1'] as const,
    dashboard: ['#090E1A', '#141C2E'] as const,
  },

  // Category colors
  categories: {
    housing: '#6366F1',
    food: '#F59E0B',
    transport: '#3B82F6',
    health: '#10B981',
    leisure: '#8B5CF6',
    savings: '#06B6D4',
    education: '#EC4899',
    shopping: '#F97316',
    utilities: '#14B8A6',
    other: '#6B7280',
  },

  // White & transparents
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type ColorKey = keyof typeof Colors;
