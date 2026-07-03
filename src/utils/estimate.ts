import type { KitchenConfig } from '../types/kitchen';

const BASE_DEPTH_M = 0.6;

export function estimateLinearMeters(config: KitchenConfig): number {
  const w = config.widthCm / 100;
  const l = config.lengthCm / 100;
  const sideRun = Math.max(l - BASE_DEPTH_M, 0);

  switch (config.layout) {
    case 'single':
      return w;
    case 'galley':
      return w * 2;
    case 'l-shape':
      return w + sideRun;
    case 'u-shape':
      return w + sideRun * 2;
    case 'island':
      return w + sideRun + Math.min(1.8, w * 0.4);
    default:
      return w;
  }
}

const STYLE_RATE_PER_METER: Record<KitchenConfig['style'], number> = {
  modern: 480,
  classic: 560,
  wood: 420,
  minimal: 400,
  industrial: 510,
};

export function estimateCostRange(config: KitchenConfig): { min: number; max: number } {
  const meters = estimateLinearMeters(config);
  const rate = STYLE_RATE_PER_METER[config.style];
  const applianceCount = config.appliances.length;
  const applianceCost = applianceCount * 150;
  const base = meters * rate + applianceCost;
  return { min: Math.round(base * 0.9 / 10) * 10, max: Math.round(base * 1.25 / 10) * 10 };
}
