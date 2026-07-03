import { CABINET_COLORS, COUNTERTOPS, FLOORING, WALL_COLORS } from '../data/options';
import type { KitchenConfig } from '../types/kitchen';

function resolveHex(list: { id: string; hex: string }[], id: string, fallback: string) {
  return list.find((o) => o.id === id)?.hex ?? fallback;
}

export function toSceneConfig(config: KitchenConfig) {
  return {
    widthCm: config.widthCm,
    lengthCm: config.lengthCm,
    heightCm: config.heightCm,
    layout: config.layout,
    style: config.style,
    cabinetHex: resolveHex(CABINET_COLORS, config.cabinetColorId, '#F4F3EF'),
    countertopHex: resolveHex(COUNTERTOPS, config.countertopId, '#EDEBE6'),
    flooringHex: resolveHex(FLOORING, config.flooringId, '#D9D4C8'),
    wallHex: resolveHex(WALL_COLORS, config.wallColorId, '#FAF9F6'),
    appliances: config.appliances,
  };
}
