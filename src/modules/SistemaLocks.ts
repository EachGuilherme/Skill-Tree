import type { Skill } from '../types';
import { SistemaTiers } from './SistemaTiers';

export class SistemaLocks {
  private statsJogador: Record<string, number>;
  private tpAtual: number;
  private allSkills: Skill[] = []; // Para verificar pré-requisitos
  private sistemaTiers: SistemaTiers | null = null; // Para verificar se tier está desbloqueado

  constructor(stats: Record<string, number>, tp: number, allSkills: Skill[] = [], sistemaTiers?: SistemaTiers) {
    this.statsJogador = stats;
    this.tpAtual = tp;
    this.allSkills = allSkills;
    this.sistemaTiers = sistemaTiers || null;
  }

  getCorSkill(skill: Skill): string {
    if (skill.desbloqueada) return '#32b8c6'; // Verde/Cyan
    if (this.podePegar(skill)) return '#e68c47'; // Amarelo (disponível)
    return '#555555'; // Cinza (bloqueado)
  }

  getMotivoTranca(skill: Skill): string {
    if (skill.desbloqueada) return '✅ Desbloqueada';
    
    // 🔒 VERIFICAR SE TIER ESTÁ DESBLOQUEADO (NOVA VERIFICAÇÃO)
    if (this.sistemaTiers && !this.sistemaTiers.isTierDesbloqueado(skill.tier)) {
      const proximo = this.sistemaTiers.getProximoTierParaDesbloquear();
      if (proximo && proximo.tier === skill.tier) {
        return `🔒 Tier ${skill.tier} bloqueado - Faltam ${proximo.diferenca.toFixed(1)}% no Tier ${proximo.tier - 1}`;
      }
      return `🔒 Tier ${skill.tier} bloqueado`;
    }
    
    // Verificar pré-requisitos
    for (const prereqId of skill.prereqSkills || []) {
      const prereq = this.allSkills.find(s => s.id === prereqId);
      if (prereq && !prereq.desbloqueada) {
        return `❌ Pré-requisito: ${prereq.nome} não desbloqueada`;
      }
    }
    
    // Verificar TP
    if (this.tpAtual < skill.custoTP) {
      return `❌ Falta ${skill.custoTP - this.tpAtual} TP`;
    }

    // Verificar stats
    for (const [stat, valor] of Object.entries(skill.custoStats || {})) {
      if ((this.statsJogador[stat] || 0) < valor) {
        return `❌ Falta ${valor - (this.statsJogador[stat] || 0)} em ${stat}`;
      }
    }

    return '🔓 Disponível';
  }

  podePegar(skill: Skill): boolean {
    if (skill.desbloqueada) return false;
    
    // 🔒 VERIFICAR SE TIER ESTÁ DESBLOQUEADO (NOVA VERIFICAÇÃO)
    if (this.sistemaTiers && !this.sistemaTiers.isTierDesbloqueado(skill.tier)) {
      return false;
    }
    
    // Verificar pré-requisitos
    for (const prereqId of skill.prereqSkills || []) {
      const prereq = this.allSkills.find(s => s.id === prereqId);
      if (prereq && !prereq.desbloqueada) return false;
    }
    
    // Verificar TP
    if (this.tpAtual < skill.custoTP) return false;

    // Verificar stats
    for (const [stat, valor] of Object.entries(skill.custoStats || {})) {
      if ((this.statsJogador[stat] || 0) < valor) return false;
    }

    return true;
  }

  verificar_requisitos(skill: Skill): {
    temTP: boolean;
    statsOK: boolean;
    prereqOK: boolean;
    tierOK: boolean;
    requisitos: Record<string, number>;
  } {
    const prereqOK = (skill.prereqSkills || []).every(prereqId => {
      const prereq = this.allSkills.find(s => s.id === prereqId);
      return prereq && prereq.desbloqueada;
    });

    const tierOK = !this.sistemaTiers || this.sistemaTiers.isTierDesbloqueado(skill.tier);

    return {
      temTP: this.tpAtual >= skill.custoTP,
      statsOK: Object.entries(skill.custoStats || {}).every(
        ([stat, valor]) => (this.statsJogador[stat] || 0) >= valor
      ),
      prereqOK,
      tierOK,
      requisitos: skill.custoStats || {}
    };
  }

  tentar_desbloquear(skill: Skill): { sucesso: boolean; mensagem: string } {
    if (skill.desbloqueada) {
      return { sucesso: false, mensagem: 'Skill já desbloqueada' };
    }

    if (!this.podePegar(skill)) {
      return { 
        sucesso: false, 
        mensagem: this.getMotivoTranca(skill)
      };
    }

    this.tpAtual -= skill.custoTP;
    return { 
      sucesso: true, 
      mensagem: `✅ ${skill.nome} desbloqueada!` 
    };
  }
}
