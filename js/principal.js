document.addEventListener("DOMContentLoaded", function () {
  const formularioIngreso = document.getElementById("form-ingreso");
  const formularioGasto = document.getElementById("form-gasto");
  const formularioRecurrente = document.getElementById("form-recurrente");

  document.querySelectorAll(".boton-pestana").forEach(function (boton) {
    boton.addEventListener("click", function () {
      mostrarPestana(boton.dataset.tab);
      // Renderizar contenido dinámico al cambiar de pestaña
      const tab = boton.dataset.tab;
      if (tab === "regla") renderizarRegla();
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

  refrescarPantalla();
  renderizarRegla();
});
