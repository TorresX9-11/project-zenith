import React from 'react';
import { useZenith } from '../context/ZenithContext';
import { ActivityType } from '../types';
import { BarChart3, Lightbulb, Clock, Brain, TrendingUp, BookOpen, Timer, Users, Coffee, Dumbbell, Calendar } from 'lucide-react';
import TimeTable from '../components/TimeTable';

const Dashboard: React.FC = () => {
  const { 
    state, 
    calculateProductivity, 
    getActivityDuration, 
    getTotalFreeTime, 
    getTotalOccupiedTime 
  } = useZenith();
  
  const hasSchedule = state.timeBlocks.length > 0;
  const hasActivities = state.activities.length > 0;
  
  const studyHours = getActivityDuration('study');
  const academicHours = getActivityDuration('academic');
  const exerciseHours = getActivityDuration('exercise');
  const socialHours = getActivityDuration('social');
  const restHours = getActivityDuration('rest');
  const productivity = calculateProductivity();
  
  const studyTechniques = [
    {
      name: 'Técnica Pomodoro',
      icon: <Timer size={20} />,
      description: '25 minutos de estudio, 5 minutos de descanso.',
      active: state.settings.studyTechniques.pomodoro
    },
    {
      name: 'Técnica Feynman',
      icon: <Brain size={20} />,
      description: 'Explica los conceptos como si le enseñaras a alguien más.',
      active: state.settings.studyTechniques.feynman
    },
    {
      name: 'Repetición Espaciada',
      icon: <TrendingUp size={20} />,
      description: 'Revisa el material en intervalos crecientes de tiempo.',
      active: state.settings.studyTechniques.spaced
    },
    {
      name: 'Mapas Conceptuales',
      icon: <BookOpen size={20} />,
      description: 'Organiza visualmente los conceptos y sus relaciones.',
      active: state.settings.studyTechniques.conceptMapping
    }
  ];
  
  const getRecommendations = () => {
    if (!hasSchedule) {
      return [
        'Configura tu horario para obtener recomendaciones personalizadas.',
        'Agrega todas tus clases y compromisos fijos semanales.'
      ];
    }
    
    const recommendations = [];
    
    const freeTime = getTotalFreeTime();
    const occupiedTime = getTotalOccupiedTime();
    
    if (freeTime < 10) {
      recommendations.push('Tu agenda está muy ocupada. Considera reducir algunas actividades para evitar el agotamiento.');
    }
    
    if (studyHours < 10 && hasActivities) {
      recommendations.push('Se recomienda al menos 10 horas de estudio independiente por semana.');
    }
    
    if (exerciseHours < 3 && hasActivities) {
      recommendations.push('Intenta agregar al menos 3 horas de ejercicio a la semana para mantener un equilibrio saludable.');
    }
    
    if (restHours < 5 && hasActivities) {
      recommendations.push('Programa más tiempo para descanso y ocio. Es importante para mantener la productividad.');
    }
    
    if (academicHours > 25) {
      recommendations.push('Tienes muchas horas de clases. Organiza bien tu tiempo de estudio para cada materia.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('¡Tu distribución de tiempo luce bien equilibrada!');
    }
    
    return recommendations;
  };
  
  const recommendations = getRecommendations();
  
  const chartData = [
    { type: 'Académico' as ActivityType, hours: academicHours, color: 'bg-primary-600' },
    { type: 'Estudio' as ActivityType, hours: studyHours, color: 'bg-secondary-600' },
    { type: 'Ejercicio' as ActivityType, hours: exerciseHours, color: 'bg-success-600' },
    { type: 'Social' as ActivityType, hours: socialHours, color: 'bg-warning-600' },
    { type: 'Descanso' as ActivityType, hours: restHours, color: 'bg-accent-600' }
  ].filter(item => item.hours > 0);
  
  const maxHours = Math.max(...chartData.map(d => d.hours), 10); // Minimum scale of 10 hours
  
  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 size={24} className="text-primary-600" />
          <span>Dashboard</span>
        </h1>
        <p className="text-neutral-600">Visualiza y analiza tu distribución de tiempo</p>
      </div>
      
      {!hasSchedule && !hasActivities ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={28} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Sin datos suficientes</h3>
          <p className="text-neutral-600 mb-4 max-w-md mx-auto">
            Para visualizar estadísticas y recomendaciones, primero configura tu horario y agrega actividades.
          </p>
        </div>
      ) : (
        <>
          {/* Sección de horario */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar size={20} className="text-primary-600" />
                <span>Mi Horario Semanal</span>
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-neutral-500" />
                  <span className="text-sm text-neutral-600">
                    {getTotalOccupiedTime().toFixed(1)}h ocupadas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-success-500" />
                  <span className="text-sm text-success-600">
                    {getTotalFreeTime().toFixed(1)}h libres
                  </span>
                </div>
              </div>
            </div>
              <div className="mb-4">                  
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
                  <div className="p-2 bg-primary-100 text-primary-800 rounded-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary-600 rounded-full border-2 border-primary-200" />
                    <span className="text-xs">Académico</span>
                  </div>
                  <div className="p-2 bg-purple-100 text-purple-800 rounded-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-600 rounded-full border-2 border-purple-200" />
                    <span className="text-xs">Trabajo</span>
                  </div>
                  <div className="p-2 bg-secondary-100 text-secondary-800 rounded-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-secondary-600 rounded-full border-2 border-secondary-200" />
                    <span className="text-xs">Estudio</span>
                  </div>                  <div className="p-2 bg-success-100 text-success-800 rounded-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-success-200" />
                    <span className="text-xs">Ejercicio</span>
                  </div>
                  <div className="p-2 bg-warning-100 text-warning-800 rounded-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-600 rounded-full border-2 border-warning-200" />
                    <span className="text-xs">Social</span>
                  </div>
                  <div className="p-2 bg-accent-100 text-accent-800 rounded-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-accent-600 rounded-full border-2 border-accent-200" />
                    <span className="text-xs">Descanso</span>
                  </div>
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded-full border-2 border-emerald-200" />
                    <span className="text-xs">Libre</span>
                  </div>
              </div>
            </div>
              <TimeTable 
              timeBlocks={state.timeBlocks}
              startHour={5}
              endHour={22}
            />
          </div>

          {/* Estadísticas y gráficos existentes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <h2 className="text-lg font-semibold mb-4">Distribución de Tiempo Semanal</h2>
                
                <div className="space-y-4">
                  {chartData.map(item => (
                    <div key={item.type} className="flex items-center">
                      <span className="w-20 text-sm text-neutral-600">{item.type}</span>
                      <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden ml-2">
                        <div 
                          className={`h-full ${item.color} transition-all duration-1000 ease-out flex items-center pl-2`}
                          style={{ width: `${Math.max(5, (item.hours / maxHours) * 100)}%` }}
                        >
                          <span className="text-white text-xs font-medium">
                            {item.hours} h
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!hasActivities && hasSchedule && (
                  <p className="text-neutral-500 text-sm italic mt-4">
                    Agrega actividades para ver más datos en esta gráfica.
                  </p>
                )}
              </div>
            </div>
            
            <div className="col-span-1">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-md p-6 text-white h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  <span>Productividad Estimada</span>
                </h2>
                
                <div className="text-center my-auto">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
                      <div 
                        className="absolute inset-1 rounded-full bg-primary-700 flex items-center justify-center"
                        style={{ 
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + productivity/2}% 0%, 100% ${productivity}%, 100% 100%, 0% 100%, 0% ${productivity}%, ${50 - productivity/2}% 0%, 50% 0%)` 
                        }}
                      ></div>
                      <span className="text-4xl font-bold z-10">{productivity}%</span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-primary-100">
                    {productivity < 40 ? 'Baja productividad' : 
                     productivity < 70 ? 'Productividad moderada' : 
                     'Alta productividad'}
                  </p>
                </div>
                
                <p className="text-xs text-primary-200 mt-4">
                  *Basado en la distribución de actividades y tiempo dedicado a tareas productivas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb size={20} className="text-primary-600" />
                <span>Recomendaciones Personalizadas</span>
              </h2>
              
              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="text-accent-600 mt-0.5">
                      <Lightbulb size={18} />
                    </div>
                    <p className="text-neutral-700">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="col-span-1 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain size={20} className="text-primary-600" />
                <span>Técnicas de Estudio</span>
              </h2>
              
              <div className="space-y-3">
                {studyTechniques.map((technique, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${technique.active ? 'border-primary-300 bg-primary-50' : 'border-neutral-200 bg-neutral-50'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`${technique.active ? 'text-primary-600' : 'text-neutral-500'}`}>
                        {technique.icon}
                      </div>
                      <h3 className={`font-medium text-sm ${technique.active ? 'text-primary-700' : 'text-neutral-600'}`}>
                        {technique.name}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-600 ml-7">
                      {technique.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Balance de Actividades</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <BalanceCard 
                icon={<BookOpen size={20} className="text-primary-600" />}
                title="Académico"
                hours={academicHours + studyHours}
                percentage={Math.round(((academicHours + studyHours) / (academicHours + studyHours + exerciseHours + socialHours + restHours)) * 100) || 0}
                color="from-primary-500 to-primary-600"
              />
              
              <BalanceCard 
                icon={<Dumbbell size={20} className="text-success-600" />}
                title="Ejercicio"
                hours={exerciseHours}
                percentage={Math.round((exerciseHours / (academicHours + studyHours + exerciseHours + socialHours + restHours)) * 100) || 0}
                color="from-success-500 to-success-600"
              />
              
              <BalanceCard 
                icon={<Users size={20} className="text-warning-600" />}
                title="Social"
                hours={socialHours}
                percentage={Math.round((socialHours / (academicHours + studyHours + exerciseHours + socialHours + restHours)) * 100) || 0}
                color="from-warning-500 to-warning-600"
              />
              
              <BalanceCard 
                icon={<Coffee size={20} className="text-accent-600" />}
                title="Descanso"
                hours={restHours}
                percentage={Math.round((restHours / (academicHours + studyHours + exerciseHours + socialHours + restHours)) * 100) || 0}
                color="from-accent-500 to-accent-600"
              />
            </div>
          </div>
          
          <div className="bg-neutral-100 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Resumen de Tiempo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-neutral-700" />
                  <h3 className="font-medium text-neutral-800">Tiempo Ocupado</h3>
                </div>
                <p className="text-2xl font-bold">{getTotalOccupiedTime().toFixed(1)}h</p>
                <p className="text-neutral-500 text-sm">
                  {Math.round((getTotalOccupiedTime() / (24 * 7)) * 100)}% de la semana
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-neutral-700" />
                  <h3 className="font-medium text-neutral-800">Tiempo Libre</h3>
                </div>
                <p className="text-2xl font-bold">{getTotalFreeTime().toFixed(1)}h</p>
                <p className="text-neutral-500 text-sm">
                  {Math.round((getTotalFreeTime() / (24 * 7)) * 100)}% de la semana
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-neutral-700" />
                  <h3 className="font-medium text-neutral-800">Balance</h3>
                </div>
                <p className="text-2xl font-bold">
                  {getTotalOccupiedTime() > 50 ? 'Ocupado' : 'Equilibrado'}
                </p>
                <p className="text-neutral-500 text-sm">
                  {getTotalFreeTime() < 30 ? 'Considera liberar tiempo' : 'Buen balance de tiempo'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface BalanceCardProps {
  icon: React.ReactNode;
  title: string;
  hours: number;
  percentage: number;
  color: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ icon, title, hours, percentage, color }) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-2xl font-bold">{hours}h</p>
      </div>
      <div className="h-2 w-full bg-neutral-100">
        <div 
          className={`h-full bg-gradient-to-r ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="p-2 text-center text-xs text-neutral-500">
        {percentage}% del total
      </div>
    </div>
  );
};

export default Dashboard;