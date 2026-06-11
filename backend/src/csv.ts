// arma un texto CSV separado por punto y coma (lo abre bien Excel)
export function armarCsv(cabeceras: string[], filas: (string | number)[][]) {
  const lineas = [cabeceras.join(';')];
  for (const fila of filas) {
    const celdas = fila.map((v) => {
      const texto = String(v ?? '');
      return texto.includes(';') || texto.includes('"')
        ? '"' + texto.replace(/"/g, '""') + '"'
        : texto;
    });
    lineas.push(celdas.join(';'));
  }
  return lineas.join('\r\n');
}
