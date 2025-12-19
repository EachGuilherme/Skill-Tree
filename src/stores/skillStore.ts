import { create } from 'zustand';
import type  { Skill } from '../types';

interface SkillStoreState {
  skills: Skill[];
  tierAtual: number;
  tpAtual: number;
  statsJogador: Record<string, number>;
  
  // Actions
  setSkills: (skills: Skill[]) => void;
  setTierAtual: (tier: number) => void;
  setTPAtual: (tp: number) => void;
  setStat: (stat: string, valor: number) => void;
  desbloquearSkill: (skillId: string) => void;
}

export const useSkillStore = create<SkillStoreState>((set) => ({
  skills: [],
  tierAtual: 0,
  tpAtual: 100000,
  statsJogador: { STR: 0, DEX: 0, CON: 0, WIL: 0, MND: 0, SPI: 0 },

  setSkills: (skills) => set({ skills }),
  setTierAtual: (tier) => set({ tierAtual: tier }),
  setTPAtual: (tp) => set({ tpAtual: tp }),
  setStat: (stat, valor) => set((state) => ({
    statsJogador: { ...state.statsJogador, [stat]: valor }
  })),
  desbloquearSkill: (skillId) => set((state) => ({
    skills: state.skills.map(s =>
      s.id === skillId ? { ...s, desbloqueada: true } : s
    )
  }))
}));