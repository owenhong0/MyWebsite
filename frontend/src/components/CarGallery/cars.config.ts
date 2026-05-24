// ─────────────────────────────────────────────────────────────────────────────
// cars.config.ts — single source of truth for the gallery
// ─────────────────────────────────────────────────────────────────────────────

export type EnvironmentPreset =
  | 'apartment' | 'city' | 'dawn' | 'forest' | 'lobby'
  | 'night' | 'park' | 'studio' | 'sunset' | 'warehouse';

export type CameraPreset = {
  position: [number, number, number];
  target:   [number, number, number];
};

export type CarSpec = {
  engine:      string;
  power:       string;
  torque:      string;
  weight:      string;
  topSpeed:    string;
  zeroToSixty: string;
};

export type CarConfig = {
  slug:               string;           // URL segment: /gallery/:make/:slug
  filename:           string;
  imageUrl:           string;           // hero photo for cards & detail page
  /** CSS objectPosition for 16:9 card thumbnails (default 'center 40%') */
  cardImagePosition?: string;
  displayName:        string;
  make:               string;
  country:            string;
  year:               number;
  normalizeScale:     number;
  hdriPreset:         EnvironmentPreset;
  cameraPreset:       CameraPreset;
  specs:              CarSpec;
  description:        string;
};

// ─── Country → HDRI preset ───────────────────────────────────────────────────
export const COUNTRY_HDRI: Record<string, EnvironmentPreset> = {
  Japan:   'dawn',
  Italy:   'sunset',
  Germany: 'city',
  UK:      'lobby',
  USA:     'warehouse',
  Sweden:  'forest',
};

// ─── Default gallery camera — low front-3/4, hood height ─────────────────────
export const GALLERY_CAMERA: CameraPreset = {
  position: [4, 1.2, 7],
  target:   [0, 0.8, 0],
};

// ─── All unique makes (for emblem nav) ────────────────────────────────────────
export const ALL_MAKES = ['McLaren', 'Honda', 'Nissan', 'Toyota', 'Porsche', 'Koenigsegg'] as const;

// ─── Per-car configurations ───────────────────────────────────────────────────
export const CAR_CONFIGS: CarConfig[] = [
  {
    slug:               'mclaren-f1',
    filename:           '/models/mclaren_f1-opt.glb',
    imageUrl:           '/images/cars/mclaren-f1.jpg',
    cardImagePosition:  'center 55%',   // 2400×1706 (~1.41:1) — studio black bg, car in lower half
    displayName:        'McLaren F1',
    make:           'McLaren',
    country:        'UK',
    year:           1994,
    normalizeScale: 0.2134,
    hdriPreset:     'lobby',
    cameraPreset:   { position: [4.5, 1.0, 7.0], target: [0, 0.7, 0] },
    specs: {
      engine:      '6.1L BMW S70/2 V12',
      power:       '627 hp',
      torque:      '479 lb-ft',
      weight:      '1,138 kg',
      topSpeed:    '386 km/h',
      zeroToSixty: '3.2 s',
    },
    description:
      'The McLaren F1 redefined what a road car could be. Designed by Gordon Murray, ' +
      'its central driving position, gold-lined engine bay, and naturally aspirated V12 ' +
      'made it the fastest production car in the world for a decade. Every gram obsessed over, ' +
      'every detail deliberate.',
  },
  {
    slug:               'honda-nsx-r',
    filename:           '/models/NSX-R-opt.glb',
    imageUrl:           '/images/cars/honda-nsx-r.jpg',
    cardImagePosition:  'center 52%',   // 2400×1578 (~1.52:1) — factory press studio, car centered
    displayName:        'Honda NSX-R',
    make:           'Honda',
    country:        'Japan',
    year:           1997,
    normalizeScale: 0.2183,
    hdriPreset:     'dawn',
    cameraPreset:   { position: [5.0, 0.9, 6.5], target: [0, 0.6, 0] },
    specs: {
      engine:      '3.0L DOHC VTEC V6',
      power:       '280 hp',
      torque:      '210 lb-ft',
      weight:      '1,230 kg',
      topSpeed:    '270 km/h',
      zeroToSixty: '5.5 s',
    },
    description:
      'Developed with input from Ayrton Senna, the NSX-R strips away everything superfluous. ' +
      'Titanium connecting rods, a hand-matched engine, and deleted sound deadening — ' +
      'Honda\'s answer to Ferrari built with the precision of a watch.',
  },
  {
    slug:               'nissan-skyline-r33',
    filename:           '/models/1997_nissan_skyline_gt-r_r33-opt.glb',
    imageUrl:           '/images/cars/nissan-skyline-r33.jpg',
    cardImagePosition:  'center 52%',   // 2400×1800 (4:3) — studio press photo, car centered
    displayName:        'Nissan Skyline GT-R R33',
    make:           'Nissan',
    country:        'Japan',
    year:           1997,
    normalizeScale: 0.2224,
    hdriPreset:     'dawn',
    cameraPreset:   { position: [3.5, 1.4, 7.0], target: [0, 0.8, 0] },
    specs: {
      engine:      '2.6L RB26DETT Twin-Turbo I6',
      power:       '276 hp (stated)',
      torque:      '260 lb-ft',
      weight:      '1,570 kg',
      topSpeed:    '250 km/h (limited)',
      zeroToSixty: '5.4 s',
    },
    description:
      'Officially rated at 276 hp by gentlemen\'s agreement, the R33 GT-R produced ' +
      'significantly more in practice. Its ATTESA E-TS all-wheel drive and wide-body stance ' +
      'made it a revelation on the Nürburgring — and a legend on every touge it ever touched.',
  },
  {
    slug:               'toyota-supra-rz',
    filename:           '/models/1998_toyota_supra_rz-opt.glb',
    imageUrl:           '/images/cars/toyota-supra-rz.jpg',
    cardImagePosition:  'center 50%',   // 2400×1350 (16:9) — perfect ratio, side profile on autumn road
    displayName:        'Toyota Supra RZ',
    make:           'Toyota',
    country:        'Japan',
    year:           1998,
    normalizeScale: 0.2269,
    hdriPreset:     'dawn',
    cameraPreset:   { position: [-3.5, 1.2, 6.5], target: [0, 0.8, 0] },
    specs: {
      engine:      '3.0L 2JZ-GTE Twin-Turbo I6',
      power:       '320 hp',
      torque:      '315 lb-ft',
      weight:      '1,570 kg',
      topSpeed:    '250 km/h (limited)',
      zeroToSixty: '5.1 s',
    },
    description:
      'The 2JZ-GTE is arguably the most tuneable engine ever put in a production car. ' +
      'The Supra RZ\'s balanced chassis, rear-wheel drive, and a motor that could handle ' +
      'triple the stock power with supporting mods made it the definitive 1990s sports car.',
  },
  {
    slug:               'porsche-gt3rs',
    filename:           '/models/2023_Porsche_GT3RS-opt.glb',
    imageUrl:           '/images/cars/porsche-gt3rs.jpg',
    cardImagePosition:  'center 38%',   // 1920×1080 (16:9) — perfect ratio, no crop needed
    displayName:        'Porsche 911 GT3 RS',
    make:           'Porsche',
    country:        'Germany',
    year:           2023,
    normalizeScale: 0.2229,
    hdriPreset:     'city',
    cameraPreset:   { position: [4.5, 0.9, 6.5], target: [0, 0.7, 0] },
    specs: {
      engine:      '4.0L Flat-Six NA',
      power:       '518 hp',
      torque:      '343 lb-ft',
      weight:      '1,450 kg',
      topSpeed:    '296 km/h',
      zeroToSixty: '3.2 s',
    },
    description:
      'The 992 GT3 RS is a motorsport homologation special wearing a DRS rear wing ' +
      'and swan-neck mounts derived directly from the 911 RSR. Its naturally aspirated ' +
      '4.0L screams to 9,000 rpm. This is Porsche\'s most extreme road car.',
  },
  {
    slug:               'koenigsegg-ccxr',
    filename:           '/models/2010-Koenigsegg-CCXR-opt.glb',
    imageUrl:           '/images/cars/koenigsegg-ccxr.jpg',
    cardImagePosition:  'center 50%',   // 2400×1350 (16:9) — perfect ratio, no crop needed
    displayName:        'Koenigsegg CCXR Edition',
    make:           'Koenigsegg',
    country:        'Sweden',
    year:           2010,
    normalizeScale: 0.2392,
    hdriPreset:     'forest',
    cameraPreset:   { position: [3.5, 0.8, 6.0], target: [0, 0.6, 0] },
    specs: {
      engine:      '4.7L Twin-Supercharged V8 (E85)',
      power:       '1,018 hp',
      torque:      '811 lb-ft',
      weight:      '1,180 kg',
      topSpeed:    '402+ km/h',
      zeroToSixty: '2.9 s',
    },
    description:
      'Running on biofuel, the CCXR Edition produced over 1,000 hp from a hand-built ' +
      'twin-supercharged V8. Only two were ever made. Koenigsegg built what the hypercar ' +
      'world was still theorising — a carbon-bodied, ethanol-fuelled, sub-3-second machine ' +
      'from a tiny workshop in Ängelholm.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const getCarBySlug = (slug: string): CarConfig | undefined =>
  CAR_CONFIGS.find((c) => c.slug === slug);

export const getCarsByMake = (make: string): CarConfig[] =>
  CAR_CONFIGS.filter((c) => c.make.toLowerCase() === make.toLowerCase());
