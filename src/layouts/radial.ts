import type { Skill } from '../types';
import { CONFIG } from '../types';

export function layoutRadial(skills: Skill[]): void {
  const centerX = CONFIG.CANVAS_WIDTH / 2;
  const centerY = CONFIG.CANVAS_HEIGHT / 2;
  const raioBase = 150;
  const raioIncremento = 120;

  const niveis: Map<number, Skill[]> = new Map();
  
  skills.forEach((skill, indice) => {
    const nivel = Math.floor(indice / 4);
    if (!niveis.has(nivel)) {
      niveis.set(nivel, []);
    }
    niveis.get(nivel)!.push(skill);
  });

  niveis.forEach((skillsNivel, nivel) => {
    const raioDeste = raioBase + nivel * raioIncremento;
    const anguloPorSkill = (2 * Math.PI) / skillsNivel.length;

    skillsNivel.forEach((skill, indice) => {
      const angulo = indice * anguloPorSkill;
      skill.x = centerX + raioDeste * Math.cos(angulo);
      skill.y = centerY + raioDeste * Math.sin(angulo);
    });
  });
}