interface ProgressoSalvo {
  stats: Record<string, number>;
  tp: number;
  timestamp: number;
}

export class SistemaSave {
  private saveKey = 'skill-tree-save';

  salvarProgresso(stats: Record<string, number>, tp: number): void {
    const dados: ProgressoSalvo = {
      stats,
      tp,
      timestamp: Date.now()
    };
    localStorage.setItem(this.saveKey, JSON.stringify(dados));
  }

  carregarProgresso(): ProgressoSalvo | null {
    const dados = localStorage.getItem(this.saveKey);
    if (!dados) return null;
    try {
      return JSON.parse(dados) as ProgressoSalvo;
    } catch {
      return null;
    }
  }

  resetarJogo(): void {
    localStorage.removeItem(this.saveKey);
  }

  exportarBackup(): void {
    const dados = localStorage.getItem(this.saveKey);
    if (!dados) {
      alert('Nenhum save para exportar');
      return;
    }

    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skill-tree-backup-${Date.now()}.json`;
    a.click();
  }
}
