import { create } from 'zustand';
import type { ApplianceKey, KitchenConfig, LayoutShape, MeasurementMethod, StyleTheme } from '../types/kitchen';

interface KitchenStore {
  config: KitchenConfig;
  setDimensions: (widthCm: number, lengthCm: number, method: MeasurementMethod) => void;
  setHeight: (heightCm: number) => void;
  setLayout: (layout: LayoutShape) => void;
  setStyle: (style: StyleTheme) => void;
  setCabinetColor: (id: string) => void;
  setCountertop: (id: string) => void;
  setFlooring: (id: string) => void;
  setWallColor: (id: string) => void;
  toggleAppliance: (id: ApplianceKey) => void;
  reset: () => void;
}

const defaultConfig: KitchenConfig = {
  widthCm: 300,
  lengthCm: 350,
  heightCm: 270,
  measurementMethod: 'manual',
  layout: 'l-shape',
  style: 'modern',
  cabinetColorId: 'white',
  countertopId: 'white-marble',
  flooringId: 'tile-light',
  wallColorId: 'wall-white',
  appliances: ['fridge', 'oven', 'sink', 'hood'],
};

export const useKitchenStore = create<KitchenStore>((set) => ({
  config: { ...defaultConfig },
  setDimensions: (widthCm, lengthCm, method) =>
    set((s) => ({ config: { ...s.config, widthCm, lengthCm, measurementMethod: method } })),
  setHeight: (heightCm) => set((s) => ({ config: { ...s.config, heightCm } })),
  setLayout: (layout) => set((s) => ({ config: { ...s.config, layout } })),
  setStyle: (style) => set((s) => ({ config: { ...s.config, style } })),
  setCabinetColor: (cabinetColorId) => set((s) => ({ config: { ...s.config, cabinetColorId } })),
  setCountertop: (countertopId) => set((s) => ({ config: { ...s.config, countertopId } })),
  setFlooring: (flooringId) => set((s) => ({ config: { ...s.config, flooringId } })),
  setWallColor: (wallColorId) => set((s) => ({ config: { ...s.config, wallColorId } })),
  toggleAppliance: (id) =>
    set((s) => {
      const has = s.config.appliances.includes(id);
      const appliances = has
        ? s.config.appliances.filter((a) => a !== id)
        : [...s.config.appliances, id];
      return { config: { ...s.config, appliances } };
    }),
  reset: () => set({ config: { ...defaultConfig } }),
}));
