import React, { useState } from 'react';
import { useZenith } from '../context/ZenithContext';
import { ActivityType, Activity, DayOfWeek } from '../types';
import { ListTodo, Plus, Edit, Trash2, Save, X, Clock, BarChart3, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Activities: React.FC = () => {
  const { state, addActivity, removeActivity, updateActivity } = useZenith();
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: '',
    type: 'study',
    duration: 1,
    priority: 'medium',
    description: '',
    preferredDays: []
  });

  const activityTypes: { value: ActivityType; label: string; color: string }[] = [
    { value: 'academic', label: 'Académica', color: 'bg-primary-100 text-primary-800' },
    { value: 'study', label: 'Estudio', color: 'bg-secondary-100 text-secondary-800' },
    { value: 'exercise', label: 'Ejercicio', color: 'bg-success-100 text-success-800' },
    { value: 'rest', label: 'Descanso', color: 'bg-accent-100 text-accent-800' },
    { value: 'social', label: 'Social', color: 'bg-warning-100 text-warning-800' },
    { value: 'personal', label: 'Personal', color: 'bg-neutral-100 text-neutral-800' },
    { value: 'other', label: 'Otra', color: 'bg-error-100 text-error-800' }
  ];

  const days: { value: DayOfWeek; label: string }[] = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miércoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sábado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const numValue = parseFloat(value);
      if (editingActivity) {
        setEditingActivity({
          ...editingActivity,
          [name]: numValue
        });
      } else {
        setNewActivity({
          ...newActivity,
          [name]: numValue
        });
      }
    } else {
      if (editingActivity) {
        setEditingActivity({
          ...editingActivity,
          [name]: value
        });
      } else {
        setNewActivity({
          ...newActivity,
          [name]: value
        });
      }
    }
  };
  
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const day = value as DayOfWeek;
    
    if (editingActivity) {
      const currentDays = editingActivity.preferredDays || [];
      const updatedDays = checked
        ? [...currentDays, day]
        : currentDays.filter(d => d !== day);
      
      setEditingActivity({
        ...editingActivity,
        preferredDays: updatedDays
      });
    } else {
      const currentDays = newActivity.preferredDays || [];
      const updatedDays = checked
        ? [...currentDays, day]
        : currentDays.filter(d => d !== day);
      
      setNewActivity({
        ...newActivity,
        preferredDays: updatedDays
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingActivity) {
      updateActivity(editingActivity);
      setEditingActivity(null);
    } else {
      if (newActivity.name && newActivity.type && newActivity.duration !== undefined) {
        addActivity({
          ...newActivity as Activity,
          id: uuidv4()
        });
        
        setNewActivity({
          name: '',
          type: 'study',
          duration: 1,
          priority: 'medium',
          description: '',
          preferredDays: []
        });
      }
    }
    
    setShowForm(false);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  const getActivityTypeLabel = (type: ActivityType): string => {
    return activityTypes.find(t => t.value === type)?.label || type;
  };

  const getActivityTypeColor = (type: ActivityType): string => {
    return activityTypes.find(t => t.value === type)?.color || '';
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-error-100 text-error-800';
      case 'medium': return 'bg-warning-100 text-warning-800';
      case 'low': return 'bg-success-100 text-success-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const activityGroups = activityTypes.map(type => ({
    type: type.value,
    label: type.label,
    activities: state.activities.filter(activity => activity.type === type.value)
  })).filter(group => group.activities.length > 0);

  const hasActivities = state.activities.length > 0;

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ListTodo size={24} className="text-primary-600" />
            <span>Actividades</span>
          </h1>
          <p className="text-neutral-600">Gestiona tus actividades para organizar tu tiempo libre</p>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Nueva Actividad</span>
        </button>
      </div>
      
      {state.timeBlocks.length === 0 && !showForm && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <div className="text-warning-600 mt-1">
            <AlertCircle size={20} />
          </div>
          <div>
            <h3 className="font-medium text-warning-800">Horario no configurado</h3>
            <p className="text-sm text-warning-700">
              Para obtener recomendaciones personalizadas, primero configura tu horario semanal en la sección de Horario.
            </p>
          </div>
        </div>
      )}
      
      {(showForm || editingActivity) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 slide-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editingActivity ? 'Editar Actividad' : 'Agregar Nueva Actividad'}
            </h2>
            <button 
              onClick={handleCancel}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editingActivity ? editingActivity.name : newActivity.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Estudiar Matemáticas"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
                  Tipo
                </label>
                <select
                  id="type"
                  name="type"
                  value={editingActivity ? editingActivity.type : newActivity.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-neutral-700 mb-1">
                  Duración (horas)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="0.5"
                  step="0.5"
                  value={editingActivity ? editingActivity.duration : newActivity.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-1">
                  Prioridad
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={editingActivity ? editingActivity.priority : newActivity.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                name="description"
                value={editingActivity && editingActivity.description ? editingActivity.description : newActivity.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Agrega detalles sobre esta actividad"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Días preferidos (opcional)
              </label>
              <div className="flex flex-wrap gap-3">
                {days.map(day => (
                  <label key={day.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="preferredDays"
                      value={day.value}
                      checked={
                        editingActivity
                          ? (editingActivity.preferredDays || []).includes(day.value)
                          : (newActivity.preferredDays || []).includes(day.value)
                      }
                      onChange={handleDayChange}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-600">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                <span>{editingActivity ? 'Actualizar' : 'Guardar'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
      
      {!hasActivities && !showForm ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ListTodo size={28} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tienes actividades</h3>
          <p className="text-neutral-600 mb-4 max-w-md mx-auto">
            Agrega actividades para distribuir en tus tiempos libres y mantener un balance entre estudio, ejercicio y descanso.
          </p>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Nueva Actividad</span>
          </button>
        </div>
      ) : (
        hasActivities && (
          <div className="space-y-8">
            {activityGroups.map(group => (
              <div key={group.type} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-md text-sm ${getActivityTypeColor(group.type)}`}>
                    {group.label}
                  </span>
                  <span className="text-neutral-600 text-sm">
                    ({group.activities.length} {group.activities.length === 1 ? 'actividad' : 'actividades'})
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.activities.map(activity => (
                    <div 
                      key={activity.id} 
                      className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{activity.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(activity.priority)}`}>
                          {getPriorityLabel(activity.priority)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-neutral-600 text-sm mb-2">
                        <Clock size={14} />
                        <span>{activity.duration} {activity.duration === 1 ? 'hora' : 'horas'}</span>
                      </div>
                      
                      {activity.description && (
                        <p className="text-sm text-neutral-600 mb-3">
                          {activity.description}
                        </p>
                      )}
                      
                      {activity.preferredDays && activity.preferredDays.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-neutral-500 mb-1">Días preferidos:</p>
                          <div className="flex flex-wrap gap-1">
                            {activity.preferredDays.map(day => (
                              <span key={day} className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full text-xs">
                                {day.substring(0, 3)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2 mt-2">
                        <button 
                          onClick={() => handleEdit(activity)}
                          className="p-1 text-neutral-500 hover:text-primary-600 transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => removeActivity(activity.id)}
                          className="p-1 text-neutral-500 hover:text-error-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}
      
      {hasActivities && (
        <div className="mt-8 bg-neutral-100 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary-600" />
            <span>Resumen de Actividades</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activityTypes.map(type => {
              const totalHours = state.activities
                .filter(a => a.type === type.value)
                .reduce((sum, a) => sum + a.duration, 0);
                
              if (totalHours === 0) return null;
              
              return (
                <div key={type.value} className="bg-white rounded-lg p-4 shadow-sm">
                  <span className={`px-2 py-1 rounded-md text-xs ${type.color}`}>
                    {type.label}
                  </span>
                  <p className="text-2xl font-bold mt-2">{totalHours} h</p>
                  <p className="text-neutral-500 text-sm">
                    {state.activities.filter(a => a.type === type.value).length} actividades
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;