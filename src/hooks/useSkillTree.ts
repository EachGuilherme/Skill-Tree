import { useEffect, useCallback, useMemo } from 'react';
import type { Skill, TierInfo } from '../types';
import { useSkillStore } from '../stores/skillStore';
import { SistemaTiers } from '../modules/SistemaTiers';
import { SistemaLocks } from '../modules/SistemaLocks';
import { SistemaSave } from '../modules/SistemaSave';

export function useSkillTree(skillsData: Skill[], tiersData: TierInfo[]) {
  const {
    skills,
    setSkills,
    tpAtual,
    setTPAtual,
    statsJogador,
    desbloquearSkill
  } = useSkillStore();

const sistemaTiers = useMemo(
  () => new SistemaTiers(skillsData, tiersData),
  [skillsData, tiersData]
);

const sistemaLocks = useMemo(
  () => new SistemaLocks(statsJogador, tpAtual),
  [statsJogador, tpAtual]
);

const sistemaSave = useMemo(
  () => new SistemaSave(),
  []
);

  // ✅ useCallback evita dependencies infinitas
  const inicializarJogo = useCallback(() => {
    const dadosCarregados = sistemaSave.carregarProgresso();
    if (dadosCarregados) {
      setTPAtual(dadosCarregados.tp);
    }

    if (skillsData && skillsData.length > 0) {
      setSkills(skillsData);
    }
  }, [skillsData, setSkills, setTPAtual, sistemaSave]);

  useEffect(() => {
    inicializarJogo();
  }, [inicializarJogo]);

const tentarDesbloquearSkill = useCallback((skillId: string) => {
  const skill = skills.find(s => s.id === skillId);
  if (!skill) return;

  const resultado = sistemaLocks.tentar_desbloquear(skill);
  if (resultado.sucesso) {
    desbloquearSkill(skillId);
    sistemaSave.salvarProgresso(statsJogador, tpAtual);
  }

  return resultado;
}, [skills, sistemaLocks, desbloquearSkill, sistemaSave, statsJogador, tpAtual]);


  return {
    sistemaTiers,
    sistemaLocks,
    sistemaSave,
    tentarDesbloquearSkill
  };
}
