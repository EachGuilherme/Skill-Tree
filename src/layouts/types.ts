import type { Skill } from '../types';

export type LayoutType = 'radial' | 'cruz' | 'escalonada' | 'grid' | 'piramide';

export interface LayoutFunction {
  (skills: Skill[], centerX: number, centerY: number): void;
}