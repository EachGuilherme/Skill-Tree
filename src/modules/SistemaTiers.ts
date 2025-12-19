import type { Skill, TierInfo, ProgressoTier } from '../types';

export class SistemaTiers {
  private tiers: TierInfo[] = [];
  private skillsPorTier: Map<number, Skill[]> = new Map();
  private skillsDesbloqueadas: Set<string> = new Set();

  constructor(skills: Skill[], tiers: TierInfo[]) {
    this.tiers = tiers;
    this.agruparSkillsPorTier(skills);
  }

  private agruparSkillsPorTier(skills: Skill[]): void {
    skills.forEach(skill => {
      if (!this.skillsPorTier.has(skill.tier)) {
        this.skillsPorTier.set(skill.tier, []);
      }
      this.skillsPorTier.get(skill.tier)!.push(skill);
    });
  }

  getSkillsPorTier(numero: number): Skill[] {
    return this.skillsPorTier.get(numero) || [];
  }

  getProgressoTier(numero: number): ProgressoTier {
    const skills = this.getSkillsPorTier(numero);
    const desbloqueadas = skills.filter(s => this.skillsDesbloqueadas.has(s.id)).length;
    
    return {
      numero,
      total: skills.length,
      desbloqueadas,
      percentual: skills.length > 0 ? (desbloqueadas / skills.length) * 100 : 0
    };
  }

  isTierDesbloqueado(numero: number): boolean {
    const tier = this.tiers[numero];
    if (!tier) return false;
    if (numero === 0) return true; // Tier 0 sempre desbloqueado
    
    // Verificar requisitos
    return true; // Simplificado por enquanto
  }

  desbloquearSkill(skillId: string): void {
    this.skillsDesbloqueadas.add(skillId);
  }

  isSkillDesbloqueada(skillId: string): boolean {
    return this.skillsDesbloqueadas.has(skillId);
  }
}