import type { Skill } from '../types';

export class SistemaLocks {
  private statsJogador: Record<string, number>;
  private tpAtual: number;
  private allSkills: Skill[] = []; // Para verificar pré-requisitos

  constructor(stats: Record<string, number>, tp: number, allSkills: Skill[] = []) {
    this.statsJogador = stats;
    this.tpAtual = tp;
    this.allSkills = allSkills;
  }

  getCorSkill(skill: Skill): string {
    if (skill.desbloqueada) return '#32b8c6'; // Verde
    if (this.podePegar(skill)) return '#e68c47'; // Amarelo (disponível)
    return '#555555'; // Cinza (bloqueado)
  }

  getMotivoTranca(skill: Skill): string {
    if (skill.desbloqueada) return '✅ Desbloqueada';
    
    // Verificar pré-requisitos primeiro
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
    requisitos: Record<string, number>;
  } {
    const prereqOK = (skill.prereqSkills || []).every(prereqId => {
      const prereq = this.allSkills.find(s => s.id === prereqId);
      return prereq && prereq.desbloqueada;
    });

    return {
      temTP: this.tpAtual >= skill.custoTP,
      statsOK: Object.entries(skill.custoStats || {}).every(
        ([stat, valor]) => (this.statsJogador[stat] || 0) >= valor
      ),
      prereqOK,
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
