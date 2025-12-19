import tier0 from './tiers/tier0.json';
import tier1 from './tiers/tier1.json';
import tier2 from './tiers/tier2.json';
import tier3 from './tiers/tier3.json';
import tier4 from './tiers/tier4.json';
import tier5 from './tiers/tier5.json';
import tiersData from './tiers.json';
import type { Skill } from '../types';

export const allSkills: Skill[] = [
  ...tier0,
  ...tier1,
  ...tier2,
  ...tier3,
  ...tier4,
  ...tier5
];

export const tiers = tiersData;

export { tier0, tier1, tier2, tier3, tier4, tier5 };
