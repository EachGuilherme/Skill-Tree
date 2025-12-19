import React from 'react';
import { CONFIG } from '../types';
import { SistemaTiers } from '../modules/SistemaTiers';
import { useSkillStore } from '../stores/skillStore';
import { allSkills, tiers } from '../data';
import '../styles/components.css';

interface TierSelectorProps {
  tierAtual: number;
  onTierChange: (tier: number) => void;
}

export const TierSelector: React.FC<TierSelectorProps> = ({
  tierAtual,
  onTierChange
}) => {
  const { skills } = useSkillStore();

  // Criar instância de SistemaTiers
  const sistemaTiers = React.useMemo(() => {
    if (!skills || skills.length === 0) {
      return new SistemaTiers([], tiers);
    }
    const sistema = new SistemaTiers(skills, tiers);
    // Carregar skills desbloqueadas
    const skillsDesbloqueadas = skills
      .filter(s => s.desbloqueada)
      .map(s => s.id);
    sistema.carregarSkillsDesbloqueadas(skillsDesbloqueadas);
    return sistema;
  }, [skills]);

  return (
    <div className="tier-selector">
      <h3>Tiers</h3>
      {Array.from({ length: CONFIG.TIERS_TOTAL }).map((_, i) => {
        const desbloqueado = sistemaTiers.isTierDesbloqueado(i);
        return (
          <button
            key={i}
            className={`tier-btn ${
              tierAtual === i ? 'ativo' : ''
            } ${desbloqueado ? 'desbloqueado' : 'bloqueado'}`}
            onClick={() => onTierChange(i)}
            disabled={!desbloqueado}
            title={desbloqueado ? '' : '🔒 Tier Bloqueado'}
          >
            Tier {i}
          </button>
        );
      })}
    </div>
  );
};
