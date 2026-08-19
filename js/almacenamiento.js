// localStorage permite conservar datos aunque se cierre el navegador.
const CLAVE_MOVIMIENTOS = "smartbudget_movimientos";

function cargarMovimientos() {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_MOVIMIENTOS);

    if (textoGuardado === null) {
      return [];
    }

    const datos = JSON.parse(textoGuardado);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("No se pudieron cargar los movimientos.", error);
    return [];
  }
}

function guardarMovimientos(movimientos) {
  try {
    const textoParaGuardar = JSON.stringify(movimientos);
    localStorage.setItem(CLAVE_MOVIMIENTOS, textoParaGuardar);
  } catch (error) {
    console.error("No se pudieron guardar los movimientos.", error);
  }
}

// Creamos otro localStorage para recurrentes con otra clave para no mezclar los datos.
const CLAVE_RECURRENTES = "smartbudget_recurrentes";

function cargarRecurrentes() {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_RECURRENTES);

    if (textoGuardado === null) {
      return [];
    }

    const datos = JSON.parse(textoGuardado);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("No se pudieron cargar los gastos recurrentes.", error);
    return [];
  }
}

function guardarRecurrentes(recurrentes) {
  try {
    const textoParaGuardar = JSON.stringify(recurrentes);
    localStorage.setItem(CLAVE_RECURRENTES, textoParaGuardar);
  } catch (error) {
    console.error("No se pudieron guardar los gastos recurrentes.", error);
  }
}

// Otra clave para no mezclar los activos y pasivos con los movimientos
const CLAVE_PATRIMONIO = "smartbudget_patrimonio";

function cargarPatrimonio() {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_PATRIMONIO);

    if (textoGuardado === null) {
      return [];
    }

    const datos = JSON.parse(textoGuardado);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("No se pudieron cargar los activos y pasivos.", error);
    return [];
  }
}

function guardarPatrimonio(registros) {
  try {
    const textoParaGuardar = JSON.stringify(registros);
    localStorage.setItem(CLAVE_PATRIMONIO, textoParaGuardar);
  } catch (error) {
    console.error("No se pudieron guardar los activos y pasivos.", error);
  }
}

const CLAVE_PRESTAMOS = "smartbudget_prestamos";

function cargarPrestamos() {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_PRESTAMOS);

    if (textoGuardado === null) {
      return [];
    }

    const datos = JSON.parse(textoGuardado);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("No se pudieron cargar los prestamos.", error);
    return [];
  }
}

function guardarPrestamos(prestamos) {
  try {
    const textoParaGuardar = JSON.stringify(prestamos);
    localStorage.setItem(CLAVE_PRESTAMOS, textoParaGuardar);
  } catch (error) {
    console.error("No se pudieron guardar los prestamos.", error);
  }
}
