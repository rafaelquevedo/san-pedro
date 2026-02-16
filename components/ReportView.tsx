
import React, { useState, useMemo } from 'react';
import { Student, Subject, Activity, Grade, AppSettings, PeriodType, GradeValue } from '../types.ts';
import { ICONS } from '../constants.tsx';
import { generateFeedback } from '../services/geminiService.ts';

interface Props {
  students: Student[];
  subjects: Subject[];
  activities: Activity[];
  grades: Grade[];
  settings: AppSettings;
}

const ReportView: React.FC<Props> = ({ students, subjects, activities, grades, settings }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string>('');

  const calculateAverage = (studentId: string, subjectId: string) => {
    const studentActivities = activities.filter(a => a.subjectId === subjectId);
    if (studentActivities.length === 0) return null;

    const studentGrades = grades.filter(g => 
      g.studentId === studentId && 
      studentActivities.some(a => a.id === g.activityId)
    );

    if (studentGrades.length === 0) return null;

    const totalPoints = studentGrades.reduce((acc, g) => acc + (settings.weights[g.value as keyof typeof settings.weights] || 0), 0);
    const avg = totalPoints / studentGrades.length;

    // Convert back to qualitative
    if (avg >= settings.weights.AD - 0.5) return 'AD';
    if (avg >= settings.weights.A - 0.5) return 'A';
    if (avg >= settings.weights.B - 0.5) return 'B';
    return 'C';
  };

  const currentReport = useMemo(() => {
    if (!selectedStudentId || !selectedSubjectId) return null;
    const student = students.find(s => s.id === selectedStudentId);
    const subject = subjects.find(sub => sub.id === selectedSubjectId);
    const subActivities = activities.filter(a => a.subjectId === selectedSubjectId);
    const subGrades = grades.filter(g => g.studentId === selectedStudentId && subActivities.some(a => a.id === g.activityId));
    
    return {
      student,
      subject,
      grades: subGrades.map(g => ({
        name: subActivities.find(a => a.id === g.activityId)?.name || 'Actividad',
        value: g.value
      })),
      average: calculateAverage(selectedStudentId, selectedSubjectId)
    };
  }, [selectedStudentId, selectedSubjectId, students, subjects, activities, grades, settings]);

  const handleAiFeedback = async () => {
    if (!currentReport) return;
    setLoadingAi(true);
    setAiFeedback('');
    try {
      const fb = await generateFeedback(
        currentReport.student?.name || 'Estudiante',
        currentReport.subject?.name || 'Curso',
        currentReport.grades
      );
      setAiFeedback(fb);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seleccionar Estudiante</label>
          <select 
            value={selectedStudentId}
            onChange={e => { setSelectedStudentId(e.target.value); setAiFeedback(''); }}
            className="w-full p-3 bg-white border rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccione...</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade}° {s.section})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seleccionar Área</label>
          <select 
            value={selectedSubjectId}
            onChange={e => { setSelectedSubjectId(e.target.value); setAiFeedback(''); }}
            className="w-full p-3 bg-white border rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccione...</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {currentReport && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-indigo-600 p-6 text-white">
            <h3 className="text-2xl font-bold">{currentReport.student?.name}</h3>
            <p className="opacity-80">{currentReport.student?.grade}° {currentReport.student?.section} - {currentReport.subject?.name}</p>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Desglose de Calificaciones</h4>
                <div className="space-y-3">
                  {currentReport.grades.length === 0 && <p className="text-slate-400 italic">No hay calificaciones registradas.</p>}
                  {currentReport.grades.map((g, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-700">{g.name}</span>
                      <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                        g.value === 'AD' ? 'bg-blue-100 text-blue-700' :
                        g.value === 'A' ? 'bg-green-100 text-green-700' :
                        g.value === 'B' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {g.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-2xl">
                <span className="text-indigo-600 font-bold text-xs uppercase mb-2">Promedio General</span>
                <div className={`text-6xl font-black mb-2 ${
                  currentReport.average === 'AD' ? 'text-blue-600' :
                  currentReport.average === 'A' ? 'text-green-600' :
                  currentReport.average === 'B' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {currentReport.average || '--'}
                </div>
                <p className="text-indigo-900/60 text-xs text-center">
                  Calculado basado en ponderados definidos en configuración.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Retroalimentación IA (Gemini)</h4>
                <button 
                  onClick={handleAiFeedback}
                  disabled={loadingAi || currentReport.grades.length === 0}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingAi ? 'Generando...' : 'Generar Comentario IA'}
                </button>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[100px] italic text-slate-600 leading-relaxed">
                {aiFeedback || (loadingAi ? 'La inteligencia artificial está analizando las notas...' : 'Haz clic en el botón para generar una retroalimentación automática.')}
              </div>
            </div>
          </div>
        </div>
      )}

      {!currentReport && (
        <div className="p-20 text-center text-slate-400 border-2 border-dashed rounded-2xl">
          Selecciona un estudiante y un área para ver el reporte detallado.
        </div>
      )}
    </div>
  );
};

export default ReportView;
