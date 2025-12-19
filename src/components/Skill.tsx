import React from 'react';
import type { Skill } from '../types';
import { CONFIG } from '../types';
import '../styles/components.css';

interface SkillProps {
  skill: Skill;
  cor: string;
  onClick: () => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export const SkillComponent: React.FC<SkillProps> = ({
  skill,
  cor,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  if (skill.x === undefined || skill.y === undefined) return null;

  return (
    <>
      <circle
        cx={skill.x}
        cy={skill.y}
        r={CONFIG.SKILL_RADIUS}
        fill={cor}
        stroke="#fff"
        strokeWidth={CONFIG.SKILL_STROKE}
        className="skill-circle"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ cursor: 'pointer' }}
      />
      <text
        x={skill.x}
        y={skill.y - 5}
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#fff"
        pointerEvents="none"
      >
        {skill.nome.substring(0, 8)}
      </text>
      <text
        x={skill.x}
        y={skill.y + 12}
        textAnchor="middle"
        fontSize="9"
        fill="#aaa"
        pointerEvents="none"
      >
        T{skill.tier}
      </text>
    </>
  );
};
