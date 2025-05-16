import React from 'react';
import { useZenith } from '../context/ZenithContext';
import { Brain, Lightbulb, Clock } from 'lucide-react';

const AIRecommendations: React.FC = () => {
  const { state, getTotalFreeTime, getActivityDuration } = useZenith();
  
  const getStudyRecommendations = () => {
    const studyHours = getActivityDuration('study');
    const academicHours = getActivityDuration('academic');
    const freeTime = getTotalFreeTime();
    
    if (freeTime < 10) {
      return [
        "Prioriza las materias más exigentes en tus momentos de mayor energía",
        "Usa la técnica Pomodoro (25min estudio/5min descanso) para maximizar la concentración",
        "Establece objetivos de estudio muy específicos para cada sesión"
      ];
    }
    
    if (studyHours < academicHours * 0.5) {
      return [
        "Aumenta tus horas de estudio. Se recomienda al menos 1 hora de estudio por cada 2 horas de clase",
        "Utiliza la técnica de repetición espaciada para mejorar la retención",
        "Programa sesiones de estudio inmediatamente después de las clases más complejas"
      ];
    }
    
    return [
      "Tu balance de estudio es adecuado. Mantén la consistencia",
      "Alterna entre diferentes técnicas de estudio para mantener el interés",
      "Considera formar grupos de estudio para las materias más exigentes"
    ];
  };
  
  const getTimeManagementTips = () => {
    const exerciseHours = getActivityDuration('exercise');
    const restHours = getActivityDuration('rest');
    const socialHours = getActivityDuration('social');
    
    const tips = [];
    
    if (exerciseHours < 3) {
      tips.push("Integra al menos 3 horas de ejercicio a la semana para mejorar tu concentración y bienestar");
    }
    
    if (restHours < 7) {
      tips.push("Programa más tiempo para descanso y ocio. Es crucial para mantener la productividad");
    }
    
    if (socialHours < 4) {
      tips.push("No subestimes la importancia de la interacción social para tu bienestar");
    }
    
    if (tips.length === 0) {
      tips.push("Tu distribución de tiempo entre actividades luce balanceada. ¡Buen trabajo!");
    }
    
    return tips;
  };
  
  const studyRecommendations = getStudyRecommendations();
  const timeManagementTips = getTimeManagementTips();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={24} className="text-primary-600" />
        <h2 className="text-xl font-semibold">Recomendaciones Inteligentes</h2>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium flex items-center gap-2 mb-3">
          <Lightbulb size={18} className="text-secondary-600" />
          <span>Técnicas de Estudio</span>
        </h3>
        
        <ul className="space-y-2">
          {studyRecommendations.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary-600 font-bold text-sm mt-1">•</span>
              <p className="text-neutral-700">{tip}</p>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-medium flex items-center gap-2 mb-3">
          <Clock size={18} className="text-accent-600" />
          <span>Gestión del Tiempo</span>
        </h3>
        
        <ul className="space-y-2">
          {timeManagementTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-accent-600 font-bold text-sm mt-1">•</span>
              <p className="text-neutral-700">{tip}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AIRecommendations;