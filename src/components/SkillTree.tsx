import React, { useState, useMemo, useCallback } from 'react';
import { useSkillStore } from '../stores/skillStore';
import { Canvas } from './Canvas';
import { Controls } from './Controls';
import { TierSelector } from './TierSelector';
import { StatusPanel } from './StatusPanel';
import { useSkills } from '../hooks/useSkills';
import { useLayouts } from '../hooks/useLayouts';
import { usePanZoom } from '../hooks/usePanZoom';
import { SistemaLocks } from '../modules/SistemaLocks';
import type { Skill } from '../types';
import '../styles/components.css';

interface SkillTreeProps {
  onSkillClick: (skillId: string) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ onSkillClick }) => {
  const { tierAtual, setTierAtual, tpAtual, statsJogador, skills } = useSkillStore();
  const skillsDoTier = useSkills(tierAtual);
  const { aplicarLayout } = useLayouts();
  const { zoom, panX, panY, resetView } = usePanZoom();
  
  const [layout, setLayout] = useState('radial');
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const skillsComPosicao = useMemo(() => {
    return aplicarLayout(skillsDoTier, layout);
  }, [skillsDoTier, layout, aplicarLayout]);

  const handleResetView = useCallback(() => {
    resetView();
  }, [resetView]);

  // ✅ Calcular requisitos para exibir
  const requisitosSkill = useMemo(() => {
    if (!hoveredSkill) return null;
    
    const sistemaLocks = new SistemaLocks(statsJogador, tpAtual, skills);
    const resultado = sistemaLocks.verificar_requisitos(hoveredSkill);
    
    return {
      tpOK: resultado.temTP,
      statsOK: resultado.statsOK,
      prereqOK: resultado.prereqOK,
      requisitos: resultado.requisitos
    };
  }, [hoveredSkill, statsJogador, tpAtual, skills]);

  return (
    <div className="skill-tree-container">
      <StatusPanel onResetView={handleResetView} />

      <div className="sidebar">
        <TierSelector tierAtual={tierAtual} onTierChange={setTierAtual} />
        <div className="skill-info">
          {hoveredSkill && (
            <>
              <h4>{hoveredSkill.nome}</h4>
              <p>{hoveredSkill.descricao}</p>
              
              {/* TP Cost */}
              <div className="requisito-item">
                <span className="requisito-label">Custo TP:</span>
                <span className={`requisito-valor ${requisitosSkill?.tpOK ? 'ok' : 'nao-ok'}`}>
                  {hoveredSkill.custoTP}
                </span>
              </div>

              {/* Stats Requirements */}
              {requisitosSkill?.requisitos && Object.keys(requisitosSkill.requisitos).length > 0 && (
                <div className="requisitos-section">
                  <span className="requisito-label">Requisitos de Stats:</span>
                  {Object.entries(requisitosSkill.requisitos).map(([stat, valor]) => {
                    const playerValue = statsJogador[stat] || 0;
                    const isSatisfied = playerValue >= (valor as number);
                    return (
                      <div key={stat} className="requisito-item">
                        <span className="stat-name">{stat}:</span>
                        <span className={`requisito-valor ${isSatisfied ? 'ok' : 'nao-ok'}`}>
                          {playerValue}/{valor}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Prerequisite Skills */}
              {hoveredSkill.prereqSkills && hoveredSkill.prereqSkills.length > 0 && (
                <div className="requisitos-section">
                  <span className="requisito-label">Habilidades Pré-requisito:</span>
                  {hoveredSkill.prereqSkills.map((prereqId) => {
                    const prereqSkill = skills.find(s => s.id === prereqId);
                    if (!prereqSkill) return null;
                    return (
                      <div key={prereqId} className="requisito-item">
                        <span className="stat-name">{prereqSkill.nome}:</span>
                        <span className={`requisito-valor ${prereqSkill.desbloqueada ? 'ok' : 'nao-ok'}`}>
                          {prereqSkill.desbloqueada ? '✓ Desbloqueada' : '✕ Bloqueada'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="canvas-container">
        <Canvas
          skills={skillsComPosicao}
          onSkillClick={onSkillClick}
          onSkillHover={setHoveredSkill}
        />
        <Controls
          zoom={zoom}
          onZoomChange={() => {}}
          onResetView={handleResetView}
          onLayoutChange={setLayout}
          tpAtual={tpAtual}
        />
      </div>
    </div>
  );
};
