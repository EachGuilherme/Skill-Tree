import { useEffect, useCallback } from 'react';
import { SkillTree } from './components/SkillTree';
import { useSkillStore } from './stores/skillStore';
import type { Skill } from './types';
import skillsData from './data/skills.json';
import { SistemaLocks } from './modules/SistemaLocks';
import './styles/globals.css';

function App() {
  const { desbloquearSkill, setSkills, setTPAtual, skills, statsJogador, tpAtual } = useSkillStore();

  useEffect(() => {
    // Carregar dados iniciais
    const loadedSkills = skillsData as Skill[];
    if (loadedSkills && Array.isArray(loadedSkills)) {
      setSkills(loadedSkills);
    }
  }, [setSkills]);

  const handleSkillClick = useCallback((skillId: string) => {
    // ✅ Buscar skill do store (state atual)
    const skill = skills?.find((s: Skill) => s.id === skillId);
    
    // ✅ Checa se skill existe
    if (!skill) {
      alert('❌ Habilidade não encontrada!');
      return;
    }

    // DEBUG: Log do clique
    console.log('\n🔍 DEBUG CLICK:', {
      skillId,
      skillNome: skill.nome,
      desbloqueada: skill.desbloqueada,
      custoTP: skill.custoTP,
      custoStats: skill.custoStats,
      prereqSkills: skill.prereqSkills,
      tpAtual,
      statsJogador,
      skillsCount: skills.length
    });

    // Se já está desbloqueada, apenas mostrar info
    if (skill.desbloqueada) {
      alert(
        `✅ ${skill.nome}\n\n${skill.descricao}\n\nTier: ${skill.tier}\nCusto: ${skill.custoTP} TP`
      );
      return;
    }

    // ✅ Criar sistema com STATS, TP E ALL SKILLS ATUAIS
    const sistemaLocks = new SistemaLocks(statsJogador, tpAtual, skills);
    
    // DEBUG: Log do sistema
    console.log('SistemaLocks verificando:', {
      podePegar: sistemaLocks.podePegar(skill),
      motivo: sistemaLocks.getMotivoTranca(skill)
    });
    
    // ✅ Verificar se pode desbloquear
    const resultado = sistemaLocks.tentar_desbloquear(skill);
    
    console.log('Resultado desbloqueio:', resultado);
    
    if (resultado.sucesso) {
      // Desbloquear skill
      desbloquearSkill(skillId);
      
      // ✅ Atualizar TP no store
      const novoTP = tpAtual - skill.custoTP;
      setTPAtual(novoTP);
      
      console.log('✅ Skill desbloqueada! Novo TP:', novoTP);
      alert(resultado.mensagem);
    } else {
      console.log('❌ Não pode desbloquear:', resultado.mensagem);
      alert(`❌ Não pode desbloquear!\n\n${resultado.mensagem}`);
    }
  }, [skills, statsJogador, tpAtual, desbloquearSkill, setTPAtual]);

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
