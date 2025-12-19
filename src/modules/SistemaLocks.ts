import type { Skill } from '../types';

export class SistemaLocks {
  private statsJogador: Record<string, number>;
  private tpAtual: number;

  constructor(stats: Record<string, number>, tp: number) {
    this.statsJogador = stats;
    this.tpAtual = tp;
  }

  getCorSkill(skill: Skill): string {
    if (skill.desbloqueada) return '#32b8c6'; // Verde
    if (this.podePegar(skill)) return '#e68c47'; // Amarelo (disponível)
    return '#555555'; // Cinza (bloqueado)
  }

  getMotivoTranca(skill: Skill): string {
    if (skill.desbloqueada) return '✅ Desbloqueada';
    
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
    
    // Verificar TP
    if (this.tpAtual < skill.custoTP) return false;

    // Verificar stats
    for (const [stat, valor] of Object.entries(skill.custoStats || {})) {
      if ((this.statsJogador[stat] || 0) < valor) return false;
    }

    return true;
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