let movimientos = cargarMovimientos();
/* Agrega un nuevo movimiento
Clase 6 - Funciones con parametros
Clase 7 - Date.now() para Id unico
Clase 14 - Parametros con valor por defecto
 */
function agregarMovimiento(tipo, descripcion, monto, fecha, categoria = null, cuentaId = null) {
  const nuevoMovimiento = {
    id: Date.now(),
    tipo: tipo,
    descripcion: descripcion.trim(),
    monto: Number(monto),
    fecha: fecha,
    categoria: categoria,    // Se agrega categoria para relga 50/30/20
    cuentaId: cuentaId      //Para asociar con la cuenta bancaria
  };

  movimientos.push(nuevoMovimiento);
  guardarMovimientos(movimientos);
}

function eliminarMovimiento(id) {
  movimientos = movimientos.filter(function (movimiento) {
    return movimiento.id !== id;
  });

  guardarMovimientos(movimientos);
}

function obtenerMovimientos(tipo = "todos") {
  let resultado = movimientos;

  if (tipo !== "todos") {
    resultado = resultado.filter(function (movimiento) {
      return movimiento.tipo === tipo;
    });
  }

  return resultado.slice().sort(function (a, b) {
    return b.fecha.localeCompare(a.fecha);
  });
}
