import React from 'react';
import { CONFIG } from '../types';
import '../styles/components.css';

interface TierSelectorProps {
  tierAtual: number;
  onTierChange: (tier: number) => void;
}

export const TierSelector: React.FC<TierSelectorProps> = ({
  tierAtual,
  onTierChange
}) => {
  return (
    <div className="tier-selector">
      <h3>Tiers</h3>
      {Array.from({ length: CONFIG.TIERS_TOTAL }).map((_, i) => (
        <button
          key={i}
          className={`tier-btn ${tierAtual === i ? 'ativo' : ''}`}
          onClick={() => onTierChange(i)}
        >
          Tier {i}
        </button>
      ))}
    </div>
  );
};
