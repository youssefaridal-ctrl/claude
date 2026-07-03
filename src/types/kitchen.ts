export type LayoutShape = 'single' | 'l-shape' | 'u-shape' | 'galley' | 'island';
export type StyleTheme = 'modern' | 'classic' | 'wood' | 'minimal' | 'industrial';
export type ApplianceKey = 'fridge' | 'oven' | 'microwave' | 'dishwasher' | 'sink' | 'hood';
export type MeasurementMethod = 'manual' | 'sketch';

export interface SwatchOption {
  id: string;
  name: string;
  hex: string;
}

export interface KitchenConfig {
  widthCm: number;
  lengthCm: number;
  heightCm: number;
  measurementMethod: MeasurementMethod;
  layout: LayoutShape;
  style: StyleTheme;
  cabinetColorId: string;
  countertopId: string;
  flooringId: string;
  wallColorId: string;
  appliances: ApplianceKey[];
}
