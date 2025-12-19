import { useEffect, useCallback, useMemo } from 'react';
import { SkillTree } from './components/SkillTree';
import { NotificationContainer } from './components/NotificationContainer';
import { useSkillStore } from './stores/skillStore';
import { useNotificationStore } from './stores/notificationStore';
import type { Skill, TierInfo } from './types';
import { allSkills, tiers } from './data';
import { SistemaLocks } from './modules/SistemaLocks';
import { SistemaTiers } from './modules/SistemaTiers';
import { SistemaSave } from './modules/SistemaSave';
import './styles/globals.css';

function App() {
  const { desbloquearSkill, setSkills, setTPAtual, setStat, skills, statsJogador, tpAtual } = useSkillStore();
  const { addNotification } = useNotificationStore();
  const sistemaSave = new SistemaSave();

  // 💯 Criar instância do SistemaTiers baseado nas skills atuais
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

  const handleSkillMouseDown = useCallback((skillId: string) => {
    // ✅ Buscar skill do store (state atual)
    const skill = skills?.find((s: Skill) => s.id === skillId);
    
    // ✅ Checa se skill existe
    if (!skill) {
      addNotification('❌ Habilidade não encontrada!', 'error');
      return;
    }

    // Se já está desbloqueada, apenas mostrar notificação
    if (skill.desbloqueada) {
      addNotification(`✅ ${skill.nome} - Já desbloqueada!`, 'info');
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
      
      // 🔔 Notificação de sucesso
      addNotification(`✅ ${skill.nome} desbloqueada!`, 'success');
    } else {
      // 🔔 Notificação de erro com motivo
      addNotification(`❌ ${skill.nome}: ${resultado.mensagem}`, 'error', 4000);
    }
  }, [skills, statsJogador, tpAtual, desbloquearSkill, setTPAtual, sistemaTiers, addNotification]);

  return (
    <div className="app">
      <NotificationContainer />
      <header className="app-header">
        <h1>⚔️ Skill Tree - Sistema de Progressão</h1>
      </header>
      <main className="app-main">
        <SkillTree onSkillMouseDown={handleSkillMouseDown} />
      </main>
    </div>
  );
}

export default App;
