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
