import React, { useState } from 'react';
import { GraduationCap, MessageSquare, Eye, EyeOff, Info } from 'lucide-react';
import { frasesParticulasData, expresionesData } from '../data/practicas';

export default function PracticasSection() {
  const [tab, setTab] = useState<'particulas' | 'expresiones'>('particulas');
  const [modoOculto, setModoOculto] = useState<boolean>(false);
  const [revelados, setRevelados] = useState<Record<number, boolean>>({});
  const [filtroParticula, setFiltroParticula] = useState<string>('todas');

  const toggleRevelar = (id: number) => {
    setRevelados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const particulasUnicas = ['todas', ...Array.from(new Set(frasesParticulasData.map((f) => f.particula)))];

  const frasesFiltradas =
    filtroParticula === 'todas'
      ? frasesParticulasData
      : frasesParticulasData.filter((f) => f.particula === filtroParticula);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Cabecera y Pestañas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            Prácticas y Frases de Libros
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Basado en "Partículas de japonés" y "Nociones básicas"
          </p>
        </div>

        {/* Botón Modo Estudio / Autoevaluación */}
        <button
          onClick={() => {
            setModoOculto(!modoOculto);
            setRevelados({});
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition ${
            modoOculto
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {modoOculto ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {modoOculto ? 'Modo Quiz: Activo' : 'Activar Modo Quiz'}
        </button>
      </div>

      {/* Selector de Libro / Sección */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button
          onClick={() => setTab('particulas')}
          className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition ${
            tab === 'particulas'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Partículas en Contexto
        </button>
        <button
          onClick={() => setTab('expresiones')}
          className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition ${
            tab === 'expresiones'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Suplemento de Expresiones
        </button>
      </div>

      {/* CONTENIDO PESTAÑA 1: PARTÍCULAS */}
      {tab === 'particulas' && (
        <div>
          {/* Filtro por partícula */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
            {particulasUnicas.map((p) => (
              <button
                key={p}
                onClick={() => setFiltroParticula(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 ${
                  filtroParticula === p
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                }`}
              >
                {p === 'todas' ? 'Todas las partículas' : p}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {frasesFiltradas.map((frase) => {
              const mostrarTraduccion = !modoOculto || revelados[frase.id];

              return (
                <div
                  key={frase.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-sm">
                      Partícula: {frase.particula}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {frase.funcion}
                    </span>
                  </div>

                  <p className="text-2xl font-serif text-gray-900 mb-2">
                    {frase.japones}
                  </p>

                  {mostrarTraduccion ? (
                    <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-indigo-600 font-medium">
                        {frase.lectura} ({frase.romaji})
                      </p>
                      <p className="text-base font-semibold text-gray-800">
                        {frase.espanol}
                      </p>
                      <div className="bg-blue-50/70 text-blue-900 text-xs p-3 rounded-xl flex gap-2 items-start mt-2">
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <p>{frase.explicacion}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleRevelar(frase.id)}
                      className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg"
                    >
                      Mostrar lectura y traducción
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 2: EXPRESIONES */}
      {tab === 'expresiones' && (
        <div className="space-y-4">
          {expresionesData.map((exp) => {
            const mostrar = !modoOculto || revelados[exp.id + 1000];

            return (
              <div
                key={exp.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {exp.situacion}
                  </span>
                </div>

                <p className="text-2xl font-serif text-gray-900 mb-2">
                  {exp.japones}
                </p>

                {mostrar ? (
                  <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-indigo-600 font-medium">
                      {exp.lectura} • {exp.romaji}
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {exp.significadoNatural}
                    </p>
                    {exp.traduccionLiteral && (
                      <p className="text-xs text-gray-500 italic">
                        Literal: "{exp.traduccionLiteral}"
                      </p>
                    )}
                    <p className="text-xs bg-gray-50 text-gray-700 p-3 rounded-xl border border-gray-100">
                      <strong>Uso:</strong> {exp.notaUso}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleRevelar(exp.id + 1000)}
                    className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg"
                  >
                    Revelar significado y uso
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
