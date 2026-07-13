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
