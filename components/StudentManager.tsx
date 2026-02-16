
import React, { useState } from 'react';
import { Student, Subject } from '../types';
import { ICONS } from '../constants';
import { generateId } from '../utils';

interface Props {
  students: Student[];
  onAdd: (s: Student) => void;
  onRemove: (id: string) => void;
  subjects: Subject[];
  onAddSubject: (s: Subject) => void;
  onRemoveSubject: (id: string) => void;
}

const StudentManager: React.FC<Props> = ({ 
  students, onAdd, onRemove, subjects, onAddSubject, onRemoveSubject 
}) => {
  const [sName, setSName] = useState('');
  const [sGrade, setSGrade] = useState('');
  const [sSection, setSSection] = useState('');
  const [subName, setSubName] = useState('');

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName || !sGrade || !sSection) return;
    onAdd({
      id: generateId(),
      name: sName,
      grade: sGrade,
      section: sSection
    });
    setSName('');
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName) return;
    onAddSubject({
      id: generateId(),
      name: subName
    });
    setSubName('');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ICONS.Users /> Gestionar Estudiantes
        </h2>
        
        <form onSubmit={handleAddStudent} className="space-y-3 mb-6">
          <input 
            type="text" 
            placeholder="Nombre completo" 
            className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={sName}
            onChange={e => setSName(e.target.value)}
          />
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Grado" 
              className="w-1/2 p-2 border rounded shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={sGrade}
              onChange={e => setSGrade(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Sección" 
              className="w-1/2 p-2 border rounded shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={sSection}
              onChange={e => setSSection(e.target.value)}
            />
          </div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
            <ICONS.Plus /> Agregar Estudiante
          </button>
        </form>

        <div className="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
          {students.length === 0 && <p className="text-slate-400 text-center py-4">No hay estudiantes registrados.</p>}
          {students.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border group">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-slate-500">{s.grade}° {s.section}</p>
              </div>
              <button 
                onClick={() => onRemove(s.id)}
                className="text-red-400 hover:text-red-600 p-2"
              >
                <ICONS.Trash />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ICONS.Book /> Gestionar Áreas
        </h2>
        
        <form onSubmit={handleAddSubject} className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="Nombre del Área / Curso" 
            className="flex-1 p-2 border rounded shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={subName}
            onChange={e => setSubName(e.target.value)}
          />
          <button className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
            <ICONS.Plus />
          </button>
        </form>

        <div className="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
          {subjects.length === 0 && <p className="text-slate-400 text-center py-4">No hay áreas registradas.</p>}
          {subjects.map(sub => (
            <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border group">
              <span className="font-medium">{sub.name}</span>
              <button 
                onClick={() => onRemoveSubject(sub.id)}
                className="text-red-400 hover:text-red-600 p-2"
              >
                <ICONS.Trash />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentManager;
