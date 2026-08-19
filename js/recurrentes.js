// Creado por Mario Paredes
// Clase 7 - POO: Esta es una clase que representa un gasto recurrente o una suscripción periodica.
class GastoRecurrente {
  constructor(descripcion, monto, frecuencia, proximoVencimiento, id) {
    this.id = id || Date.now();
    this.descripcion = descripcion.trim(); // Clase 7: String.trim() quitamos espacios de más
    this.monto = Number(monto);
    this.frecuencia = frecuencia; // "semanal" | "mensual" | "anual"
    this.proximoVencimiento = proximoVencimiento; // formato AAAA-MM-DD
  }

  // Clase 6: función (método) que retorna un valor con return.
  // Calculamos cuántos días faltan (o pasaron) para el próximo vencimiento
  obtenerDiasRestantes() {
    const unDiaEnMs = 1000 * 60 * 60 * 24; // Clase 5: operadores aritméticos, usamos acá para obtener la cantidad de milisegundos en un día
    const hoy = new Date(); // Clase 7: clase Date, con new Date() obtenemos la fecha y hora actual
    const vencimiento = new Date(this.proximoVencimiento); // Clase 7: clase Date
    const diferenciaEnMs =  vencimiento - hoy; // La diferencia entre dos Date se obtiene en milisegundos.

    // Clase 7: Math.ceil redondea hacia arriba para contar el día en curso
    return Math.ceil(diferenciaEnMs / unDiaEnMs); //Retornamos la cantidad de días restantes (o pasados si es negativo) para el próximo vencimiento
  }

}

// Al cargar los recurrentes, instanciamos un nuevo objeto
// GastoRecurrente para poder usar sus métodos
let recurrentes = cargarRecurrentes().map(function (datos) {
  return new GastoRecurrente(datos.descripcion, datos.monto, datos.frecuencia, datos.proximoVencimiento, datos.id);
});

// Clase 6: función con parámetros que crea y guarda un nuevo gasto recurrente.
function agregarRecurrente(descripcion, monto, frecuencia, fecha) {
  const nuevoRecurrente = new GastoRecurrente(descripcion, monto, frecuencia, fecha);
  recurrentes.push(nuevoRecurrente); // Clase 14: push() agrega un elemento al final del array
  guardarRecurrentes(recurrentes);
}

// Clase 13: filter() arma un array nuevo sin el recurrente con el id que pasamos como parámetro, es decir, lo elimina del array
function eliminarRecurrente(id) {
recurrentes = recurrentes.filter(function (recurrente) {
    return recurrente.id !== id; // Operador de comparación estricta (Clase 11: !==)
  });

  guardarRecurrentes(recurrentes);
}

// Registra el pago como un gasto del historial y adelanta el vencimiento
function marcarComoPagado(id) {
  // Clase 13: find() ubica el primer recurrente que cumple la condición (o undefined)
  const recurrente = recurrentes.find(function (r) {
    return r.id === id;
  });

  if (!recurrente) {
    return;
  }

  agregarMovimiento("gasto", recurrente.descripcion, recurrente.monto, recurrente.proximoVencimiento);
  guardarRecurrentes(recurrentes);
}

function obtenerRecurrentes() {
  return recurrentes.slice().sort(function (a, b) {
    return a.proximoVencimiento.localeCompare(b.proximoVencimiento);
  });
}
