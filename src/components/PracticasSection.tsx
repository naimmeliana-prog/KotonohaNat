import { useState } from 'react';
import { GraduationCap, MessageSquare, Eye, EyeOff, Info } from 'lucide-react';
import { frasesParticulasData, expresionesData } from '../data/practicas';

export function PracticasSection() {
  const [tab, setTab] = useState<'particulas' | 'expresiones'>('particulas');
  const [modoOculto, setModoOculto] = useState<boolean>(false);
  const [revelados, setRevelados] = useState<Record<string, boolean>>({});
  const [filtroParticula, setFiltroParticula] = useState<string>('todas');

  const toggleRevelar = (key: string) => {
    setRevelados((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const particulasUnicas = [
    'todas',
    ...Array.from(new Set(frasesParticulasData.map((f) => f.particula))),
  ];

  const frasesFiltradas =
    filtroParticula === 'todas'
      ? frasesParticulasData
      : frasesParticulasData.filter((f) => f.particula === filtroParticula);

  return (
    <div className="space-y-6 pb-12">
      {/* Cabecera y Modo Quiz */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1A1D21] dark:text-[#F2EFE9] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#C9372C] dark:text-[#E04F44]" />
            Frases de Partículas y Expresiones
          </h2>
          <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] mt-1">
            Extraído de "Partículas de japonés" y "Nociones básicas"
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModoOculto(!modoOculto);
            setRevelados({});
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            modoOculto
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
              : 'bg-white dark:bg-[#191C22] border-[#DFD9CD] dark:border-[#2C323E] text-[#1A1D21] dark:text-[#F2EFE9] hover:border-[#C9372C]'
          }`}
        >
          {modoOculto ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {modoOculto ? 'Modo Quiz: Activo' : 'Activar Modo Quiz'}
        </button>
      </div>

      {/* Sub-pestañas */}
      <div className="inline-flex p-1 rounded-xl bg-[#ECE8DF] dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#2C323E]">
        <button
          type="button"
          onClick={() => setTab('particulas')}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition cursor-pointer ${
            tab === 'particulas'
              ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
              : 'text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
          }`}
        >
          Partículas en Contexto
        </button>
        <button
          type="button"
          onClick={() => setTab('expresiones')}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition cursor-pointer ${
            tab === 'expresiones'
              ? 'bg-white dark:bg-[#272D38] text-[#C9372C] dark:text-[#E04F44] shadow-xs'
              : 'text-[#5A606B] dark:text-[#9BA1AE] hover:text-[#1A1D21] dark:hover:text-[#F2EFE9]'
          }`}
        >
          Suplemento de Expresiones
        </button>
      </div>

      {/* PESTAÑA 1: PARTÍCULAS */}
      {tab === 'particulas' && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {particulasUnicas.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFiltroParticula(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 cursor-pointer ${
                  filtroParticula === p
                    ? 'bg-[#C9372C] dark:bg-[#D9463B] text-white border-[#C9372C]'
                    : 'bg-white dark:bg-[#191C22] text-[#5A606B] dark:text-[#9BA1AE] border-[#DFD9CD] dark:border-[#2C323E] hover:border-[#C9372C]'
                }`}
              >
                {p === 'todas' ? 'Todas las partículas' : p}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {frasesFiltradas.map((frase: any, idx: number) => {
              const cardKey = `part-${frase.id ?? idx}`;
              const mostrarTraduccion = !modoOculto || revelados[cardKey];
              const textoExplicacion = frase.explicacion || frase.contexto;
              const textoLectura = frase.lectura
                ? `${frase.lectura} (${frase.romaji})`
                : frase.romaji;

              return (
                <div
                  key={cardKey}
                  className="bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#2C323E] rounded-2xl p-5"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-[#C9372C]/10 text-[#C9372C] dark:text-[#E04F44] font-bold rounded-lg text-xs">
                      Partícula: {frase.particula}
                    </span>
                    {frase.funcion && (
                      <span className="text-xs text-[#5A606B] dark:text-[#9BA1AE] font-medium">
                        {frase.funcion}
                      </span>
                    )}
                  </div>

                  <p className="text-2xl font-serif text-[#1A1D21] dark:text-[#F2EFE9] mb-2">
                    {frase.japones}
                  </p>

                  {mostrarTraduccion ? (
                    <div className="space-y-2 mt-3 pt-3 border-t border-[#DFD9CD] dark:border-[#252A34]">
                      {textoLectura && (
                        <p className="text-sm text-[#C9372C] dark:text-[#E04F44] font-medium">
                          {textoLectura}
                        </p>
                      )}
                      <p className="text-base font-semibold text-[#1A1D21] dark:text-[#F2EFE9]">
                        {frase.espanol}
                      </p>
                      {textoExplicacion && (
                        <div className="bg-[#F7F5F0] dark:bg-[#111317] text-[#4A505A] dark:text-[#B3B8C4] text-xs p-3 rounded-xl flex gap-2 items-start mt-2">
                          <Info className="w-4 h-4 text-[#C9372C] dark:text-[#E04F44] shrink-0 mt-0.5" />
                          <p>{textoExplicacion}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleRevelar(cardKey)}
                      className="mt-2 text-xs font-semibold text-[#C9372C] dark:text-[#E04F44] bg-[#C9372C]/10 px-3 py-1.5 rounded-lg cursor-pointer"
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
      {/* PESTAÑA 2: EXPRESIONES */}
      {tab === 'expresiones' && (
        <div className="space-y-4">
          {expresionesData.map((exp: any, idx: number) => {
            const cardKey = `exp-${exp.id ?? idx}`;
            const mostrar = !modoOculto || revelados[cardKey];
            const etiquetaSituacion = exp.situacion || exp.categoria || 'Expresión';
            const textoLectura = exp.lectura
              ? `${exp.lectura} · ${exp.romaji}`
              : exp.romaji;
            const significado = exp.significadoNatural || exp.espanol;
            const textoUso = exp.notaUso || exp.contexto;

            return (
              <div
                key={cardKey}
                className="bg-white dark:bg-[#191C22] border border-[#DFD9CD] dark:border-[#2C323E] rounded-2xl p-5"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {etiquetaSituacion}
                  </span>
                </div>

                <p className="text-2xl font-serif text-[#1A1D21] dark:text-[#F2EFE9] mb-2">
                  {exp.japones}
                </p>

                {mostrar ? (
                  <div className="space-y-2 mt-3 pt-3 border-t border-[#DFD9CD] dark:border-[#252A34]">
                    {textoLectura && (
                      <p className="text-sm text-[#C9372C] dark:text-[#E04F44] font-medium">
                        {textoLectura}
                      </p>
                    )}
                    <p className="text-base font-bold text-[#1A1D21] dark:text-[#F2EFE9]">
                      {significado}
                    </p>
                    {exp.traduccionLiteral && (
                      <p className="text-xs text-[#5A606B] dark:text-[#9BA1AE] italic">
                        Literal: "{exp.traduccionLiteral}"
                      </p>
                    )}
                    {textoUso && (
                      <p className="text-xs bg-[#F7F5F0] dark:bg-[#111317] text-[#4A505A] dark:text-[#B3B8C4] p-3 rounded-xl">
                        <strong>Uso:</strong> {textoUso}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleRevelar(cardKey)}
                    className="mt-2 text-xs font-semibold text-[#C9372C] dark:text-[#E04F44] bg-[#C9372C]/10 px-3 py-1.5 rounded-lg cursor-pointer"
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
