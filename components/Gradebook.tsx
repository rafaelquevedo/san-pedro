
import React, { useState, useMemo } from 'react';
import { 
  Student, Subject, Activity, Grade, GradeValue, 
  AppSettings, PeriodType 
} from '../types';
import { ICONS } from '../constants';

interface Props {
  students: Student[];
  subjects: Subject[];
  activities: Activity[];
  grades: Grade[];
  settings: AppSettings;
  onAddActivity: (a: Activity) => void;
  onRemoveActivity: (id: string) => void;
  onUpdateGrade: (sId: string, aId: string, val: GradeValue) => void;
}

const Gradebook: React.FC<Props> = ({
  students, subjects, activities, grades, settings,
  onAddActivity, onRemoveActivity, onUpdateGrade
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [newActivityName, setNewActivityName] = useState('');

  const numPeriods = settings.periodType === PeriodType.Bimestre ? 4 : 3;

  const filteredActivities = useMemo(() => {
    return activities.filter(a => a.subjectId === selectedSubjectId && a.periodIndex === selectedPeriod);
  }, [activities, selectedSubjectId, selectedPeriod]);

  const handleAddActivity = () => {
    if (!newActivityName || !selectedSubjectId) return;
    onAddActivity({
      id: crypto.randomUUID(),
      name: newActivityName,
      subjectId: selectedSubjectId,
      periodIndex: selectedPeriod,
      date: new Date().toISOString()
    });
    setNewActivityName('');
  };

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <ICONS.Book />
        <p className="mt-4 text-slate-600">Primero debes agregar al menos un área o curso.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Área / Curso</label>
          <select 
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            className="w-full p-3 bg-white border rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{settings.periodType}</label>
          <div className="flex gap-2">
            {Array.from({ length: numPeriods }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedPeriod(i)}
                className={`flex-1 md:w-20 px-4 py-3 rounded-xl border font-medium transition ${selectedPeriod === i ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {i + 1}°
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Bar */}
      <div className="bg-indigo-50 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input 
            type="text" 
            placeholder="Nombre de la nueva actividad (ej: Práctica 1)"
            className="w-full p-2 rounded-lg border border-indigo-200 outline-none"
            value={newActivityName}
            onChange={e => setNewActivityName(e.target.value)}
          />
        </div>
        <button 
          onClick={handleAddActivity}
          className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <ICONS.Plus /> Nueva Actividad
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase sticky left-0 bg-slate-50 z-10 w-48">Estudiante</th>
              {filteredActivities.map(a => (
                <th key={a.id} className="p-4 text-center text-xs font-bold text-slate-500 uppercase min-w-[100px] group relative">
                  <div className="flex flex-col items-center gap-1">
                    <span>{a.name}</span>
                    <button 
                      onClick={() => onRemoveActivity(a.id)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      <ICONS.Trash />
                    </button>
                  </div>
                </th>
              ))}
              {filteredActivities.length === 0 && <th className="p-4 text-slate-400 italic text-sm font-normal">No hay actividades creadas</th>}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={filteredActivities.length + 1} className="p-8 text-center text-slate-400">No hay estudiantes registrados para calificar.</td>
              </tr>
            )}
            {students.map(s => (
              <tr key={s.id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4 font-medium sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                  <div className="flex flex-col">
                    <span className="text-sm truncate max-w-[150px]">{s.name}</span>
                    <span className="text-[10px] text-slate-400">{s.grade}° {s.section}</span>
                  </div>
                </td>
                {filteredActivities.map(a => {
                  const grade = grades.find(g => g.studentId === s.id && g.activityId === a.id);
                  return (
                    <td key={a.id} className="p-2 text-center">
                      <select 
                        value={grade?.value || ''}
                        onChange={e => onUpdateGrade(s.id, a.id, e.target.value as GradeValue)}
                        className={`w-full p-2 border rounded-lg text-center font-bold outline-none focus:ring-2 focus:ring-indigo-500 ${
                          grade?.value === 'AD' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                          grade?.value === 'A' ? 'text-green-600 bg-green-50 border-green-200' :
                          grade?.value === 'B' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                          grade?.value === 'C' ? 'text-red-600 bg-red-50 border-red-200' : 'bg-white'
                        }`}
                      >
                        <option value=""></option>
                        <option value="AD">AD</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gradebook;
