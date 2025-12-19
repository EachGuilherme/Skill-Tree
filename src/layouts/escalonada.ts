import type { Skill } from '../types';
import { CONFIG } from '../types';

export function layoutEscalonada(skills: Skill[]): void {
  const centerX = CONFIG.CANVAS_WIDTH / 2;
  const centerY = CONFIG.CANVAS_HEIGHT / 2;

  if (skills.length === 0) return;

  // Distribui em padrão escalonado (tipo degraus)
  const colunas = 4;
  const espacoX = 300;
  const espacoY = 250;

  skills.forEach((skill, indice) => {
    const coluna = indice % colunas;
    const linha = Math.floor(indice / colunas);

    skill.x = centerX - (colunas * espacoX) / 2 + coluna * espacoX;
    skill.y = centerY - 200 + linha * espacoY;
  });
}