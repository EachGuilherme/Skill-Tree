import { useEffect, useCallback } from 'react';
import { SkillTree } from './components/SkillTree';
import { useSkillStore } from './stores/skillStore';
import type { Skill } from './types';
import { allSkills } from './data/tiers';
import { SistemaLocks } from './modules/SistemaLocks';
import { SistemaSave } from './modules/SistemaSave';
import './styles/globals.css';

function App() {
  const { desbloquearSkill, setSkills, setTPAtual, setStat, skills, statsJogador, tpAtual } = useSkillStore();
  const sistemaSave = new SistemaSave();

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

    // ✅ Criar sistema com STATS, TP E ALL SKILLS ATUAIS
    const sistemaLocks = new SistemaLocks(statsJogador, tpAtual, skills);
    
    // ✅ Verificar se pode desbloquear
    const resultado = sistemaLocks.tentar_desbloquear(skill);
    
    if (resultado.sucesso) {
      // Desbloquear skill
      desbloquearSkill(skillId);
      
      // ✅ Atualizar TP no store
      const novoTP = tpAtual - skill.custoTP;
      setTPAtual(novoTP);
      
      // ✅ Salvar progresso
      const skillsDesbloqueadas = skills
        .filter(s => s.desbloqueada || s.id === skillId)
        .map(s => s.id);
      sistemaSave.salvarProgresso(statsJogador, novoTP, skillsDesbloqueadas);
      
      alert(resultado.mensagem);
    } else {
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
