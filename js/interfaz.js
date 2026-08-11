function formatearMoneda(monto) {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
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

    copia.querySelector(".descripcion-movimiento").textContent =
      movimiento.descripcion;
    copia.querySelector(".fecha-movimiento").textContent = formatearFecha(
      movimiento.fecha,
    );

    const campoMonto = copia.querySelector(".monto-movimiento");
    campoMonto.textContent = signo + formatearMoneda(movimiento.monto);
    campoMonto.classList.add(movimiento.tipo);

    copia
      .querySelector(".boton-eliminar")
      .addEventListener("click", function () {
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

    copia.querySelector(".fecha-movimiento").textContent = formatearFecha(
      movimiento.fecha,
    );
    copia.querySelector(".tipo-movimiento").textContent =
      movimiento.tipo === "ingreso" ? "Ingreso" : "Gasto";
    copia.querySelector(".descripcion-movimiento").textContent =
      movimiento.descripcion;

    const campoMonto = copia.querySelector(".monto-movimiento");
    campoMonto.textContent = signo + formatearMoneda(movimiento.monto);
    campoMonto.classList.add(movimiento.tipo);

    copia
      .querySelector(".boton-eliminar")
      .addEventListener("click", function () {
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
    const textoEstado =
      dias < 0
        ? `Vencido hace ${Math.abs(dias)} día(s)`
        : `Vence en ${dias} día(s)`;

    copia.querySelector(".descripcion-movimiento").textContent =
      recurrente.descripcion;
    // Aplicamos toUpperCase()
    copia.querySelector(".frecuencia-movimiento").textContent =
      recurrente.frecuencia.toUpperCase();
    copia.querySelector(".fecha-movimiento").textContent = formatearFecha(
      recurrente.proximoVencimiento,
    );
    copia.querySelector(".monto-movimiento").textContent = formatearMoneda(
      recurrente.monto,
    );

    copia.querySelector(".estado-recurrente").textContent = textoEstado;

    copia.querySelector(".boton-pagar").addEventListener("click", function () {
      marcarComoPagado(recurrente.id);
      refrescarPantalla();
    });

    copia
      .querySelector(".boton-eliminar")
      .addEventListener("click", function () {
        eliminarRecurrente(recurrente.id);
        refrescarPantalla();
      });

    lista.appendChild(copia);
  });
}

// Regla 50/30/20
function renderizarRegla() {
  const movs = obtenerMovimientos();
  const ahora = new Date();
  const mes = ahora.getMonth();
  const anio = ahora.getFullYear();

  // Filtramos los movimientos del mes actual
  const movimientosMesActual = movs.filter((mov) => {
    const fechaMov = new Date(mov.fecha);
    return fechaMov.getMonth() === mes && fechaMov.getFullYear() === anio;
  });

  // Calculamos los totales de ingresos y gastos
  const totalIngresos = movimientosMesActual
    .filter((mov) => mov.tipo === "ingreso")
    .reduce((sum, mov) => sum + mov.monto, 0);

  //Sumamos gastos segun su categoria
  let gastosNecesidades = 0;
  let gastosDeseos = 0;
  let gastosAhorro = 0;

  movimientosMesActual
    .filter((mov) => mov.tipo === "gasto")
    .forEach((mov) => {
      const cat = mov.categoria || "ahorro";  // Si no tiene categoría, se considera como ahorro
      if (cat === "necesidad") {
        gastosNecesidades += mov.monto;
      } else if (cat === "deseo") {
        gastosDeseos += mov.monto;
      } else if(cat === "ahorro") {
        gastosAhorro += mov.monto; 
      }
    });

  const neto = totalIngresos;
  const idealNecesidades = neto * 0.5;
  const idealDeseos = neto * 0.3;
  const idealAhorro = neto * 0.2;

  //Mostrar en el DOM
  document.getElementById("regla-ingresos").textContent = formatearMoneda(neto);

  actualizarTarjetaRegla("necesidades", gastosNecesidades, idealNecesidades);
  actualizarTarjetaRegla("deseos", gastosDeseos, idealDeseos);
  actualizarTarjetaRegla("ahorro", gastosAhorro, idealAhorro);

  const sinDatos = movimientosMesActual.length === 0;
  document.getElementById("resumen-regla").hidden = sinDatos;
  document.getElementById("sin-datos-regla").hidden = !sinDatos;
}

function actualizarTarjetaRegla(tipo, gastoActual, gastoIdeal) {
  const montoElemento = document.getElementById(`regla-${tipo}`);
  const barraElemento = document.getElementById(`barra-${tipo}`);
  const porcentajeElemento = document.getElementById(`porcentaje-${tipo}`);

  montoElemento.textContent = formatearMoneda(gastoActual);

  let porcentaje = Math.min((gastoActual / gastoIdeal) * 100, 100);
  barraElemento.style.width = porcentaje + "%";
  porcentajeElemento.textContent = Math.round(porcentaje) + "%";

  //Cambiamos el color si se paso de 100%
  if (porcentaje > 100) {
    barraElemento.style.backgroundColor = "#c62828";
  } else {
    const colores = {
      necesidades: "#2e7d32",
      deseos: "#f9a825",
      ahorro: "#1565c0",
    };
    barraElemento.style.backgroundColor =
      colores[tipo] || "var(--color-primario)";
  }
}

function refrescarPantalla() {
  renderizarLista("ingreso", "lista-ingresos", "sin-ingresos");
  renderizarLista("gasto", "lista-gastos", "sin-gastos");
  renderizarRecurrentes();
  renderizarHistorial();
  renderizarRegla();
}
