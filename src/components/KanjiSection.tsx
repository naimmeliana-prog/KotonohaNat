import React, { useState } from 'react';
import { Search, X, BookOpen } from 'lucide-react';
import { kanjiData, KanjiItem } from '../data/kanji';

export function KanjiSection() {
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);
  const [search, setSearch] = useState<string>('');

  const filteredKanji = kanjiData.filter(
    (k) =>
      k.caracter.includes(search) ||
      k.significado.toLowerCase().includes(search.toLowerCase()) ||
      k.onyomi.some((o) => o.includes(search)) ||
      k.kunyomi.some((ku) => ku.includes(search))
  );
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Cabecera y Buscador */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Diccionario de Kanji
        </h2>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por significado, kanji o lectura..."
            className="border border-gray-200 rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-indigo-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cuadrícula de Kanjis */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4">
        {filteredKanji.map((kanji) => (
          <button
            key={kanji.id}
            onClick={() => setSelectedKanji(kanji)}
            className="p-4 border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition flex flex-col items-center bg-white"
          >
            <span className="text-4xl font-serif mb-2">{kanji.caracter}</span>
            <span className="text-sm font-medium text-gray-800 text-center">
              {kanji.significado}
            </span>
            <span className="text-xs text-gray-400 mt-1">{kanji.trazos} trazos</span>
          </button>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {filteredKanji.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron kanjis que coincidan con "{search}".
        </div>
      )}

      {/* Modal / Tarjeta de Detalle */}
      {selectedKanji && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => setSelectedKanji(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <span className="text-6xl font-serif text-gray-900">
                {selectedKanji.caracter}
              </span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedKanji.significado}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedKanji.trazos} trazos • Nivel {selectedKanji.nivel}
                </p>
              </div>
            </div>

            <div className="my-4 space-y-2 text-sm">
              <p>
                <strong className="text-red-600">On'yomi:</strong>{' '}
                {selectedKanji.onyomi.join('、 ') || '—'}
              </p>
              <p>
                <strong className="text-blue-600">Kun'yomi:</strong>{' '}
                {selectedKanji.kunyomi.join('、 ') || '—'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 text-sm mb-2">
                Palabras compuestas (Jukugo):
              </h4>
              <ul className="space-y-2">
                {selectedKanji.ejemplos.map((ej, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-50 p-2.5 rounded-xl flex justify-between items-center text-sm"
                  >
                    <span>
                      <strong className="text-gray-900">{ej.palabra}</strong>{' '}
                      <span className="text-gray-500">({ej.lectura})</span>
                    </span>
                    <span className="text-gray-700 font-medium">{ej.significado}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
