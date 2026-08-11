let movimientos = cargarMovimientos();

function agregarMovimiento(tipo, descripcion, monto, fecha, categoria) {
  const nuevoMovimiento = {
    id: Date.now(),
    tipo: tipo,
    descripcion: descripcion.trim(),
    monto: Number(monto),
    fecha: fecha,
    categoria: categoria    // Se agrega categoria para relga 50/30/20
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
