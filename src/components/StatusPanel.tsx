import React, { useState } from 'react';
import { useSkillStore } from '../stores/skillStore';
import '../styles/status-panel.css';

interface StatusPanelProps {
  onResetView?: () => void;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ onResetView }) => {
  const { tpAtual, setTPAtual, statsJogador, setStat } = useSkillStore();
  const [editandoTP, setEditandoTP] = useState(false);
  const [editandoStats, setEditandoStats] = useState(false);
  const [tpTemp, setTpTemp] = useState(tpAtual.toString());

  const handleSaveTP = () => {
    const novoTP = parseInt(tpTemp) || 0;
    setTPAtual(Math.max(0, novoTP));
    setEditandoTP(false);
  };

  const handleStatChange = (stat: string, valor: string) => {
    const novoValor = Math.max(0, Math.min(99, parseInt(valor) || 0));
    setStat(stat, novoValor);
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
                max="99"
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
        >
          🔍 Resetar Visão
        </button>
      </div>

      {/* Tips */}
      <div className="stat-group">
        <label><small>
          💡 Dicas:<br/>
          • Clique em TP para editar<br/>
          • Clique em ✏️ para editar Stats<br/>
          • Clique nas skills para desbloquear
        </small></label>
      </div>
    </div>
  );
};
