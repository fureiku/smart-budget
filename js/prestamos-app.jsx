// Seccion "Prestamos y deudas"
// Se carga con Babel standalone (ver index.html) para poder usar JSX y React sin un proyecto Vite, por el momento.
const { useState } = React;

// Clase 14: parametro Rest (...nombres) - recibe una cantidad indefinida de
// clases CSS y arma el className final, filtrando los valores falsy
function combinarClases(...nombres) {
  return nombres.filter(Boolean).join(" ");
}

// Clase 12: Map como diccionario clave-valor, aca asociamos cada estado con un color
const COLORES_ESTADO = new Map([
  ["activo", "var(--color-primario)"],
  ["atrasado", "var(--color-gasto)"],
  ["saldado", "var(--color-ingreso)"],
]);

// Clase 9-11: componente funcional que retorna JSX. Recibe onAgregar como prop
// Clase 14: el hijo le avisa al padre pasandole una funcion. la logica y el estado siguen viviendo en el padre AppPrestamos
function FormularioPrestamo({ onAgregar }) {
  function manejarEnvio(e) {
    // Clase 11: evento submit + e.preventDefault() detiene el envío de datos al servidor
    e.preventDefault();

    const descripcion = e.target.elements.descripcion.value;
    const monto = Number(e.target.elements.monto.value);
    const fecha = e.target.elements.fecha.value;

    if (descripcion.trim() === "" || !(monto > 0)) {
      return;
    }

    onAgregar(descripcion, monto, fecha);
    e.target.reset();
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <div className="fila-formulario">
        <label htmlFor="prestamo-descripcion">Descripción</label>
        <input
          name="descripcion"
          type="text"
          id="prestamo-descripcion"
          placeholder="Ejemplo: Préstamo bancario"
          required
        />
      </div>
      <div className="fila-formulario">
        <label htmlFor="prestamo-monto">Monto total</label>
        <input
          name="monto"
          type="number"
          id="prestamo-monto"
          placeholder="0"
          min="1"
          step="1"
          required
        />
      </div>
      <div className="fila-formulario">
        <label htmlFor="prestamo-fecha">Fecha de inicio</label>
        <input name="fecha" type="date" id="prestamo-fecha" required />
      </div>
      <button type="submit" className="boton boton-primario">
        Agregar préstamo
      </button>
    </form>
  );
}

// Aca creamos un mini formulario para registrar un pago de un prestamo en particular
// Se renderiza dentro de cada tarjeta de prestamo
function FormularioPago({ onPagar }) {
  // Clase 12: useState local del componente hijo para el input
  const [monto, setMonto] = useState("");

  function manejarEnvio(e) {
    e.preventDefault();
    const montoNumero = Number(monto);

    if (!(montoNumero > 0)) {
      return;
    }

    onPagar(montoNumero);
    setMonto("");
  }

  return (
    <form className="formulario-pago" onSubmit={manejarEnvio}>
      <input
        type="number"
        min="1"
        step="1"
        placeholder="Monto a pagar"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
      <button type="submit" className="boton boton-primario">
        Registrar pago
      </button>
    </form>
  );
}

// Tarjeta individual de un prestamo: resumen, estado e historial de pagos
function TarjetaPrestamo({ prestamo, onPagar, onEliminar }) {
  // Clase 6 + Clase 7: metodos de Prestamo (prestamos.js) que retornan valores calculados.
  const totalPagado = prestamo.obtenerTotalPagado();
  const saldoPendiente = prestamo.obtenerSaldoPendiente();
  const porcentaje = prestamo.obtenerPorcentajePagado();
  const estado = prestamo.obtenerEstado();

  return (
    <li className={combinarClases("tarjeta-prestamo", estado)}>
      <div className="encabezado-tarjeta-prestamo">
        <strong>{prestamo.descripcion}</strong>
        {/* Clase 4: switch(estado) dentro de obtenerEtiquetaEstado (prestamos.js) */}
        <span className="estado-recurrente" style={{ color: COLORES_ESTADO.get(estado) }}>
          {obtenerEtiquetaEstado(estado)}
        </span>
      </div>

      <small>Inicio: {formatearFecha(prestamo.fechaInicio)}</small>

      <p className="detalle-prestamo">
        {`${formatearMoneda(totalPagado)} pagado de ${formatearMoneda(prestamo.montoTotal)} (${porcentaje}%)`}
      </p>
      <p className="detalle-prestamo">Saldo pendiente: {formatearMoneda(saldoPendiente)}</p>

      {/* Clase 13: .map() para listar el historial de pagos registrados */}
      {prestamo.pagos.length > 0 && (
        <ul className="historial-pagos">
          {prestamo.pagos.map((pago) => (
            <li key={pago.id}>
              {formatearFecha(pago.fecha)} — {formatearMoneda(pago.monto)}
            </li>
          ))}
        </ul>
      )}

      {saldoPendiente > 0 && <FormularioPago onPagar={onPagar} />}

      <button className="boton-eliminar" onClick={onEliminar} type="button">
        Eliminar
      </button>
    </li>
  );
}

// Clase 13: .map() para renderizar toda la lista de tarjetas a partir del array de estado
function ListaPrestamos({ prestamos, onPagar, onEliminar }) {
  if (prestamos.length === 0) {
    return <p className="estado-vacio">Todavía no registraste ningún préstamo.</p>;
  }

  return (
    <ul className="lista-prestamos">
      {prestamos.map((prestamo) => (
        <TarjetaPrestamo
          key={prestamo.id}
          prestamo={prestamo}
          onPagar={(monto) => onPagar(prestamo.id, monto)}
          onEliminar={() => onEliminar(prestamo.id)}
        />
      ))}
    </ul>
  );
}

// Componente raiz de Prestamos y Deudas
function AppPrestamos() {
  // Clase 12: useState inicializado a partir de cargarPrestamos() (almacenamiento.js).
  // Clase 7: se reconstruye cada registro como instancia de Prestamo (POO) para
  // poder usar sus metodos (obtenerSaldoPendiente, obtenerEstado, etc.).
  const [prestamos, setPrestamos] = useState(() =>
    cargarPrestamos().map(
      (datos) =>
        new Prestamo(datos.descripcion, datos.montoTotal, datos.fechaInicio, datos.id, datos.pagos)
    )
  );

  function agregarPrestamo(descripcion, monto, fecha) {
    const nuevo = new Prestamo(descripcion, monto, fecha);
    // Clase 13: Array.from(origen, fn) arma un array nuevo (largo actual + 1) sin mutar "prestamos"
    const actualizados = Array.from({ length: prestamos.length + 1 }, (_, indice) =>
      indice === 0 ? nuevo : prestamos[indice - 1]
    );
    setPrestamos(actualizados);
    guardarPrestamos(actualizados);
  }

  function registrarPago(id, monto) {
    // Clase 13: .map() genera un array nuevo; solo se reconstruye el prestamo
    // cuyo id coincide (operador ===), los demas se devuelven sin cambios.
    const actualizados = prestamos.map((prestamo) => {
      if (prestamo.id !== id) {
        return prestamo;
      }

      const nuevoPago = { id: Date.now(), monto: monto, fecha: new Date().toISOString().slice(0, 10) };
      // Clase 13: Array.from(origen, fn) arma el array de pagos nuevo (con el pago agregado al final) sin mutar el original
      const pagosActualizados = Array.from({ length: prestamo.pagos.length + 1 }, (_, indice) =>
        indice < prestamo.pagos.length ? prestamo.pagos[indice] : nuevoPago
      );
      return new Prestamo(
        prestamo.descripcion,
        prestamo.montoTotal,
        prestamo.fechaInicio,
        prestamo.id,
        pagosActualizados
      );
    });

    setPrestamos(actualizados);
    guardarPrestamos(actualizados);
  }

  function eliminarPrestamo(id) {
    // Clase 13: .filter() descarta el prestamo con ese id (comparacion estricta !==).
    const actualizados = prestamos.filter((prestamo) => prestamo.id !== id);
    setPrestamos(actualizados);
    guardarPrestamos(actualizados);
  }

  return (
    <div>
      <FormularioPrestamo onAgregar={agregarPrestamo} />
      <div className="encabezado-lista">
        <h3>Préstamos activos</h3>
      </div>
      <ListaPrestamos prestamos={prestamos} onPagar={registrarPago} onEliminar={eliminarPrestamo} />
    </div>
  );
}

// Acá renderizamos el componente raiz de Prestamos y Deudas en el div con id "react-prestamos" del index.html
const raizPrestamos = ReactDOM.createRoot(document.getElementById("react-prestamos"));
raizPrestamos.render(<AppPrestamos />);
