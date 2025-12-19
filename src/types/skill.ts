export interface Skill {
  id: string;
  nome: string;
  descricao: string;
  tier: number;
  custoTP: number;
  custoStats: {
    STR?: number;
    DEX?: number;
    CON?: number;
    WIL?: number;
    MND?: number;
    SPI?: number;
  };
  prereqSkills: string[]; // IDs das skills pré-requisitas
  desbloqueada: boolean;
  // Calculado dinamicamente (não persistir)
  x?: number;
  y?: number;
}

export interface SkillState {
  skills: Skill[];
  skillsDesbloqueadas: Set<string>;
}