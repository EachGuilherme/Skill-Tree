import { useCallback } from 'react';
import type { Skill } from '../types';
import { layoutRadial, layoutCruz, layoutEscalonada } from '../layouts';

export function useLayouts() {
  const aplicarLayout = useCallback((skills: Skill[], layoutTipo: string) => {
    const skillsCopia = [...skills];
    
    switch (layoutTipo) {
      case 'radial':
        layoutRadial(skillsCopia);
        break;
      case 'cruz':
        layoutCruz(skillsCopia);
        break;
      case 'escalonada':
        layoutEscalonada(skillsCopia);
        break;
      default:
        layoutRadial(skillsCopia);
    }
    
    return skillsCopia;
  }, []);

  return { aplicarLayout };
}