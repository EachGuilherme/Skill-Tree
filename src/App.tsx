import { useEffect } from 'react';
import { SkillTree } from './components/SkillTree';
import { useSkillStore } from './stores/skillStore';
import type { Skill } from './types';
import skillsData from './data/skills.json';
import { SistemaLocks } from './modules/SistemaLocks';
import './styles/globals.css';

function App() {
  const { desbloquearSkill, setSkills } = useSkillStore();
  const sistemaLocks = new SistemaLocks({}, 100000);

  useEffect(() => {
    // Carregar dados iniciais
    const skills = skillsData as Skill[];
    if (skills && Array.isArray(skills)) {
      setSkills(skills);
    }
  }, [setSkills]);

   const handleSkillClick = (skillId: string) => {
  const skills = skillsData as Skill[];
  const skill = skills?.find((s: Skill) => s.id === skillId);
  
  // ✅ Checa se skill existe
  if (!skill) return;

  if (skill.desbloqueada) {
    alert(
      `✅ ${skill.nome}\n\n${skill.descricao}\n\nTier: ${skill.tier}\nCusto: ${skill.custoTP} TP`
    );
    return;
  }

  const resultado = sistemaLocks.tentar_desbloquear(skill);
  if (resultado.sucesso) {
    desbloquearSkill(skillId);
    alert(resultado.mensagem);
  } else {
    alert(`❌ Não pode desbloquear!\n\n${resultado.mensagem}`);
  }
};

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
