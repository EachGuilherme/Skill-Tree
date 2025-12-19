import React, { useRef, useMemo } from 'react';
import type { Skill} from '../types';
import { CONFIG } from '../types';
import { SkillComponent } from './Skill';
import { usePanZoom } from '../hooks/usePanZoom';
import { SistemaLocks } from '../modules/SistemaLocks';
import { useSkillStore } from '../stores/skillStore';

interface CanvasProps {
  skills: Skill[];
  onSkillClick: (skillId: string) => void;
  onSkillHover: (skill: Skill | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  skills,
  onSkillClick,
  onSkillHover,
}) => {
  const { zoom, panX, panY, handleMouseDown, svgRef } = usePanZoom();
  const { statsJogador, tpAtual } = useSkillStore();

  // ✅ Criar sistema de locks para determinar cores
  const sistemaLocks = useMemo(
    () => new SistemaLocks(statsJogador, tpAtual, skills),
    [statsJogador, tpAtual, skills]
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
            onClick={() => onSkillClick(skill.id)}
            onMouseEnter={() => onSkillHover(skill)}
            onMouseLeave={() => onSkillHover(null)}
          />
        ))}
      </g>
    </svg>
  );
};
