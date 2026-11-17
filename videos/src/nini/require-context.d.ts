// Tipos para require.context (lo provee el bundler de Remotion).
declare const require: {
  context(
    directorio: string,
    recursivo: boolean,
    filtro: RegExp,
  ): {
    keys(): string[];
    (ruta: string): unknown;
  };
};
