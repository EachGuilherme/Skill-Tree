import type { Skill } from '../types';
import { useSkillStore } from '../stores/skillStore';

export function useSkills(tierAtual: number): Skill[] {
  const { skills } = useSkillStore();

  // ✅ Nada de useState/useEffect, apenas valor derivado
  const skillsDoTier = skills.filter((skill) => skill.tier === tierAtual);

  return skillsDoTier;
}
