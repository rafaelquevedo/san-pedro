
import React from 'react';
import { AppSettings, PeriodType } from '../types';
import { ICONS } from '../constants';

interface Props {
  settings: AppSettings;
  onUpdate: (s: AppSettings) => void;
  onInstall?: () => void;
}

const SettingsView: React.FC<Props> = ({ settings, onUpdate, onInstall }) => {
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
      {onInstall && (
        <section className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-2xl shadow-xl flex flex-col items-center text-center gap-4 border-4 border-white/20">
          <div className="bg-white/20 p-3 rounded-full animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold">Instalar en tu Celular</h3>
            <p className="text-sm opacity-90">Accede directamente desde tu pantalla de inicio sin usar el navegador.</p>
          </div>
          <button 
            onClick={onInstall}
            className="w-full bg-yellow-400 text-indigo-900 font-black py-4 rounded-xl shadow-lg hover:bg-yellow-300 transition transform active:scale-95"
          >
            INSTALAR AHORA
          </button>
        </section>
      )}

      {!onInstall && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-center">
          <div className="text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-blue-700">
            Si ya instalaste la app, no verás el botón de instalación. Para ver cambios nuevos, cierra y abre la app.
          </p>
        </div>
      )}

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
        <p className="text-sm text-slate-500 mb-6">Asigna el valor numérico para calcular promedios automáticos.</p>
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
        <div className="space-y-3">
          <button 
            onClick={exportData}
            className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            DESCARGAR COPIA DE SEGURIDAD (.JSON)
          </button>
          
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <h4 className="text-yellow-800 font-bold text-sm mb-1">Nota sobre Hosting:</h4>
            <p className="text-xs text-yellow-700">
              Para ver la aplicación en tu celular, recuerda activar <b>GitHub Pages</b> en los ajustes de tu repositorio de GitHub. Una vez activado, abre el link en Chrome y usa "Añadir a pantalla de inicio".
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
