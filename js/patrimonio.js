// Creado por Alejandro
// Los activos (lo que tenemos) y los pasivos (lo que debemos) se guardan en una sola lista y se diferencian con la propiedad tipo.
let listaPatrimonio = cargarPatrimonio();

function agregarRegistro(tipo, descripcion, monto, fecha) {
  const nuevoRegistro = {
    id: Date.now(),
    tipo: tipo, // "activo" | "pasivo"
    descripcion: descripcion.trim(),
    monto: Number(monto),
    fecha: fecha
  };

  listaPatrimonio.push(nuevoRegistro);
  guardarPatrimonio(listaPatrimonio);
}

function eliminarRegistro(id) {
  listaPatrimonio = listaPatrimonio.filter(function (registro) {
    return registro.id !== id;
  });

  guardarPatrimonio(listaPatrimonio);
}

// Devuelve solo los activos, solo los pasivos, o todos, ordenados por fecha.
function obtenerRegistros(tipo = "todos") {
  let resultado = listaPatrimonio;

  if (tipo !== "todos") {
    resultado = resultado.filter(function (registro) {
      return registro.tipo === tipo;
    });
  }

  return resultado.slice().sort(function (a, b) {
    return b.fecha.localeCompare(a.fecha);
  });
}
