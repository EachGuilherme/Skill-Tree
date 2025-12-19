export const CONFIG = {
  CANVAS_WIDTH: 2400,
  CANVAS_HEIGHT: 1600,
  TIERS_TOTAL: 5,
  TP_INICIAL: 100000,
  SKILL_RADIUS: 35,
  SKILL_STROKE: 2,
  ZOOM_MIN: 0.5,
  ZOOM_MAX: 3,
  ZOOM_SPEED: 0.1,
  COLORS: {
    background: '#1a1a2e',
    surface: '#16213e',
    primary: '#0f3460',
    success: '#32b8c6',
    warning: '#e68c47',
    error: '#c01547',
    locked: '#555555',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
  }
} as const;