import { useEffect, useCallback, useMemo } from 'react';
import { SkillTree } from './components/SkillTree';
import { useSkillStore } from './stores/skillStore';
import type { Skill, TierInfo } from './types';
import { allSkills, tiers } from './data';
import { SistemaLocks } from './modules/SistemaLocks';
import { SistemaTiers } from './modules/SistemaTiers';
import { SistemaSave } from './modules/SistemaSave';
import './styles/globals.css';

function App() {
  const { desbloquearSkill, setSkills, setTPAtual, setStat, skills, statsJogador, tpAtual } = useSkillStore();
  const sistemaSave = new SistemaSave();

  // 💯 Criar instãncia do SistemaTiers baseado nas skills atuais
  const sistemaTiers = useMemo(() => {
    if (!skills || skills.length === 0) {
      return new SistemaTiers([], tiers as TierInfo[]);
    }
    return new SistemaTiers(skills, tiers as TierInfo[]);
  }, [skills]);

  // 💯 Carregar as skills desbloqueadas no sistema de tiers
  useEffect(() => {
    if (skills && skills.length > 0) {
      const skillsDesbloqueadas = skills
        .filter(s => s.desbloqueada)
        .map(s => s.id);
      sistemaTiers.carregarSkillsDesbloqueadas(skillsDesbloqueadas);
    }
  }, [skills]);

  useEffect(() => {
    // Carregar dados iniciais
    if (allSkills && Array.isArray(allSkills)) {
      setSkills(allSkills);
    }

    // ✅ Carregador save
    const save = sistemaSave.carregarProgresso();
    if (save) {
      // Restaurar stats
      Object.entries(save.stats).forEach(([stat, valor]) => {
        setStat(stat, valor);
      });

      // Restaurar TP
      setTPAtual(save.tpAtual);

      // Restaurar skills desbloqueadas
      const skillsComDesbloqueadas = allSkills.map(s => ({
        ...s,
        desbloqueada: save.skillsDesbloqueadas.includes(s.id)
      }));
      setSkills(skillsComDesbloqueadas);
    }
  }, []);

  const handleSkillClick = useCallback((skillId: string) => {
    // ✅ Buscar skill do store (state atual)
    const skill = skills?.find((s: Skill) => s.id === skillId);
    
    // ✅ Checa se skill existe
    if (!skill) {
      alert('❌ Habilidade não encontrada!');
      return;
    }

    // Se já está desbloqueada, apenas mostrar info
    if (skill.desbloqueada) {
      alert(
        `✅ ${skill.nome}\n\n${skill.descricao}\n\nTier: ${skill.tier}\nCusto: ${skill.custoTP} TP`
      );
      return;
    }

    // 💯 Atualizar sistema de tiers com skills desbloqueadas
    const skillsDesbloqueadas = skills
      .filter(s => s.desbloqueada)
      .map(s => s.id);
    sistemaTiers.carregarSkillsDesbloqueadas(skillsDesbloqueadas);

    // ✅ Criar sistema com STATS, TP, ALL SKILLS E SISTEMA DE TIERS
    const sistemaLocks = new SistemaLocks(statsJogador, tpAtual, skills, sistemaTiers);
    
    // ✅ Verificar se pode desbloquear
    const resultado = sistemaLocks.tentar_desbloquear(skill);
    
    if (resultado.sucesso) {
      // Desbloquear skill
      desbloquearSkill(skillId);
      
      // ✅ Atualizar TP no store
      const novoTP = tpAtual - skill.custoTP;
      setTPAtual(novoTP);
      
      // ✅ Salvar progresso
      const skillsDesbloqueadasAtualizadas = skills
        .filter(s => s.desbloqueada || s.id === skillId)
        .map(s => s.id);
      sistemaSave.salvarProgresso(statsJogador, novoTP, skillsDesbloqueadasAtualizadas);
      
      alert(resultado.mensagem);
    } else {
      alert(`❌ Não pode desbloquear!\n\n${resultado.mensagem}`);
    }
  }, [skills, statsJogador, tpAtual, desbloquearSkill, setTPAtual, sistemaTiers]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔️ Skill Tree - Sistema de Progressão</h1>
      </header>
      <main className="app-main">
        <SkillTree onSkillClick={handleSkillClick} />
      </main>
    </div>
  );
}

export default App;
