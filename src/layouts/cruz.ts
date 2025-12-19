import type { Skill } from '../types';
import { CONFIG } from '../types';

export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function layoutCruz(skills: Skill[]): void {
  const centerX = CONFIG.CANVAS_WIDTH / 2;
  const centerY = CONFIG.CANVAS_HEIGHT / 2;

  if (skills.length === 0) return;

  // Skill central
  skills[0].x = centerX;
  skills[0].y = centerY;

  const skillsRestantes = skills.slice(1);
  const direcoes = [
    { angulo: 0, nome: 'Leste' },
    { angulo: Math.PI / 2, nome: 'Sul' },
    { angulo: Math.PI, nome: 'Oeste' },
    { angulo: (3 * Math.PI) / 2, nome: 'Norte' }
  ];

  const espacoEntreCamadas = 160;
  const skillsPorBraco = Math.ceil(skillsRestantes.length / direcoes.length);
  const numCamadas = Math.ceil(skillsPorBraco);

  let skillIndex = 0;

  for (let camada = 1; camada <= numCamadas; camada++) {
    for (let dir = 0; dir < direcoes.length; dir++) {
      if (skillIndex >= skillsRestantes.length) break;

      const direcao = direcoes[dir];
      const skill = skillsRestantes[skillIndex];
      const distancia = camada * espacoEntreCamadas;

      const seed = skillIndex * 12.9898;
      const ruido = (seededRandom(seed) - 0.5) * 30;

      let x = centerX + distancia * Math.cos(direcao.angulo);
      let y = centerY + distancia * Math.sin(direcao.angulo);

      x += ruido * Math.cos(direcao.angulo + Math.PI / 2);
      y += ruido * Math.sin(direcao.angulo + Math.PI / 2);

      skill.x = x;
      skill.y = y;

      skillIndex++;
    }
  }
}