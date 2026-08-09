// Creado por Mario Paredes
// Esta es una clase que representa un gasto recurrente o una suscripción periodica.
class GastoRecurrente {
  constructor(descripcion, monto, frecuencia, proximoVencimiento, id) {
    this.id = id || Date.now();
    this.descripcion = descripcion.trim(); // Con trim() quitamos espacios de más
    this.monto = Number(monto);
    this.frecuencia = frecuencia; // "semanal" | "mensual" | "anual"
    this.proximoVencimiento = proximoVencimiento; // formato AAAA-MM-DD
  }

  // Calculamos cuántos días faltan (o pasaron) para el próximo vencimiento
  obtenerDiasRestantes() {
    const unDiaEnMs = 1000 * 60 * 60 * 24; // Operadores aritméticos para obtener la cantidad de milisegundos en un día
    const hoy = new Date();
    const vencimiento = new Date(this.proximoVencimiento);
    const diferenciaEnMs =  vencimiento - hoy; // La diferencia entre dos Date se obtiene en milisegundos.

    // Clase Math: ceil redondea hacia arriba para contar el día en curso
    return Math.ceil(diferenciaEnMs / unDiaEnMs); //Retornamos la cantidad de días restantes (o pasados si es negativo) para el próximo vencimiento
  }

}

// Al cargar los recurrentes, instanciamos un nuevo objeto
// GastoRecurrente para poder usar sus métodos
let recurrentes = cargarRecurrentes().map(function (datos) {
  return new GastoRecurrente(datos.descripcion, datos.monto, datos.frecuencia, datos.proximoVencimiento, datos.id);
});

// Función con parámetros que crea y guarda un nuevo gasto recurrente.
function agregarRecurrente(descripcion, monto, frecuencia, fecha) {
  const nuevoRecurrente = new GastoRecurrente(descripcion, monto, frecuencia, fecha);
  recurrentes.push(nuevoRecurrente); // Con push() agregamos un elemento al final del array
  guardarRecurrentes(recurrentes);
}

// Con filter() eliminamos el recurrente con el id que pasamos como parámetro y guardamos la nueva lista
function eliminarRecurrente(id) {
recurrentes = recurrentes.filter(function (recurrente) {
    return recurrente.id !== id; // Operador de comparación estricta
  });

  guardarRecurrentes(recurrentes);
}

// Registra el pago como un gasto del historial y adelanta el vencimiento
function marcarComoPagado(id) {
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
