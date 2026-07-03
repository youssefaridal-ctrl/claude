import type {
  ApplianceKey,
  LayoutShape,
  StyleTheme,
  SwatchOption,
} from '../types/kitchen';

export const LAYOUTS: { id: LayoutShape; name: string; desc: string; minWidth: number; minLength: number }[] = [
  { id: 'single', name: 'خط واحد', desc: 'كل الخزائن على حائط واحد، مناسب للمساحات الصغيرة', minWidth: 180, minLength: 200 },
  { id: 'galley', name: 'ممر (خطين متوازيين)', desc: 'خزائن على حائطين متقابلين مع ممر بينهما', minWidth: 220, minLength: 200 },
  { id: 'l-shape', name: 'حرف L', desc: 'استغلال زاويتين متعامدتين، يوفر مساحة تخزين أكبر', minWidth: 240, minLength: 240 },
  { id: 'u-shape', name: 'حرف U', desc: 'يحيط بثلاث جهات، الأنسب للمطابخ الكبيرة', minWidth: 280, minLength: 280 },
  { id: 'island', name: 'مع جزيرة وسطية', desc: 'تصميم مفتوح مع جزيرة تحضير في المنتصف', minWidth: 320, minLength: 320 },
];

export const STYLES: { id: StyleTheme; name: string; desc: string }[] = [
  { id: 'modern', name: 'عصري', desc: 'خطوط نظيفة وألوان محايدة وأسطح لامعة' },
  { id: 'classic', name: 'كلاسيكي', desc: 'تفاصيل منحوتة وألوان دافئة وطابع تقليدي' },
  { id: 'wood', name: 'خشبي طبيعي', desc: 'خامات خشبية دافئة بمظهر طبيعي' },
  { id: 'minimal', name: 'مينيمال', desc: 'بساطة تامة بدون مقابض ظاهرة' },
  { id: 'industrial', name: 'صناعي', desc: 'معدن وخرسانة وألوان داكنة جريئة' },
];

export const CABINET_COLORS: SwatchOption[] = [
  { id: 'white', name: 'أبيض ثلجي', hex: '#F4F3EF' },
  { id: 'cream', name: 'كريمي', hex: '#E8DFC8' },
  { id: 'sage', name: 'أخضر سج', hex: '#8A9A7E' },
  { id: 'navy', name: 'كحلي', hex: '#2C3A52' },
  { id: 'charcoal', name: 'رمادي غامق', hex: '#3B3F45' },
  { id: 'walnut', name: 'جوزي داكن', hex: '#5B3A29' },
  { id: 'oak', name: 'بلوط فاتح', hex: '#C9A876' },
  { id: 'terracotta', name: 'طيني', hex: '#B5654A' },
];

export const COUNTERTOPS: SwatchOption[] = [
  { id: 'white-marble', name: 'رخام أبيض', hex: '#EDEBE6' },
  { id: 'black-marble', name: 'رخام أسود', hex: '#2A2A2C' },
  { id: 'quartz-grey', name: 'كوارتز رمادي', hex: '#9CA0A5' },
  { id: 'wood-counter', name: 'خشب طبيعي', hex: '#8A5A3B' },
  { id: 'granite', name: 'جرانيت', hex: '#4E4B47' },
];

export const FLOORING: SwatchOption[] = [
  { id: 'tile-light', name: 'بلاط فاتح', hex: '#D9D4C8' },
  { id: 'tile-dark', name: 'بلاط غامق', hex: '#4A4640' },
  { id: 'parquet', name: 'باركيه', hex: '#A5754B' },
  { id: 'cement', name: 'إسمنت مصقول', hex: '#8A8B8C' },
];

export const WALL_COLORS: SwatchOption[] = [
  { id: 'wall-white', name: 'أبيض', hex: '#FAF9F6' },
  { id: 'wall-beige', name: 'بيج', hex: '#E6DCC8' },
  { id: 'wall-sage', name: 'أخضر فاتح', hex: '#C9D2C0' },
  { id: 'wall-grey', name: 'رمادي فاتح', hex: '#D6D7D9' },
];

export const APPLIANCES: { id: ApplianceKey; name: string; icon: string }[] = [
  { id: 'fridge', name: 'ثلاجة', icon: '🧊' },
  { id: 'oven', name: 'فرن', icon: '🔥' },
  { id: 'hood', name: 'شفاط', icon: '💨' },
  { id: 'microwave', name: 'مايكروويف', icon: '📻' },
  { id: 'dishwasher', name: 'غسالة صحون', icon: '🍽️' },
  { id: 'sink', name: 'حوض مغسلة', icon: '🚰' },
];
