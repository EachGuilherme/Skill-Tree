import React, { useState, useMemo } from 'react';
import { useSkillStore } from '../stores/skillStore';
import { Canvas } from './Canvas';
import { Controls } from './Controls';
import { TierSelector } from './TierSelector';
import { useSkills } from '../hooks/useSkills';
import { useLayouts } from '../hooks/useLayouts';
import type { Skill } from '../types';
import '../styles/components.css';

interface SkillTreeProps {
  onSkillClick: (skillId: string) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ onSkillClick }) => {
  const { tierAtual, setTierAtual, tpAtual } = useSkillStore();
  const skillsDoTier = useSkills(tierAtual);
  const { aplicarLayout } = useLayouts();
  
  const [layout, setLayout] = useState('radial');
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const skillsComPosicao = useMemo(() => {
  return aplicarLayout(skillsDoTier, layout);
}, [skillsDoTier, layout, aplicarLayout]);


  return (
    <div className="skill-tree-container">
      <div className="sidebar">
        <TierSelector tierAtual={tierAtual} onTierChange={setTierAtual} />
        <div className="skill-info">
          {hoveredSkill && (
            <>
              <h4>{hoveredSkill.nome}</h4>
              <p>{hoveredSkill.descricao}</p>
              <p>Custo: {hoveredSkill.custoTP} TP</p>
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
          zoom={1}
          onZoomChange={() => {}}
          onResetView={() => {}}
          onLayoutChange={setLayout}
          tpAtual={tpAtual}
        />
      </div>
    </div>
  );
};