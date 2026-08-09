function formatearMoneda(monto) {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0
  }).format(monto);
}

function formatearFecha(fecha) {
  const partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Muestra una sección y oculta las demás.
function mostrarPestana(nombrePestana) {
  document.querySelectorAll(".boton-pestana").forEach(function (boton) {
    boton.classList.toggle("activo", boton.dataset.tab === nombrePestana);
  });

  document.querySelectorAll(".panel-pestana").forEach(function (panel) {
    panel.classList.toggle("activo", panel.id === nombrePestana);
  });
}

function renderizarLista(tipo, idLista, idMensajeVacio) {
  const lista = document.getElementById(idLista);
  const mensajeVacio = document.getElementById(idMensajeVacio);
  const plantilla = document.getElementById("plantilla-movimiento");
  const movimientosDelTipo = obtenerMovimientos(tipo);

  lista.innerHTML = "";
  mensajeVacio.hidden = movimientosDelTipo.length > 0;

  movimientosDelTipo.forEach(function (movimiento) {
    // Se copia la plantilla definida en index.html.
    const copia = plantilla.content.cloneNode(true);
    // Usamos el operador ternario conn el operador de igualdad estricta === para determinar el signo del monto según el tipo de movimiento.
    const signo = movimiento.tipo === "ingreso" ? "+" : "-";

    copia.querySelector(".descripcion-movimiento").textContent = movimiento.descripcion;
    copia.querySelector(".fecha-movimiento").textContent = formatearFecha(movimiento.fecha);

    const campoMonto = copia.querySelector(".monto-movimiento");
    campoMonto.textContent = signo + formatearMoneda(movimiento.monto);
    campoMonto.classList.add(movimiento.tipo);

    copia.querySelector(".boton-eliminar").addEventListener("click", function () {
      eliminarMovimiento(movimiento.id);
      refrescarPantalla();
    });

    lista.appendChild(copia);
  });
}

function renderizarHistorial() {
  const movimientosHistorial = obtenerMovimientos();
  const tabla = document.getElementById("tabla-historial");
  const mensajeVacio = document.getElementById("sin-historial");
  const plantilla = document.getElementById("plantilla-fila-historial");

  tabla.innerHTML = "";
  mensajeVacio.hidden = movimientosHistorial.length > 0;

  movimientosHistorial.forEach(function (movimiento) {
    const copia = plantilla.content.cloneNode(true);
    const signo = movimiento.tipo === "ingreso" ? "+" : "-";

    copia.querySelector(".fecha-movimiento").textContent = formatearFecha(movimiento.fecha);
    copia.querySelector(".tipo-movimiento").textContent = movimiento.tipo === "ingreso" ? "Ingreso" : "Gasto";
    copia.querySelector(".descripcion-movimiento").textContent = movimiento.descripcion;

    const campoMonto = copia.querySelector(".monto-movimiento");
    campoMonto.textContent = signo + formatearMoneda(movimiento.monto);
    campoMonto.classList.add(movimiento.tipo);

    copia.querySelector(".boton-eliminar").addEventListener("click", function () {
      eliminarMovimiento(movimiento.id);
      refrescarPantalla();
    });

    tabla.appendChild(copia);
  });
}

function renderizarRecurrentes() {
  const lista = document.getElementById("lista-recurrentes");
  const mensajeVacio = document.getElementById("sin-recurrentes");
  const plantilla = document.getElementById("plantilla-recurrente");
  const listaRecurrentes = obtenerRecurrentes();

  lista.innerHTML = "";
  mensajeVacio.hidden = listaRecurrentes.length > 0;
  // Hacemos una copia de la plantilla definida en index.html y la llenamos con los datos de cada gasto recurrente
  listaRecurrentes.forEach(function (recurrente) {
    const copia = plantilla.content.cloneNode(true);
    const dias = recurrente.obtenerDiasRestantes();

    // Usamos el perador ternario y la plantilla de cadenas (``) para armar el texto del estado
    const textoEstado = dias < 0
      ? `Vencido hace ${Math.abs(dias)} día(s)`
      : `Vence en ${dias} día(s)`;

    copia.querySelector(".descripcion-movimiento").textContent = recurrente.descripcion;
    // Aplicamos toUpperCase()
    copia.querySelector(".frecuencia-movimiento").textContent = recurrente.frecuencia.toUpperCase();
    copia.querySelector(".fecha-movimiento").textContent = formatearFecha(recurrente.proximoVencimiento);
    copia.querySelector(".monto-movimiento").textContent = formatearMoneda(recurrente.monto);

    copia.querySelector(".estado-recurrente").textContent = textoEstado;

    copia.querySelector(".boton-pagar").addEventListener("click", function () {
      marcarComoPagado(recurrente.id);
      refrescarPantalla();
    });

    copia.querySelector(".boton-eliminar").addEventListener("click", function () {
      eliminarRecurrente(recurrente.id);
      refrescarPantalla();
    });

    lista.appendChild(copia);
  });
}

function refrescarPantalla() {
  renderizarLista("ingreso", "lista-ingresos", "sin-ingresos");
  renderizarLista("gasto", "lista-gastos", "sin-gastos");
  renderizarRecurrentes();
  renderizarHistorial();
}
