import React from 'react';
import { useSkillStore } from '../stores/skillStore';
import '../styles/status-panel.css';

interface StatusPanelProps {
  onResetView?: () => void;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ onResetView }) => {
  const { tpAtual, statsJogador } = useSkillStore();

  return (
    <div className="status-panel">
      <h2>⚔️ Status</h2>

      <div className="stat-group">
        <label>💰 TP Disponível:</label>
        <div className="tp-display">{tpAtual}</div>
      </div>

      <div className="stat-group">
        <label><strong>📊 Stats Base:</strong></label>
        
        <div className="stat">
          <span>STR (Força):</span>
          <span>{statsJogador.str || 0}</span>
        </div>
        
        <div className="stat">
          <span>DEX (Destreza):</span>
          <span>{statsJogador.dex || 0}</span>
        </div>
        
        <div className="stat">
          <span>CON (Constituição):</span>
          <span>{statsJogador.con || 0}</span>
        </div>
        
        <div className="stat">
          <span>WIL (Vontade):</span>
          <span>{statsJogador.wil || 0}</span>
        </div>
        
        <div className="stat">
          <span>MND (Mente):</span>
          <span>{statsJogador.mnd || 0}</span>
        </div>
        
        <div className="stat">
          <span>SPI (Espírito):</span>
          <span>{statsJogador.spi || 0}</span>
        </div>
      </div>

      <div className="stat-group">
        <button 
          onClick={onResetView}
          className="btn btn-info"
        >
          🔍 Resetar Visão
        </button>
      </div>

      <div className="stat-group">
        <label><small>
          💡 Dicas:<br/>
          • Clique nas skills para desbloquear<br/>
          • Arraste para mover a visão (pan)<br/>
          • Use scroll para zoom
        </small></label>
      </div>
    </div>
  );
};
