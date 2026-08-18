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

    agregarMovimiento(
      "ingreso",
      formularioIngreso.elements.descripcion.value,
      formularioIngreso.elements.monto.value,
      formularioIngreso.elements.fecha.value
    );

    formularioIngreso.reset();
    refrescarPantalla();
  });

  formularioGasto.addEventListener("submit", function (evento) {
    // Evita que el formulario recargue la página.
    evento.preventDefault();

    agregarMovimiento(
      "gasto",
      formularioGasto.elements.descripcion.value,
      formularioGasto.elements.monto.value,
      formularioGasto.elements.fecha.value,
      formularioGasto.elements.categoria.value    // Se agrega categoria para relga 50/30/20
    );

    formularioGasto.reset();
    refrescarPantalla();
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
  });
}
//Renderizado inicial
  refrescarPantalla();
  renderizarRegla();
  renderizarCuentas();
});
