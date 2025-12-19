import React, { useState } from 'react';
import { useSkillStore } from '../stores/skillStore';
import { SistemaSave } from '../modules/SistemaSave';
import '../styles/status-panel.css';

interface StatusPanelProps {
  onResetView?: () => void;
  onReset?: () => void;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ onResetView, onReset }) => {
  const { tpAtual, setTPAtual, statsJogador, setStat, skills, setSkills } = useSkillStore();
  const [editandoTP, setEditandoTP] = useState(false);
  const [editandoStats, setEditandoStats] = useState(false);
  const [tpTemp, setTpTemp] = useState(tpAtual.toString());
  const sistemaSave = new SistemaSave();

  const handleSaveTP = () => {
    const novoTP = parseInt(tpTemp) || 0;
    setTPAtual(Math.max(0, novoTP));
    setEditandoTP(false);
    salvarProgresso();
  };

  const handleStatChange = (stat: string, valor: string) => {
    const novoValor = Math.max(0, Math.min(99, parseInt(valor) || 0));
    setStat(stat, novoValor);
    salvarProgresso();
  };

  const salvarProgresso = () => {
    const skillsDesbloqueadas = skills
      .filter(s => s.desbloqueada)
      .map(s => s.id);
    sistemaSave.salvarProgresso(statsJogador, tpAtual, skillsDesbloqueadas);
  };

  const handleReset = () => {
    if (
      confirm(
        '⚠️  Deseja mesmo RESETAR TUDO? Esta ação não pode ser desfeita!'
      )
    ) {
      // Resetar stats
      setStat('STR', 0);
      setStat('DEX', 0);
      setStat('CON', 0);
      setStat('WIL', 0);
      setStat('MND', 0);
      setStat('SPI', 0);

      // Resetar TP
      setTPAtual(100000);

      // Resetar skills (manter apenas a root)
      const skillsResset = skills.map(s => ({
        ...s,
        desbloqueada: s.id === 'root'
      }));
      setSkills(skillsResset);

      // Deletar save
      sistemaSave.deletarSave();

      console.log('🔄 Jogo resetado!');
      alert('🔄 Jogo resetado com sucesso!');

      if (onReset) onReset();
    }
  };

  const handleExportarBackup = () => {
    const skillsDesbloqueadas = skills
      .filter(s => s.desbloqueada)
      .map(s => s.id);
    sistemaSave.exportarBackup(statsJogador, tpAtual, skillsDesbloqueadas);
  };

  const handleImportarBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      sistemaSave.importarBackup(arquivo).then(() => {
        alert('📄 Backup importado! Recarregando...');
        window.location.reload();
      }).catch(() => {
        alert('❌ Erro ao importar backup');
      });
    }
  };

  const handleRelatorio = () => {
    const skillsDesbloqueadas = skills
      .filter(s => s.desbloqueada)
      .map(s => s.id);
    const relatorio = sistemaSave.gerarRelatorio(
      statsJogador,
      tpAtual,
      skillsDesbloqueadas,
      skills.length
    );
    alert(relatorio);
  };

  return (
    <div className="status-panel">
      <h2>⚔️ Status</h2>

      {/* TP Section */}
      <div className="stat-group">
        <label>💰 TP Disponível:</label>
        {editandoTP ? (
          <div className="edit-container">
            <input
              type="number"
              min="0"
              value={tpTemp}
              onChange={(e) => setTpTemp(e.target.value)}
              className="stat-input"
              autoFocus
            />
            <button onClick={handleSaveTP} className="btn-save">✓</button>
            <button onClick={() => setEditandoTP(false)} className="btn-cancel">✕</button>
          </div>
        ) : (
          <div 
            className="tp-display" 
            onClick={() => {
              setTpTemp(tpAtual.toString());
              setEditandoTP(true);
            }}
            title="Clique para editar"
          >
            {tpAtual}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="stat-group">
        <div className="stats-header">
          <label><strong>📊 Stats Base:</strong></label>
          <button 
            className="btn-edit-stats"
            onClick={() => setEditandoStats(!editandoStats)}
            title={editandoStats ? "Fechar edição" : "Editar stats"}
          >
            {editandoStats ? "✓" : "✏️"}
          </button>
        </div>
        
        {['STR', 'DEX', 'CON', 'WIL', 'MND', 'SPI'].map((stat) => (
          <div key={stat} className="stat">
            <span>{stat} ({stat === 'STR' ? 'Força' : stat === 'DEX' ? 'Destreza' : stat === 'CON' ? 'Constituição' : stat === 'WIL' ? 'Vontade' : stat === 'MND' ? 'Mente' : 'Espírito'}):</span>
            {editandoStats ? (
              <input
                type="number"
                min="0"
                max="999999"
                value={statsJogador[stat] || 0}
                onChange={(e) => handleStatChange(stat, e.target.value)}
                className="stat-input-small"
              />
            ) : (
              <span className="stat-value">{statsJogador[stat] || 0}</span>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="stat-group">
        <button 
          onClick={onResetView}
          className="btn btn-info"
          title="Voltar zoom e pan para o padrão"
        >
          🔍 Resetar Visão
        </button>
      </div>

      {/* Save Actions */}
      <div className="stat-group">
        <button 
          onClick={handleRelatorio}
          className="btn btn-info"
          title="Ver relatório de progresso"
        >
          📋 Relatório
        </button>
        <button 
          onClick={handleExportarBackup}
          className="btn btn-info"
          title="Exportar seu progresso em arquivo"
        >
          📥 Exportar
        </button>
        <label className="btn btn-info" title="Importar progresso de arquivo">
          📄 Importar
          <input
            type="file"
            accept=".json"
            onChange={handleImportarBackup}
            style={{ display: 'none' }}
          />
        </label>
        <button 
          onClick={handleReset}
          className="btn btn-danger"
          title="Resetar tudo (irrevogável)"
        >
          🔄 Resetar Tudo
        </button>
      </div>

      {/* Tips */}
      <div className="stat-group">
        <label><small>
          💡 Dicas:<br/>
          • Clique em TP para editar<br/>
          • Clique em ✏️ para editar Stats<br/>
          • Progresso é salvo automaticamente
        </small></label>
      </div>
    </div>
  );
};
