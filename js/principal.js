document.addEventListener("DOMContentLoaded", function () {
  const formularioIngreso = document.getElementById("form-ingreso");
  const formularioGasto = document.getElementById("form-gasto");
  const formularioRecurrente = document.getElementById("form-recurrente");
  const formularioActivo = document.getElementById("form-activo");
  const formularioPasivo = document.getElementById("form-pasivo");
  const formularioCuenta = document.getElementById("form-cuenta"); //Obtenemos el formulario de cuentas por su ID (Clase 8 - DOM)

  document.querySelectorAll(".boton-pestana").forEach(function (boton) {
    boton.addEventListener("click", function () {
      mostrarPestana(boton.dataset.tab);
      // Renderizar contenido dinámico al cambiar de pestaña
      const tab = boton.dataset.tab;
      if (tab === "regla") renderizarRegla();
      if (tab ==="cuentas") renderizarCuentas();    //Se agrega para gestion de cuentas
      console.log("Renderizando regla");
    });
  });

  formularioIngreso.addEventListener("submit", function (evento) {
    // Evita que el formulario recargue la página.
    evento.preventDefault();

    //Se obtiene el ID de la cuenta seleccionada
    const cuentaId = formularioIngreso.elements.cuenta.value;
    // Si es sin cuenta, enviar null
    const cuentaIdFinal = cuentaId ? Number(cuentaId) : null;

    agregarMovimiento(
      "ingreso",
      formularioIngreso.elements.descripcion.value,
      formularioIngreso.elements.monto.value,
      formularioIngreso.elements.fecha.value,
      null,                               // Los ingresos no tienen categoría para 50/30/20
      cuentaIdFinal                       //Se asocia a la cuenta
    );

    formularioIngreso.reset();
    refrescarPantalla();
    cargarCuentasEnSelectores();            //Se actualizan los selectores
  });

  formularioGasto.addEventListener("submit", function (evento) {
    // Evita que el formulario recargue la página.
    evento.preventDefault();

    //Se obtiene el ID de la cuenta seleccionada
    const cuentaId = formularioGasto.elements.cuenta.value;
    // Si es sin cuenta, enviar null
    const cuentaIdFinal = cuentaId ? Number(cuentaId) : null;

    agregarMovimiento(
      "gasto",
      formularioGasto.elements.descripcion.value,
      formularioGasto.elements.monto.value,
      formularioGasto.elements.fecha.value,
      formularioGasto.elements.categoria.value,    // Se agrega categoria para relga 50/30/20
      cuentaIdFinal                             //Se asocia la cuenta
    );

    formularioGasto.reset();
    refrescarPantalla();
    cargarCuentasEnSelectores();              //Se actualizan los selectores
  });

  formularioRecurrente.addEventListener("submit", function (evento) {
    // Evita que el formulario recargue la página.
    evento.preventDefault();

    agregarRecurrente(
      formularioRecurrente.elements.descripcion.value,
      formularioRecurrente.elements.monto.value,
      formularioRecurrente.elements.frecuencia.value,
      formularioRecurrente.elements.fecha.value
    );
    
    formularioRecurrente.reset();
    refrescarPantalla();

  });

    formularioActivo.addEventListener("submit", function (evento) {
    // Evita que el formulario recargue la página.
    evento.preventDefault();

    agregarRegistro(
      "activo",
      formularioActivo.elements.descripcion.value,
      formularioActivo.elements.monto.value,
      formularioActivo.elements.fecha.value
    );

    formularioActivo.reset();
    refrescarPantalla();
  });

  formularioPasivo.addEventListener("submit", function (evento) {
    // Evita que el formulario recargue la página.
    evento.preventDefault();

    agregarRegistro(
      "pasivo",
      formularioPasivo.elements.descripcion.value,
      formularioPasivo.elements.monto.value,
      formularioPasivo.elements.fecha.value
    );

    formularioPasivo.reset();
    refrescarPantalla();
  });

  /*---------Formulario de gestion de cuentas--------- */
if(formularioCuenta){                                           // Se verifica que el formulario exista en la página (Clase 4 - if)
  formularioCuenta.addEventListener("submit", function(evento){   //Se agrega un listener para el evento "submit" (Clase 10 - Eventos)
   
    evento.preventDefault();                                    //Evita que el formulario recargue la pagina (Clase 10 - Eventos)
    agregarCuenta(                                              //Se obtiene los valores de los campos usando elements[] (Clase 8 - DOM) y se llama a la funcion agregarCuenta() definida en cuenta.js (Clase 6 - Funciones)
      formularioCuenta.elements["cuenta-nombre"].value,
      formularioCuenta.elements["cuenta-entidad"].value,
      formularioCuenta.elements["cuenta-saldo"].value
    );
    formularioCuenta.reset();                                     // Se limpia los campos del formulario (Clase 8 - reset)
    renderizarCuentas();
    cargarCuentasEnSelectores();
  });
}
/*----Carga de cuentas en los selectores de los formularios
Llena dinamicamente los selectores de cuentas en los formularios de ingreso y gastos

Clase 2:(getElementById, innerHTML, createElement)
Clase 8:  Formularios (select, option) - DOM 
Clase 5: Estructuras repetitivas (forEach)
Clase 6: Funciones 
Clase 12: Plantillas de cadenas (`${}`)
Clase 13: Clase Array 
 */
function cargarCuentasEnSelectores() {
  //--- Se obtienen todas la cuentas
  const cuentas = obtenerCuentas();                                                     //Clase 6 - Se llama a obtenerCuentas() (definida en cuentas.js)
   console.log("🔍 Cuentas obtenidas:", cuentas);                                                                                     //retorna un array de objetos (cada objeto es una cuenta)
  //--- Selector de cuentas en el formulario de gastos
  const selectGasto = document.getElementById("gasto-cuenta");                           //Clase 2: getElementById() obtiene el elemento <select> del DOM  
  console.log("🔍 selectGasto:", selectGasto);                                                               
  if (selectGasto) {                                                                     // Clase 3 - if: verificamos que el elemento exista en la página
    //--- Se limpia opciones (conservar la primera opción "Sin cuenta")
    selectGasto.innerHTML = '<option value="">Sin cuenta (efectivo)</option>';           //Clase 2 - innerHTML: reemplazamos todo el contenido del <select> // Clase 12 - (`${}`) creamos la opción por defecto
    
    //--- Se agrega cada cuenta como opción
    cuentas.forEach(c => {                                                               //Clase 5 - forEach: recorremos el array de cuentas
      const option = document.createElement("option");                                   //createElement() crea un nuevo elemento <option>
      option.value = c.id;                                                              //Clase 8 - value: asignamos el ID de la cuenta como valor // c.id es un número (timestamp de Date.now())
      option.textContent = `${c.nombre} (${c.entidad})`;                                //Clase 7 - Accedemos a propiedades del objeto: c.nombre y c.entidad // Clase 12 - (`${}`) // Clase 2: textContent
      selectGasto.appendChild(option);                                                  //appendChild() agrega la opción al <select>
    });
  }

  //--- Selector de cuentas en el formulario de ingresos
  const selectIngreso = document.getElementById("ingreso-cuenta");                      //Clase 2 - getElementById() obtiene el <select> de ingresos
  console.log("🔍 selectIngreso:", selectIngreso);
  if (selectIngreso) {                                                                  //Clase 3 - if: verificamos que el elemento exista
    selectIngreso.innerHTML = '<option value="">Sin cuenta (efectivo)</option>';        //Clase 2 - innerHTML: opción por defecto "Sin cuenta"
    cuentas.forEach(c => {                                                              //Clase 5 - forEach: recorremos las cuentas nuevamente
      const option = document.createElement("option");                                //createElement() crea una nueva opción
      option.value = c.id;                                                             //value: ID de la cuenta como valor
      option.textContent = `${c.nombre} (${c.entidad})`;                              //Clase 2 - textContent // Clase 12 - (`${}`)
      selectIngreso.appendChild(option);                                               //appendChild() agrega al <select>
    });
  }
}

//Renderizado inicial
  refrescarPantalla();
  renderizarRegla();
  renderizarCuentas();
  cargarCuentasEnSelectores();
});
