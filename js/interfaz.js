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

// Renderiza la lista de activos o la de pasivos, según el tipo que le pasemos.
function renderizarListaPatrimonio(tipo, idLista, idMensajeVacio) {
  const lista = document.getElementById(idLista);
  const mensajeVacio = document.getElementById(idMensajeVacio);
  const plantilla = document.getElementById("plantilla-movimiento");
  const registros = obtenerRegistros(tipo);

  lista.innerHTML = "";
  mensajeVacio.hidden = registros.length > 0;

  registros.forEach(function (registro) {
    // Se copia la plantilla definida en index.html.
    const copia = plantilla.content.cloneNode(true);
    // Los activos suman y los pasivos restan.
    const signo = registro.tipo === "activo" ? "+" : "-";

    copia.querySelector(".descripcion-movimiento").textContent =
      registro.descripcion;
    copia.querySelector(".fecha-movimiento").textContent = formatearFecha(
      registro.fecha,
    );

    const campoMonto = copia.querySelector(".monto-movimiento");
    campoMonto.textContent = signo + formatearMoneda(registro.monto);
    campoMonto.classList.add(registro.tipo);

    copia
      .querySelector(".boton-eliminar")
      .addEventListener("click", function () {
        eliminarRegistro(registro.id);
        refrescarPantalla();
      });

    lista.appendChild(copia);
  });
}

// Patrimonio neto = todo lo que tenemos menos todo lo que debemos.
function renderizarPatrimonio() {
  const activos = obtenerRegistros("activo");
  const pasivos = obtenerRegistros("pasivo");

  // Con reduce() recorremos la lista y vamos sumando los montos.
  const totalActivos = activos.reduce(function (suma, registro) {
    return suma + registro.monto;
  }, 0);

  const totalPasivos = pasivos.reduce(function (suma, registro) {
    return suma + registro.monto;
  }, 0);

  const neto = totalActivos - totalPasivos;

  // Mostramos los totales en el DOM
  document.getElementById("patrimonio-activos").textContent =
    formatearMoneda(totalActivos);
  document.getElementById("patrimonio-pasivos").textContent =
    formatearMoneda(totalPasivos);

  const elementoNeto = document.getElementById("patrimonio-neto");
  elementoNeto.textContent = formatearMoneda(neto);

  // Si debemos más de lo que tenemos, el neto se muestra en rojo.
  elementoNeto.style.color =
    neto < 0 ? "var(--color-gasto)" : "var(--color-ingreso)";

  // Si no hay nada cargado, mostramos el mensaje vacío en lugar del resumen.
  const sinDatos = activos.length === 0 && pasivos.length === 0;
  document.getElementById("resumen-patrimonio").hidden = sinDatos;
  document.getElementById("sin-datos-patrimonio").hidden = !sinDatos;
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

/* ------------ Regla 50/30/20 (Renderizado) ----------- */
/* Calcula y muestra la regla 50/30/20 para el mes actual

Clase 2: (getElementById, textContent)
Clase 3: Operadores aritméticos (+, *, /) - Estructuras condicionales (if/else if)
Clase 4 :Operadores Logicos (&& , ||) 
Clase 5: Estructuras repetitivas (forEach, filter)
Clase 7: Clase Date (getMonth, getFullYear)/
Clase 11: Operadores de igualdad y desigualdad (===)
Clase 13: Clase Array (filter, reduce)
 */
function renderizarRegla() {
  //---Se Obtiene movimientos y fecha actual 
  const movs = obtenerMovimientos();                                          // Clase 6 - Llamamos a obtenerMovimientos()
  const ahora = new Date();                                                   // Clase 7 - new Date() crea un objeto con la fecha y hora actual
  const mes = ahora.getMonth();                                               // Clase 7 - getMonth() devuelve el mes (0=Enero, 11=Diciembre)
  const anio = ahora.getFullYear();                                           // Clase 7 - getFullYear() devuelve el año (4 dígitos)

  //---Se filtra los movimientos del mes actual 
  const movimientosMesActual = movs.filter((mov) => {                         // Clase 13 - filter() selecciona solo los movimientos del mes actual
    const fechaMov = new Date(mov.fecha);                                     // Clase 7 - Convertimos la fecha string a objeto Date
    return fechaMov.getMonth() === mes && fechaMov.getFullYear() === anio;    // Clase 4 - Operadores lógicos: comparamos mes Y año
  });

  //---Se calcula los totales de ingresos
  const totalIngresos = movimientosMesActual                          
    .filter((mov) => mov.tipo === "ingreso")                                  // Clase 13 - filter() solo ingresos
    .reduce((sum, mov) => sum + mov.monto, 0);                                // Clase 13 - reduce() suma todos los montos (0 es valor inicial)

  //--- Se inicializa contadores de gastos
  let gastosNecesidades = 0;                                                  // Clase 2 - Variables: declaramos e inicializamos en 0
  let gastosDeseos = 0;
  let gastosAhorro = 0;

  //--- Se clasifica gastos por categoria
  movimientosMesActual
    .filter((mov) => mov.tipo === "gasto") //Solo gastos
    .forEach((mov) => {                                                       // Clase 12 - forEach recorre cada gasto del mes
      const cat = mov.categoria || "ahorro";                                  // Clase 4 - Operador OR: si no tiene categoría, usa ahorro por defecto
      if (cat === "necesidad") {                                              // Clase 3 - if/else if: sumamos al contador correspondiente
        gastosNecesidades += mov.monto;
      } else if (cat === "deseo") {
        gastosDeseos += mov.monto;
      } else if(cat === "ahorro") {
        gastosAhorro += mov.monto; 
      }
    });

//--- Se calcula montos ideales segun 50/30/20 
  const neto = totalIngresos;
  const idealNecesidades = neto * 0.5;                                                // Clase 3 - Multiplicación: 50% = 0.5, 30% = 0.3, 20% = 0.2
  const idealDeseos = neto * 0.3;
  const idealAhorro = neto * 0.2;

  //--- Se actualiza el DOM 
  document.getElementById("regla-ingresos").textContent = formatearMoneda(neto);      // Clase 2 - getElementById y textContent para mostrar el ingreso neto

  actualizarTarjetaRegla("necesidades", gastosNecesidades, idealNecesidades);         // Clase 6 - Llamamos a la función auxiliar para cada tarjeta
  actualizarTarjetaRegla("deseos", gastosDeseos, idealDeseos);
  actualizarTarjetaRegla("ahorro", gastosAhorro, idealAhorro);

//--- Mostrar/ocultar mensaje de "sin datos" 
  const sinDatos = movimientosMesActual.length === 0;                                 // Clase 11: (===) Si no hay movimientos, mostramos el mensaje vacío
  document.getElementById("resumen-regla").hidden = sinDatos;                         //hidden: oculta o muestra elementos
  document.getElementById("sin-datos-regla").hidden = !sinDatos;
}

/* ----------- Actualizacion de una tarjeta individual de la relga 50/30/20 -------------*/
/* Actualiza una tarjeta específica (necesidades, deseos o ahorro)

 @param {string} tipo - "necesidades", "deseos" o "ahorro"
 @param {number} gastoActual - Monto real gastado en esa categoría
 @param {number} gastoIdeal - Monto ideal según la regla
 
Clase 6: Funciones con parámetros
Clase 8: DOM (getElementById, style, textContent)
Clase 7: Math.min() y Math.round()
Clase 4 :Operadores Logicos (&& , ||) 
Clase 3: Estructuras condicionales (if/else) - Operadores aritméticos (división, multiplicación)
 */
function actualizarTarjetaRegla(tipo, gastoActual, gastoIdeal) {

  const montoElemento = document.getElementById(`regla-${tipo}`);                 // Clase 8 - Obtenemos los elementos del DOM usando template strings
  const barraElemento = document.getElementById(`barra-${tipo}`);
  const porcentajeElemento = document.getElementById(`porcentaje-${tipo}`);

  montoElemento.textContent = formatearMoneda(gastoActual);                       // Clase 8 - Mostramos el monto real gastado

  //--- Se calcula el porcentaje 
  let porcentaje = 0;

  if(gastoIdeal > 0){                                                            // Clase 3 - if: evitamos división por cero (si el ideal es 0, porcentaje queda 0)
    porcentaje = Math.min((gastoActual / gastoIdeal) * 100, 100);                // Clase 3 - Fórmula: (gastoActual / gastoIdeal) * 100   // Clase 7 - Math.min() limita al 100% (para que la barra no se pase)
  }

  barraElemento.style.width = porcentaje + "%";                                  // Clase 8 - Actualizamos el ancho de la barra (style.width)
  porcentajeElemento.textContent = Math.round(porcentaje) + "%";                 // Clase 7 - Math.round() redondea al entero más cercano

  //--- Se cambia el color si se paso de 100% 
  if (porcentaje > 100) {                                                        // Clase 3 - if/else: si el porcentaje supera 100, color rojo (alerta)
    barraElemento.style.backgroundColor = "#c62828";
  } else {
    const colores = {                                                            // Clase 7 - Objeto literal con colores por categoría
      necesidades: "#2e7d32", //Verde
      deseos: "#f9a825",      //Amarillo
      ahorro: "#1565c0",      //Azul
    };

    barraElemento.style.backgroundColor =                                        // Clase 4 - ( || ) Asignamos el color correspondiente (si no existe, usa el color por defecto)
      colores[tipo] || "var(--color-primario)";
  }
}

/* ------------ Gestion de Cuentas Bancarias (Renderizado) ----------- */
/* Renderiza las cuentas bancarias agrupadas por entidad

Clase 6: Funciones (declaración, llamadas)
Clase 8: DOM (createElement, appendChild, innerHTML, className)
Clase 12: Plantillas de cadenas (`${}`)
Clase 14: for...of con Object.entries()
Clase 10: Eventos (addEventListener, click)
 */
function renderizarCuentas() {

  const lista = document.getElementById("lista-cuentas");                 // Clase 8 - Obtenemos el contenedor de la lista y el mensaje vacío
  const mensajeVacio = document.getElementById("sin-cuentas");

  const todas = obtenerCuentas();                                         // Clase 6 - Llamamos a funciones definidas en cuentas.js
  const movimientos = obtenerMovimientos();

  lista.innerHTML = "";                                                   // Clase 8 - Limpiamos el contenido previo
  mensajeVacio.hidden = todas.length > 0;                                 // Clase 8 - Ocultamos el mensaje vacío si hay cuentas

  if (todas.length === 0) return;                                         // Clase 4 - Si no hay cuentas, salimos de la función (return)

  const grupos = agruparCuentasPorEntidad();                              // Clase 6 - Agrupamos cuentas por entidad (función de cuentas.js)

  for (const [entidad, cuentasDeEntidad] of Object.entries(grupos)) {     // Clase 14 - for...of con Object.entries() para recorrer el objeto // Object.entries() convierte el objeto en array de pares [clave, valor]
  
    const grupoDiv = document.createElement("div");                       // Clase 8 - createElement() crea un nuevo elemento HTML
    grupoDiv.className = "grupo-entidad";                                 // Clase 8 - className asigna una clase CSS

    const titulo = document.createElement("h4");                          // Clase 8 - Creamos un <h4> con el nombre de la entidad
    titulo.textContent = entidad;
    grupoDiv.appendChild(titulo);                                         // Clase 8 - appendChild agrega el título al grupo

    const grid = document.createElement("div");                           // Clase 8 - Creamos un contenedor grid para las tarjetas
    grid.className = "grid-cuentas";

    grid.style.display = "grid";                                          // Clase 8 - style: aplicamos estilos en línea
    grid.style.gridTemplateColumns = "1fr 1fr";
    grid.style.gap = "1rem";

    cuentasDeEntidad.forEach(c => {                                        // Clase 5 - forEach recorre cada cuenta de la entidad
                                 
      const saldo = obtenerSaldoCuenta(c.id, movimientos);                 // Clase 6 - Calculamos el saldo actual de la cuenta
     
      const tarjeta = document.createElement("div");                       // Clase 8 - Creamos una tarjeta para la cuenta
      tarjeta.className = "tarjeta-cuenta";

      // Clase 12 - Plantilla de cadena para generar el HTML interno
      tarjeta.innerHTML = `                                     
        <span class="nombre-cuenta">${c.nombre}</span>
        <span class="entidad-cuenta">${c.entidad}</span>
        <span class="saldo-cuenta">${formatearMoneda(saldo)}</span>
        <div class="acciones-cuenta">
          <button class="boton-eliminar" data-id="${c.id}">Eliminar</button>
        </div>
      `;

      tarjeta.querySelector(".boton-eliminar").addEventListener("click", function() {       // Clase 10 - Evento click al botón "Eliminar"
        if (confirm(`¿Eliminar la cuenta "${c.nombre}"?`)) {                                // confirm() muestra un cuadro de diálogo con "Aceptar/Cancelar"
          eliminarCuenta(c.id);                                                             // Clase 6 - Llamamos a eliminarCuenta() (definida en cuentas.js)
          renderizarCuentas();                                                              // Clase 6 - Llamamos a renderizarCuentas() para actualizar la vista
        }
      });

      grid.appendChild(tarjeta);                                                            // Clase 8 - Agregamos la tarjeta al grid
    });

    grupoDiv.appendChild(grid);                                                             // Clase 8 - Agregamos el grid al grupo
    lista.appendChild(grupoDiv);                                                            // Clase 8 - Agregamos el grupo a la lista principal
  }
}



function refrescarPantalla() {
  renderizarLista("ingreso", "lista-ingresos", "sin-ingresos");
  renderizarLista("gasto", "lista-gastos", "sin-gastos");
  renderizarRecurrentes();
  renderizarHistorial();
  renderizarListaPatrimonio("activo", "lista-activos", "sin-activos");
  renderizarListaPatrimonio("pasivo", "lista-pasivos", "sin-pasivos");
  renderizarPatrimonio();
  renderizarRegla();                //Actualiza regla 50/30/20
  renderizarCuentas();              //Actualiza cuentas
}
