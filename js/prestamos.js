// Clase 7: POO. class Prestamo modela un objeto con atributos y metodos,
// igual que la clase Cliente vista en Clase 8 (constructor y this).
class Prestamo {
  constructor(descripcion, montoTotal, fechaInicio, id, pagos) {
    this.id = id || Date.now();
    this.descripcion = descripcion.trim(); // Clase 7: metodo de String
    this.montoTotal = Number(montoTotal);
    this.fechaInicio = fechaInicio; // formato AAAA-MM-DD
    this.pagos = pagos || []; // Clase 7: Array para el historial de pagos
  }

  // Clase 6: funcion (metodo) que retorna un valor con return.
  // Clase 12: "for...of" para recorrer el array con un acumulador
  obtenerTotalPagado() {
    let total = 0;
    for (const pago of this.pagos) {
      total += pago.monto;
    }
    return total;
  }

  // Clase 6: return. Clase 7: Math.max evita mostrar saldo negativo
  // si en algun momento se pago de mas.
  obtenerSaldoPendiente() {
    return Math.max(this.montoTotal - this.obtenerTotalPagado(), 0);
  }

  // Clase 7: Con Math.round redondeamos el porcentaje a un numero entero.
  obtenerPorcentajePagado() {
    if (this.montoTotal === 0) {
      return 0;
    }
    return Math.round((this.obtenerTotalPagado() / this.montoTotal) * 100);
  }

  // Clase 4: operador &&: esta saldado solo si el saldo llego a 0 Y si ya se registro al menos un pago
  // (evita marcar como saldado un prestamo recien creado con monto 0).
  obtenerEstado() {
    const saldado = this.obtenerSaldoPendiente() === 0 && this.pagos.length > 0;
    if (saldado) {
      return "saldado";
    }

    // Clase 7: Date para comparar la fecha de inicio contra hoy.
    const unDiaEnMs = 1000 * 60 * 60 * 24;
    const dias = Math.floor((new Date() - new Date(this.fechaInicio)) / unDiaEnMs);

    // Clase 4: || -> se considera atrasado si paso mucho tiempo sin pagos
    // o si no se registro ningun pago todavia habiendo pasado mas de 30 dias.
    const sinPagosRecientes = dias > 30 && this.pagos.length === 0;
    return sinPagosRecientes || dias > 365 ? "atrasado" : "activo";
  }
}

// Clase 4: switch(variable)
function obtenerEtiquestaEstado(estado) {
  switch (estado) {
    case "saldado":
      return "Saldado";
    case "atrasado":
      return "Atrasado";
    default:
      return "Al dia";
  }
}
