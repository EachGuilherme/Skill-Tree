import React, { useRef, useMemo } from 'react';
import type { Skill } from '../types';
import { CONFIG } from '../types';
import { SkillComponent } from './Skill';
import { usePanZoom } from '../hooks/usePanZoom';
import { SistemaLocks } from '../modules/SistemaLocks';
import { SistemaTiers } from '../modules/SistemaTiers';
import { useSkillStore } from '../stores/skillStore';
import { tiers } from '../data';

interface CanvasProps {
  skills: Skill[]; // Skills com posição (do tier atual)
  allSkills: Skill[]; // Todas as skills para sincronizar SistemaTiers
  onSkillMouseDown: (skillId: string) => void;
  onSkillHover: (skill: Skill | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  skills,
  allSkills,
  onSkillMouseDown,
  onSkillHover,
}) => {
  const { zoom, panX, panY, handleMouseDown, svgRef } = usePanZoom();
  const { statsJogador, tpAtual } = useSkillStore();

  // 💯 Criar instância de SistemaTiers com TODAS as skills
  const sistemaTiers = useMemo(() => {
    if (!allSkills || allSkills.length === 0) {
      return new SistemaTiers([], tiers);
    }
    const sistema = new SistemaTiers(allSkills, tiers);
    // Carregar skills desbloqueadas
    const skillsDesbloqueadas = allSkills
      .filter(s => s.desbloqueada)
      .map(s => s.id);
    sistema.carregarSkillsDesbloqueadas(skillsDesbloqueadas);
    return sistema;
  }, [allSkills]);

  // ✅ Criar sistema de locks para determinar cores
  const sistemaLocks = useMemo(
    () => new SistemaLocks(statsJogador, tpAtual, allSkills, sistemaTiers),
    [statsJogador, tpAtual, allSkills, sistemaTiers]
  );

  const getCorSkill = (skill: Skill): string => {
    return sistemaLocks.getCorSkill(skill);
  };

  return (
    <svg
      ref={svgRef}
      width={CONFIG.CANVAS_WIDTH}
      height={CONFIG.CANVAS_HEIGHT}
      style={{
        backgroundColor: CONFIG.COLORS.background,
        border: '1px solid #333',
        cursor: 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <g transform={`translate(${panX}, ${panY}) scale(${zoom})`}>
        {/* Linhas de conexão */}
        {skills.map((skill) =>
          skill.prereqSkills.map((preqId) => {
            const prereq = skills.find(s => s.id === preqId);
            if (!prereq || !skill.x || !skill.y || !prereq.x || !prereq.y) return null;

            return (
              <line
                key={`${skill.id}-${preqId}`}
                x1={prereq.x}
                y1={prereq.y}
                x2={skill.x}
                y2={skill.y}
                stroke="#666"
                strokeWidth="1"
                strokeDasharray="5,5"
                pointerEvents="none"
              />
            );
          })
        )}

        {/* Skills */}
        {skills.map((skill) => (
          <SkillComponent
            key={skill.id}
            skill={skill}
            cor={getCorSkill(skill)}
            onMouseDown={() => onSkillMouseDown(skill.id)}
            onMouseEnter={() => onSkillHover(skill)}
            onMouseLeave={() => onSkillHover(null)}
          />
        ))}
      </g>
    </svg>
  );
};
