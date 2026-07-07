export const THEME_OPTIONS = [
  {
    label: 'Dark',
    value: 'dark',
  },
  {
    label: 'Light',
    value: 'light',
  },
  {
    label: 'Auto',
    value: 'auto',
  },
] as const;

export const LAYOUT_OPTIONS = [
  {
    description: 'Compact grid of items',
    title: 'Grid',
    value: 'gridLayout',
  },
  {
    description: 'Detailed list view',
    title: 'List',
    value: 'listLayout',
  },
] as const;

export const BITRATE_OPTIONS = [
  {
    badge: undefined,
    description:
      'Direct playback of the original audio source without modifications',
    title: 'Source',
    value: 0,
  },
  {
    badge: '320 kbps',
    description:
      'Superior sound quality, perfect for immersive listening with moderate data usage',
    title: 'High',
    value: 320,
  },
  {
    badge: '256 kbps',
    description:
      'Crisp audio with a balanced blend of quality and data efficiency',
    title: 'Medium',
    value: 256,
  },
  {
    badge: '192 kbps',
    description: 'Solid quality tailored for streaming with reduced bandwidth',
    title: 'Low',
    value: 192,
  },
  {
    badge: '128 kbps',
    description:
      'Essential audio quality optimized for the lowest data consumption',
    title: 'Minimal',
    value: 128,
  },
] as const;

export const LAYOUTS = LAYOUT_OPTIONS.map((option) => option.value);

export const BITRATES = BITRATE_OPTIONS.map((option) => option.value);

export const THEMES = THEME_OPTIONS.map((option) => option.value);
