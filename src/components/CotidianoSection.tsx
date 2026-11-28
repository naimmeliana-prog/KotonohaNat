import React, { useState } from 'react';
import { Hash, Clock, Calendar, AlertCircle } from 'lucide-react';
import {
  numerosData,
  horasData,
  diasSemanaData,
  mesesData,
  diasMesIrregularesData,
  ItemCotidiano
} from '../data/cotidiano';

export default function CotidianoSection() {
  const [subTab, setSubTab] = useState<'numeros' | 'horas' | 'calendario'>('numeros');

  const renderGrid = (items: ItemCotidiano[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl border bg-white transition ${
            item.irregular
              ? 'border-amber-300 bg-amber-50/30'
              : 'border-gray-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {item.espanol}
            </span>
            {item.irregular && (
              <span
                title="Lectura irregular o especial"
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800"
              >
                Irregular
              </span>
            )}
          </div>
          <p className="text-2xl font-serif font-bold text-gray-900 my-1">
            {item.japones}
          </p>
          <p className="text-sm font-medium text-indigo-600">{item.lectura}</p>
          <p className="text-xs text-gray-400">{item.romaji}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Cabecera */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Vocabulario Cotidiano</h2>
        <p className="text-sm text-gray-500 mt-1">
          Números, horas y calendario con aviso en las lecturas irregulares
        </p>
      </div>

      {/* Pestañas */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSubTab('numeros')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
            subTab === 'numeros'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
          }`}
        >
          <Hash className="w-4 h-4" />
          Números
        </button>

        <button
          onClick={() => setSubTab('horas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
            subTab === 'horas'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
          }`}
        >
          <Clock className="w-4 h-4" />
          Horas y Minutos
        </button>

        <button
          onClick={() => setSubTab('calendario')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
            subTab === 'calendario'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Días y Meses
        </button>
      </div>

      {/* Leyenda de irregulares */}
      <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl mb-6">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          Las tarjetas marcadas como <strong>Irregular</strong> cambian su pronunciación habitual (ej. 4 se lee <em>yo-ji</em> en lugar de <em>yon-ji</em>).
        </span>
      </div>

      {/* Contenido por pestaña */}
      {subTab === 'numeros' && renderGrid(numerosData)}

      {subTab === 'horas' && renderGrid(horasData)}

      {subTab === 'calendario' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Días de la semana</h3>
            {renderGrid(diasSemanaData)}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Meses del año</h3>
            {renderGrid(mesesData)}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Días del mes (Lecturas especiales más importantes)
            </h3>
            {renderGrid(diasMesIrregularesData)}
          </div>
        </div>
      )}
    </div>
  );
}
