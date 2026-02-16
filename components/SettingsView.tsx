
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
      {/* Sección APK */}
      <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-t-4 border-green-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-500 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold italic">Convertir a archivo APK</h3>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          Para tener el archivo <b>.apk</b> e instalarlo como una aplicación nativa, sigue estos pasos:
        </p>
        <ol className="text-sm space-y-3 list-decimal ml-5 text-slate-400">
          <li>Sube esta app a tu hosting (Firebase) y copia la URL.</li>
          <li>Ingresa a <a href="https://www.pwabuilder.com" target="_blank" className="text-green-400 underline font-bold">PWABuilder.com</a>.</li>
          <li>Pega tu URL y presiona "Start".</li>
          <li>Descarga el paquete para <b>Android</b>.</li>
          <li>Te entregará un archivo APK listo para tu celular.</li>
        </ol>
      </section>

      {onInstall && (
        <section className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl flex flex-col items-center text-center gap-4">
          <h3 className="text-xl font-bold">Instalación Directa (PWA)</h3>
          <p className="text-sm opacity-90">Esta es la forma más rápida sin necesidad de archivos externos.</p>
          <button 
            onClick={onInstall}
            className="w-full bg-yellow-400 text-indigo-900 font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition"
          >
            INSTALAR AHORA
          </button>
        </section>
      )}

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
          <ICONS.Settings /> Configuración Académica
        </h2>
        <div className="flex gap-4">
          <button 
            onClick={() => handlePeriodChange(PeriodType.Bimestre)}
            className={`flex-1 p-4 rounded-xl border-2 transition text-center ${settings.periodType === PeriodType.Bimestre ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500'}`}
          >
            <div className="font-bold">Bimestres</div>
          </button>
          <button 
            onClick={() => handlePeriodChange(PeriodType.Trimestre)}
            className={`flex-1 p-4 rounded-xl border-2 transition text-center ${settings.periodType === PeriodType.Trimestre ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500'}`}
          >
            <div className="font-bold">Trimestres</div>
          </button>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Equivalencia de Notas</h2>
        <div className="grid grid-cols-2 gap-4">
          {(['AD', 'A', 'B', 'C'] as const).map(grade => (
            <div key={grade} className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 uppercase">{grade}</label>
              <input 
                type="number"
                step="0.1"
                className="p-3 border rounded-xl bg-slate-50 font-bold text-center"
                value={settings.weights[grade]}
                onChange={e => handleWeightChange(grade, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-4 text-slate-700">Exportación</h2>
        <button 
          onClick={exportData}
          className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar Respaldo JSON
        </button>
      </section>
    </div>
  );
};

export default SettingsView;
