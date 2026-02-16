
import React, { useState } from 'react';
import { ICONS } from '../constants';

interface Props {
  correctPassword: string;
  onLogin: () => void;
}

const LoginView: React.FC<Props> = ({ correctPassword, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onLogin();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-indigo-700 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-8 animate-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <ICONS.Lock />
          </div>
          <h1 className="text-3xl font-black text-slate-800">Acceso Docente</h1>
          <p className="text-slate-500">Introduce tu clave para ingresar al registro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input 
              type="password" 
              inputMode="numeric"
              className={`w-full p-5 text-center text-3xl tracking-widest border-2 rounded-2xl outline-none transition-all ${error ? 'border-red-500 bg-red-50 animate-shake' : 'border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}`}
              placeholder="••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-500 text-center text-sm font-bold">Contraseña incorrecta</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition shadow-lg active:scale-[0.98]"
          >
            INGRESAR
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-xs text-slate-400">
            Clave inicial por defecto: <span className="font-bold">1234</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default LoginView;
