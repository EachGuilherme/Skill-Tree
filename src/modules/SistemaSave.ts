import type { Skill } from '../types';

interface SaveData {
  versao: number;
  timestamp: string;
  stats: Record<string, number>;
  tpAtual: number;
  skillsDesbloqueadas: string[];
}

export class SistemaSave {
  private CHAVE_DADOS = 'skill_tree_save';
  private VERSAO_ATUAL = 1;

  salvarProgresso(
    statsJogador: Record<string, number>,
    tpAtual: number,
    skillsDesbloqueadas: string[]
  ): SaveData {
    const dados: SaveData = {
      versao: this.VERSAO_ATUAL,
      timestamp: new Date().toISOString(),
      stats: statsJogador,
      tpAtual,
      skillsDesbloqueadas
    };

    localStorage.setItem(this.CHAVE_DADOS, JSON.stringify(dados));
    console.log('💾 Progresso salvo!');
    return dados;
  }

  carregarProgresso(): SaveData | null {
    const dadosJSON = localStorage.getItem(this.CHAVE_DADOS);

    if (!dadosJSON) {
      console.log('📂 Nenhum save encontrado. Começando novo jogo.');
      return null;
    }

    try {
      const dados = JSON.parse(dadosJSON) as SaveData;
      console.log('📂 Save carregado!');
      return dados;
    } catch (erro) {
      console.error('❌ Erro ao carregar save:', erro);
      return null;
    }
  }

  getInfoUltimoSave(totalSkills: number): {
    timestamp: string;
    stats: Record<string, number>;
    tpAtual: number;
    skillsDesbloqueadas: number;
    ultimaSalvagem: string;
  } | null {
    const dadosJSON = localStorage.getItem(this.CHAVE_DADOS);

    if (!dadosJSON) {
      return null;
    }

    try {
      const dados = JSON.parse(dadosJSON) as SaveData;
      return {
        timestamp: dados.timestamp,
        stats: dados.stats,
        tpAtual: dados.tpAtual,
        skillsDesbloqueadas: dados.skillsDesbloqueadas.length,
        ultimaSalvagem: new Date(dados.timestamp).toLocaleString('pt-BR')
      };
    } catch (erro) {
      return null;
    }
  }

  gerarRelatorio(
    statsJogador: Record<string, number>,
    tpAtual: number,
    skillsDesbloqueadas: string[],
    totalSkills: number
  ): string {
    const info = this.getInfoUltimoSave(totalSkills);

    if (!info) {
      return '❌ Nenhum progresso para relatar';
    }

    let relatorio = '\n' + '='.repeat(50);
    relatorio += '\n📋 RELATÓRIO DE PROGRESSO\n';
    relatorio += '='.repeat(50) + '\n\n';

    relatorio += `⏰ Última salvagem: ${info.ultimaSalvagem}\n`;
    relatorio += `💰 TP Disponível: ${tpAtual}\n`;
    relatorio += `\n📋 STATS:\n`;
    relatorio += `   STR: ${statsJogador['STR'] || 0}\n`;
    relatorio += `   DEX: ${statsJogador['DEX'] || 0}\n`;
    relatorio += `   CON: ${statsJogador['CON'] || 0}\n`;
    relatorio += `   WIL: ${statsJogador['WIL'] || 0}\n`;
    relatorio += `   MND: ${statsJogador['MND'] || 0}\n`;
    relatorio += `   SPI: ${statsJogador['SPI'] || 0}\n`;
    relatorio += `\n🎯 SKILLS DESBLOQUEADAS: ${skillsDesbloqueadas.length}/${totalSkills}\n`;
    relatorio += '\n' + '='.repeat(50) + '\n';

    return relatorio;
  }

  exportarBackup(
    statsJogador: Record<string, number>,
    tpAtual: number,
    skillsDesbloqueadas: string[]
  ): void {
    const dados: SaveData = {
      versao: this.VERSAO_ATUAL,
      timestamp: new Date().toISOString(),
      stats: statsJogador,
      tpAtual,
      skillsDesbloqueadas
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `skill-tree-backup-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    console.log('📄 Backup exportado!');
  }

  importarBackup(arquivo: File): Promise<SaveData> {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();

      leitor.onload = (evento) => {
        try {
          const dados = JSON.parse(
            evento.target?.result as string
          ) as SaveData;
          localStorage.setItem(this.CHAVE_DADOS, JSON.stringify(dados));
          console.log('📄 Backup importado com sucesso!');
          resolve(dados);
        } catch (erro) {
          reject(erro);
        }
      };

      leitor.onerror = () => reject(new Error('Erro ao ler arquivo'));
      leitor.readAsText(arquivo);
    });
  }

  deletarSave(): void {
    localStorage.removeItem(this.CHAVE_DADOS);
    console.log('🗑️ Save deletado!');
  }

  resetarJogo(): boolean {
    if (
      confirm(
        '⚠️  Deseja mesmo resetar TUDO? Esta ação não pode ser desfeita!'
      )
    ) {
      this.deletarSave();
      console.log('🔄 Jogo resetado!');
      return true;
    }
    return false;
  }
}
