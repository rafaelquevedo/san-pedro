
import React, { useState } from 'react';
import { AppSettings, PeriodType } from '../types';
import { ICONS } from '../constants';

interface Props {
  settings: AppSettings;
  onUpdate: (s: AppSettings) => void;
}

const SettingsView: React.FC<Props> = ({ settings, onUpdate }) => {
  const [newPass, setNewPass] = useState('');

  const handleWeightChange = (grade: keyof AppSettings['weights'], val: string) => {
    const num = parseFloat(val) || 0;
    onUpdate({
      ...settings,
      weights: {
        ...settings.weights,
        [grade]: num
      }
    });
  };

  const handlePeriodChange = (p: PeriodType) => {
    if (confirm(`¿Cambiar a ${p}s? Se mantendrán los datos actuales.`)) {
      onUpdate({ ...settings, periodType: p });
    }
  };

  const handleChangePassword = () => {
    if (newPass.length < 4) {
      alert('La clave debe tener al menos 4 caracteres.');
      return;
    }
    onUpdate({ ...settings, password: newPass });
    setNewPass('');
    alert('Clave actualizada correctamente.');
  };

  const exportData = () => {
    const data = localStorage.getItem('registro_docente_data');
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo_notas_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
          <ICONS.Lock /> Seguridad de Acceso
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nueva Clave de Acceso</label>
            <div className="flex gap-2">
              <input 
                type="password" 
                placeholder="Mínimo 4 dígitos"
                className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
              />
              <button 
                onClick={handleChangePassword}
                className="bg-slate-800 text-white px-6 rounded-xl font-bold hover:bg-slate-900 transition"
              >
                Actualizar
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic">Esta clave se solicitará cada vez que abras la aplicación en una nueva pestaña.</p>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
          <ICONS.Settings /> Configuración del Periodo
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handlePeriodChange(PeriodType.Bimestre)}
            className={`p-4 rounded-xl border-2 transition ${settings.periodType === PeriodType.Bimestre ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500'}`}
          >
            <div className="font-bold text-lg">Bimestres</div>
            <div className="text-[10px] uppercase opacity-60">4 Etapas</div>
          </button>
          <button 
            onClick={() => handlePeriodChange(PeriodType.Trimestre)}
            className={`p-4 rounded-xl border-2 transition ${settings.periodType === PeriodType.Trimestre ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500'}`}
          >
            <div className="font-bold text-lg">Trimestres</div>
            <div className="text-[10px] uppercase opacity-60">3 Etapas</div>
          </button>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Ponderación de Letras</h2>
        <div className="grid grid-cols-2 gap-4">
          {(['AD', 'A', 'B', 'C'] as const).map(grade => (
            <div key={grade} className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 uppercase">{grade}</label>
              <input 
                type="number"
                step="0.1"
                className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-bold text-center text-lg text-indigo-700"
                value={settings.weights[grade]}
                onChange={e => handleWeightChange(grade, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Administración de Datos</h2>
        <button 
          onClick={exportData}
          className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
        >
          DESCARGAR COPIA DE SEGURIDAD (.JSON)
        </button>
      </section>
    </div>
  );
};

export default SettingsView;
