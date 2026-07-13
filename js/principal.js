document.addEventListener("DOMContentLoaded", function () {
  const formularioIngreso = document.getElementById("form-ingreso");
  const formularioGasto = document.getElementById("form-gasto");

  document.querySelectorAll(".boton-pestana").forEach(function (boton) {
    boton.addEventListener("click", function () {
      mostrarPestana(boton.dataset.tab);
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
      formularioGasto.elements.fecha.value
    );

    formularioGasto.reset();
    refrescarPantalla();
  });

  refrescarPantalla();
});
