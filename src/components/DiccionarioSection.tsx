import React, { useState } from 'react';
import { Search, ArrowLeftRight, BookMarked, Volume2 } from 'lucide-react';
import { diccionarioData } from '../data/diccionario';

export default function DiccionarioSection() {
  const [query, setQuery] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');

  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const resultados = diccionarioData.filter((entrada) => {
    const q = normalizar(query.trim());
    const coincideCategoria =
      filtroCategoria === 'todos' || entrada.categoria === filtroCategoria;

    if (!q) return coincideCategoria;

    const coincideJp = entrada.japones.includes(query.trim());
    const coincideLectura = entrada.lectura.includes(query.trim());
    const coincideRomaji = normalizar(entrada.romaji).includes(q);
    const coincideEs = entrada.espanol.some((acepcion) =>
      normalizar(acepcion).includes(q)
    );

    return (
      coincideCategoria &&
      (coincideJp || coincideLectura || coincideRomaji || coincideEs)
    );
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-indigo-600" />
            Diccionario Español ↔ Japonés
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Busca en español, rōmaji, hiragana, katakana o kanji
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Búsqueda bidireccional
        </span>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-4">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: agua, mizu, みず, 水, comer, 食べる..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-base focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Filtros por categoría gramatical */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        {[
          { id: 'todos', label: 'Todos' },
          { id: 'sustantivo', label: 'Sustantivos' },
          { id: 'verbo', label: 'Verbos' },
          { id: 'adjetivo', label: 'Adjetivos' },
          { id: 'expresion', label: 'Expresiones' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFiltroCategoria(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
              filtroCategoria === cat.id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lista de resultados */}
      <div className="space-y-3">
        {resultados.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 transition shadow-sm"
          >
            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-serif font-bold text-gray-900">
                  {item.japones}
                </span>
                <span className="text-base text-indigo-600 font-medium">
                  {item.lectura}
                </span>
                <span className="text-sm text-gray-400">({item.romaji})</span>
              </div>

              <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                {item.categoria}
              </span>
            </div>

            <p className="text-lg font-medium text-gray-800 mb-3">
              {item.espanol.join(', ')}
            </p>

            {item.ejemplo && (
              <div className="bg-gray-50 rounded-xl p-3 text-sm border border-gray-100">
                <p className="font-medium text-gray-900">{item.ejemplo.jp}</p>
                <p className="text-xs text-gray-500 mb-1">{item.ejemplo.lectura}</p>
                <p className="text-gray-700">{item.ejemplo.es}</p>
              </div>
            )}
          </div>
        ))}

        {resultados.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-500">
            No hay resultados para "{query}".
          </div>
        )}
      </div>
    </div>
  );
}
