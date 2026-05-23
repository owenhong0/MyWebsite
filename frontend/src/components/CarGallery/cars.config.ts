// ─────────────────────────────────────────────────────────────────────────────
// cars.config.ts
// Single source of truth for every car in the gallery.
//
// normalizeScale: measured as 4.0 / longestBoundingBoxDimension so every car
//   sits inside a ~4-unit cube regardless of Sketchfab export units.
//   Raw bounding boxes (trimesh):
//     mclaren_f1              X 8.498  Y 4.975  Z 18.740  → scale 0.2134
//     NSX-R                   X 8.145  Y 4.708  Z 18.320  → scale 0.2183
//     skyline_gt-r_r33        X 7.616  Y 5.051  Z 17.987  → scale 0.2224
//     supra_rz                X 7.683  Y 4.967  Z 17.626  → scale 0.2269
//     Porsche_GT3RS           X 7.960  Y 5.344  Z 17.943  → scale 0.2229
//     Koenigsegg-CCXR         X 7.728  Y 4.231  Z 16.720  → scale 0.2392
//
// cameraPreset: positioned for the model's default Y-rotation of -30° so the
//   "nose" faces roughly front-right; tweak per car for the best magazine angle.
//
// hdriPreset: drei Environment preset keyed by country:
//   Japan → "dawn"  |  Italy → "sunset"  |  Germany → "city"
//   UK    → "lobby" |  USA   → "warehouse"|  Sweden  → "forest"
// ─────────────────────────────────────────────────────────────────────────────

export type EnvironmentPreset =
  | 'apartment'
  | 'city'
  | 'dawn'
  | 'forest'
  | 'lobby'
  | 'night'
  | 'park'
  | 'studio'
  | 'sunset'
  | 'warehouse';

export type CameraPreset = {
  position: [number, number, number];
  target: [number, number, number];
};

export type CarConfig = {
  filename: string;
  displayName: string;
  make: string;
  country: string;
  year: number;
  normalizeScale: number;
  hdriPreset: EnvironmentPreset;
  /** Best magazine-press angle for this specific car. */
  cameraPreset: CameraPreset;
};

// ─── Country → HDRI mapping ───────────────────────────────────────────────────
export const COUNTRY_HDRI: Record<string, EnvironmentPreset> = {
  Japan:   'dawn',
  Italy:   'sunset',
  Germany: 'city',
  UK:      'lobby',
  USA:     'warehouse',
  Sweden:  'forest',
};

// ─── Default gallery camera (studio overview, before a car is "entered") ─────
export const GALLERY_CAMERA: CameraPreset = {
  position: [4.5, 2.4, 5.5],
  target:   [0, 0.55, 0],
};

// ─── Per-car configurations ───────────────────────────────────────────────────
export const CAR_CONFIGS: CarConfig[] = [
  {
    filename:       '/models/mclaren_f1-opt.glb',
    displayName:    'McLaren F1',
    make:           'McLaren',
    country:        'UK',
    year:           1994,
    normalizeScale: 0.2134,
    hdriPreset:     'lobby',
    // UK lobby — cool indoor show light; front-3/4 reveals the long nose
    cameraPreset: { position: [4.5, 2.0, 5.2], target: [0, 0.55, 0] },
  },
  {
    filename:       '/models/NSX-R-opt.glb',
    displayName:    'Honda NSX-R',
    make:           'Honda',
    country:        'Japan',
    year:           1997,
    normalizeScale: 0.2183,
    hdriPreset:     'dawn',
    // Low and dramatic — shows the flat mid-engine silhouette
    cameraPreset: { position: [5.5, 1.5, 4.0], target: [0, 0.5, 0] },
  },
  {
    filename:       '/models/1997_nissan_skyline_gt-r_r33-opt.glb',
    displayName:    'Nissan Skyline GT-R R33',
    make:           'Nissan',
    country:        'Japan',
    year:           1997,
    normalizeScale: 0.2224,
    hdriPreset:     'dawn',
    // Slightly elevated to show the iconic fender flares
    cameraPreset: { position: [3.5, 2.3, 6.0], target: [0, 0.6, 0] },
  },
  {
    filename:       '/models/1998_toyota_supra_rz-opt.glb',
    displayName:    'Toyota Supra RZ',
    make:           'Toyota',
    country:        'Japan',
    year:           1998,
    normalizeScale: 0.2269,
    hdriPreset:     'dawn',
    // Rear-3/4 to highlight the whale-tail and rear haunches
    cameraPreset: { position: [-2.5, 2.0, 5.5], target: [0, 0.55, 0] },
  },
  {
    filename:       '/models/2023_Porsche_GT3RS-opt.glb',
    displayName:    'Porsche 911 GT3 RS',
    make:           'Porsche',
    country:        'Germany',
    year:           2023,
    normalizeScale: 0.2229,
    hdriPreset:     'city',
    // Very low angle — GT3 RS is visually taller with its swan-neck wing
    cameraPreset: { position: [4.5, 1.2, 4.5], target: [0, 0.45, 0] },
  },
  {
    filename:       '/models/2010-Koenigsegg-CCXR-opt.glb',
    displayName:    'Koenigsegg CCXR Edition',
    make:           'Koenigsegg',
    country:        'Sweden',
    year:           2010,
    normalizeScale: 0.2392,
    hdriPreset:     'forest',
    // Ultra-low to emphasise the extreme wedge shape
    cameraPreset: { position: [3.5, 1.0, 4.0], target: [0, 0.4, 0] },
  },
];
