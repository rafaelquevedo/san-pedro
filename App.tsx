
import React, { useState, useEffect } from 'react';
import { 
  Student, Subject, Activity, Grade, GradeValue, 
  PeriodType, AppSettings, AppState 
} from './types.ts';
import { DEFAULT_SETTINGS, ICONS } from './constants.tsx';
import StudentManager from './components/StudentManager.tsx';
import Gradebook from './components/Gradebook.tsx';
import SettingsView from './components/SettingsView.tsx';
import ReportView from './components/ReportView.tsx';
import LoginView from './components/LoginView.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'students' | 'gradebook' | 'reports' | 'settings'>('gradebook');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Cargar datos de LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('registro_docente_data');
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        setStudents(parsed.students || []);
        setSubjects(parsed.subjects || []);
        setActivities(parsed.activities || []);
        setGrades(parsed.grades || []);
        setSettings({ ...DEFAULT_SETTINGS, ...(parsed.settings || {}) });
      } catch (e) { console.error(e); }
    }
    
    // Check session auth
    const sessionAuth = sessionStorage.getItem('is_teacher_authenticated');
    if (sessionAuth === 'true') setIsAuthenticated(true);
  }, []);

  // Guardar datos en LocalStorage
  useEffect(() => {
    const data: AppState = { students, subjects, activities, grades, settings };
    localStorage.setItem('registro_docente_data', JSON.stringify(data));
  }, [students, subjects, activities, grades, settings]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('is_teacher_authenticated', 'true');
  };

  const handleLogout = () => {
    if (confirm('¿Cerrar sesión ahora?')) {
      setIsAuthenticated(false);
      sessionStorage.removeItem('is_teacher_authenticated');
    }
  };

  if (!isAuthenticated) {
    return <LoginView correctPassword={settings.password} onLogin={handleLogin} />;
  }

  const addStudent = (student: Student) => setStudents(prev => [...prev, student]);
  const removeStudent = (id: string) => setStudents(prev => prev.filter(s => s.id !== id));
  const addSubject = (subject: Subject) => setSubjects(prev => [...prev, subject]);
  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setActivities(prev => prev.filter(a => a.subjectId !== id));
  };
  const addActivity = (activity: Activity) => setActivities(prev => [...prev, activity]);
  const removeActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    setGrades(prev => prev.filter(g => g.activityId !== id));
  };
  const updateGrade = (studentId: string, activityId: string, value: GradeValue) => {
    setGrades(prev => {
      const existing = prev.findIndex(g => g.studentId === studentId && g.activityId === activityId);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { studentId, activityId, value };
        return next;
      }
      return [...prev, { studentId, activityId, value }];
    });
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 md:pl-64">
      {/* Sidebar para Escritorio */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-indigo-700 text-white p-4 shadow-lg z-50">
        <div className="flex items-center justify-between mb-8 px-2">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="bg-white p-1 rounded"><span className="text-indigo-700 font-black">R</span></div>
            Registro
          </h1>
        </div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('gradebook')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'gradebook' ? 'bg-indigo-600' : 'hover:bg-indigo-600/50'}`}><ICONS.Book /> Registro Auxiliar</button>
          <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'students' ? 'bg-indigo-600' : 'hover:bg-indigo-600/50'}`}><ICONS.Users /> Alumnos y Áreas</button>
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'reports' ? 'bg-indigo-600' : 'hover:bg-indigo-600/50'}`}><ICONS.Chart /> Reportes</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'settings' ? 'bg-indigo-600' : 'hover:bg-indigo-600/50'}`}><ICONS.Settings /> Ajustes</button>
        </nav>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-100 transition mt-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar Sesión
        </button>
      </aside>

      {/* Header para Móvil */}
      <header className="md:hidden bg-indigo-700 text-white p-4 sticky top-0 z-40 flex items-center justify-between shadow-md">
        <h1 className="text-lg font-bold">Registro Docente</h1>
        <button onClick={handleLogout} className="p-2 bg-white/10 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'students' && <StudentManager students={students} onAdd={addStudent} onRemove={removeStudent} subjects={subjects} onAddSubject={addSubject} onRemoveSubject={removeSubject} />}
        {activeTab === 'gradebook' && <Gradebook students={students} subjects={subjects} activities={activities} grades={grades} settings={settings} onAddActivity={addActivity} onRemoveActivity={removeActivity} onUpdateGrade={updateGrade} />}
        {activeTab === 'reports' && <ReportView students={students} subjects={subjects} activities={activities} grades={grades} settings={settings} />}
        {activeTab === 'settings' && <SettingsView settings={settings} onUpdate={setSettings} />}
      </main>

      {/* Barra de Navegación Inferior (Móvil) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('gradebook')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'gradebook' ? 'text-indigo-600' : 'text-slate-400'}`}><ICONS.Book /><span className="text-[10px]">Registro</span></button>
        <button onClick={() => setActiveTab('students')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'students' ? 'text-indigo-600' : 'text-slate-400'}`}><ICONS.Users /><span className="text-[10px]">Alumnos</span></button>
        <button onClick={() => setActiveTab('reports')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'reports' ? 'text-indigo-600' : 'text-slate-400'}`}><ICONS.Chart /><span className="text-[10px]">Reportes</span></button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`}><ICONS.Settings /><span className="text-[10px]">Ajustes</span></button>
      </nav>
    </div>
  );
};

export default App;
