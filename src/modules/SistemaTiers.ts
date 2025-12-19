import type { Skill, TierInfo, ProgressoTier } from '../types';

export class SistemaTiers {
  private tiers: TierInfo[] = [];
  private skillsPorTier: Map<number, Skill[]> = new Map();
  private skillsDesbloqueadas: Set<string> = new Set();
  private tierUnlockPercentages: Record<number, number> = {
    1: 20,  // Tier 1 desbloqueia com 20% do Tier 0
    2: 40,  // Tier 2 desbloqueia com 40% do Tier 1
    3: 60,  // Tier 3 desbloqueia com 60% do Tier 2
    4: 80,  // Tier 4 desbloqueia com 80% do Tier 3
    5: 90,  // Tier 5 desbloqueia com 90% do Tier 4
  };

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
    const percentual = skills.length > 0 ? (desbloqueadas / skills.length) * 100 : 0;
    
    return {
      numero,
      total: skills.length,
      desbloqueadas,
      percentual
    };
  }

  /**
   * Verifica se um tier está desbloqueado
   * - Tier 0 sempre está desbloqueado
   * - Tiers subsequentes são desbloqueados quando o tier anterior atinge a porcentagem requerida
   */
  isTierDesbloqueado(numero: number): boolean {
    if (numero === 0) return true; // Tier 0 sempre desbloqueado
    
    if (numero < 0 || numero > this.tiers.length - 1) return false;
    
    // Verificar se o tier anterior atingiu a porcentagem requerida
    const tierAnterior = numero - 1;
    const percentualRequerido = this.tierUnlockPercentages[numero];
    
    if (percentualRequerido === undefined) return false;
    
    const progressoAnterior = this.getProgressoTier(tierAnterior);
    return progressoAnterior.percentual >= percentualRequerido;
  }

  /**
   * Retorna informações sobre o próximo tier a ser desbloqueado
   */
  getProximoTierParaDesbloquear(): { tier: number; percentualRequerido: number; percentualAtual: number; diferenca: number } | null {
    for (let i = 0; i < this.tiers.length; i++) {
      if (!this.isTierDesbloqueado(i)) {
        const tierAnterior = i - 1;
        const percentualRequerido = this.tierUnlockPercentages[i] || 0;
        const percentualAtual = this.getProgressoTier(tierAnterior).percentual;
        const diferenca = Math.max(0, percentualRequerido - percentualAtual);
        
        return {
          tier: i,
          percentualRequerido,
          percentualAtual,
          diferenca
        };
      }
    }
    return null;
  }

  /**
   * Desbloqueia uma skill
   */
  desbloquearSkill(skillId: string): void {
    this.skillsDesbloqueadas.add(skillId);
  }

  /**
   * Verifica se uma skill está desbloqueada
   */
  isSkillDesbloqueada(skillId: string): boolean {
    return this.skillsDesbloqueadas.has(skillId);
  }

  /**
   * Carrega as skills desbloqueadas (para salvar/carregar progresso)
   */
  carregarSkillsDesbloqueadas(skillIds: string[]): void {
    this.skillsDesbloqueadas = new Set(skillIds);
  }

  /**
   * Retorna todas as skills desbloqueadas
   */
  obterSkillsDesbloqueadas(): string[] {
    return Array.from(this.skillsDesbloqueadas);
  }

  /**
   * Gera um relatório de progresso
   */
  gerarRelatorioProgresso(): string {
    let relatorio = '\n🎯 PROGRESSO POR TIER:\n';
    relatorio += '================================\n';
    
    for (let i = 0; i < this.tiers.length; i++) {
      const progresso = this.getProgressoTier(i);
      const desbloqueado = this.isTierDesbloqueado(i) ? '✅' : '🔒';
      const barra = this.gerarBarraProgresso(progresso.percentual);
      relatorio += `${desbloqueado} Tier ${i} (${this.tiers[i].nome}): ${barra} ${progresso.desbloqueadas}/${progresso.total} (${progresso.percentual.toFixed(1)}%)\n`;
    }
    
    relatorio += '================================\n';
    
    const proximo = this.getProximoTierParaDesbloquear();
    if (proximo) {
      relatorio += `\n⚡ Próximo Tier (${proximo.tier}) em: ${proximo.diferenca.toFixed(1)}% mais\n`;
    } else {
      relatorio += '\n🌟 Todos os Tiers desbloqueados!\n';
    }
    
    return relatorio;
  }

  /**
   * Gera uma barra visual de progresso
   */
  private gerarBarraProgresso(percentual: number): string {
    const cheio = Math.round(percentual / 5);
    const vazio = 20 - cheio;
    return '[' + '█'.repeat(cheio) + '░'.repeat(vazio) + ']';
  }
}
