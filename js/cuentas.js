/*  Gestion de cuentas bancarias
- Clase 2: Variables (const, let), tipos de datos (string, number) - getElementById, innerHTML
- Clase 6: Funciones (declaración, parámetros, return)\
- Clase 7: Date.now() para generar ID único
- Clase 8: DOM (getElementById, innerHTML) 
- Clase 12: Plantillas de cadenas (`${}`)
- Clase 13: Clase Array (push, filter, find, forEach, reduce)
- Clase 14: Operador Spread (...)
 */


// ---------- CLAVE PARA LOCALSTORAGE ----------
// Clase 2 - Variables: definimos una constante con la clave
// que usaremos para guardar las cuentas en localStorage.
const CLAVE_CUENTAS = "viruflow_cuentas";

// ---------- CARGAR CUENTAS DESDE LOCALSTORAGE ---------
/* Carga las cuentas desde localStorage

 @returns {Array} Array de cuentas (vacío si no hay datos)

 Clase 2 - Variables
 Clase 6 - Funciones
 */
function cargarCuentas(){

    try{
        const texto = localStorage.getItem(CLAVE_CUENTAS);      // localStorage.getItem() para recuperar datos
        
        return texto ? JSON.parse(texto): []                    // Clase 4 - Operador ternario: si hay texto, lo parseamos, si no, array vacío
                                                                 // JSON.parse() convierte string a objeto/array
    }catch{
        return [];                                              // Clase 2 - Si falla, retornamos array vacío (Clase 6 - return)
    }
}

// ---------- GUARDAR CUENTAS EN LOCALSTORAGE ----------
/* Guarda el array de cuentas en localStorage

Clase 6 - Funciones
JSON.stringify() convierte objeto a string
 */
function guardarCuentas(){

    try{
        localStorage.setItem(CLAVE_CUENTAS,JSON.stringify(cuentas));            // Clase 8 - Guardamos en localStorage (clave, valor)
    }catch{
        console.error("No se puedieron guardar las cuentas.", error);           // Clase 2 - console.error() para mostrar errores en consola
    }
}

// ---------- VARIABLE GLOBAL ----------
let cuentas = cargarCuentas();                                                  // Clase 2 - Variable global que almacena las cuentas en memoria

// ---------- AGREGAR CUENTA ----------
/* Agrega una nueva cuenta bancaria

 @param {string} nombre - Nombre de la cuenta (ej: "Cuenta sueldo")
 @param {string} entidad - Entidad bancaria (ej: "Banco Itaú")
 @param {number} saldoInicial - Saldo inicial de la cuenta

Clase 6 - Funciones con parámetros
Clase 7 - Date.now() para ID único (timestamp)
Clase 14 - Array.push() para agregar al final
 */
function agregarCuenta(nombre, entidad, saldoInicial) {
    
    const nuevaCuenta = {                                               // Clase 7 - Creamos un objeto literal con los datos de la cuenta
        
        id: Date.now(),                                                 // Clase 7 - Date.now() genera un número único basado en la hora actual
        nombre:nombre.trim(),                                           // trim() elimina espacios al inicio y final
        entidad: entidad.trim(),
        saldoInicial: Number(saldoInicial) || 0                         // Clase 4 - Number() convierte string a número. Si falla, usa 0 (operador OR)
    };

    cuentas.push(nuevaCuenta);                                          // Clase 14 - push() agrega el objeto al array 'cuentas'
    guardarCuentas();                                                   // Clase 6 - Llamamos a la función para guardar en localStorage
}


// ---------- ELIMINAR CUENTA ----------
/* Elimina una cuenta por su ID

@param {number} id - ID de la cuenta a eliminar

Clase 13 - Array.filter() (crea un nuevo array sin el elemento)
Clase 11 - Operador de desigualdad estricta (!==)
 */
function eliminarCuenta (id){                                           
                                                                        // Clase 13 - filter() recorre el array y crea uno nuevo con los elementos que cumplen la condición
    cuentas = cuentas.filter(c => c.id !== id);                         // Clase 11 - !== significa "distinto en valor y tipo"
                                                                        // Clase 12 - Funciones flecha (=>)  
    guardarCuentas();                                                   // Clase 6 - Guardamos el array actualizado
}

// ---------- OBTENER TODAS LAS CUENTAS ----------
/* Retorna una copia del array de cuentas

@returns {Array} Copia del array de cuentas 

Clase 6 - Funciones
Clase 14 - Operador Spread (...) para crear copia
 */
function obtenerCuentas() {

    return [...cuentas];                                // Clase 14 - Spread operator: ...cuentas desempaqueta el array y lo mete en uno nuevo
                                                        // Así evitamos modificar el array original desde fuera
}

// ---------- CALCULAR SALDO DE UNA CUENTA ----------
/* Calcula el saldo actual de una cuenta

 Fórmula: saldo inicial + ingresos - gastos
 @param {number} idCuenta - ID de la cuenta
 @param {Array} movimientos - Lista de movimientos (ingresos y gastos)
 @returns {number} Saldo actual de la cuenta
 
Clase 13 - Array.find() (buscar un elemento) / Array.filter() (filtrar movimientos) / Array.reduce() (sumar montos)
Clase 4 - Operadores lógicos (&&)
Clase 3 - Estructura condicional (if) - Operadores aritméticos (+, -)
 */
function obtenerSaldoCuenta(idCuenta, movimientos){

    const cuenta = cuentas.find(c => c.id === idCuenta);            // Clase 13 - find() busca la cuenta que coincida con el ID
    if (!cuenta) return 0;                                          // Clase 3 - if: si no existe la cuenta, retornamos 0

    const ingresos = movimientos                                            
        .filter(m => m.cuentaId === idCuenta && m.tipo === "ingreso")       // Clase 13 - filter() selecciona solo los ingresos de esta cuenta // Clase 4 - && (Y lógico): cumple ambas condiciones (misma cuenta Y tipo ingreso)
        .reduce((sum, m) => sum + m.monto, 0);                              // Clase 13 - reduce() suma todos los montos de los ingresos

    const gastos = movimientos                                              // Clase 13 - filter() selecciona solo los gastos de esta cuenta
        .filter(m => m.cuentaId === idCuenta && m.tipo === "gasto")
        .reduce((sum, m) => sum + m.monto, 0);

    return cuenta.saldoInicial + ingresos - gastos;                         // Clase 3 - Fórmula: saldo inicial + ingresos - gastos
}


// ---------- AGRUPAR CUENTAS POR ENTIDAD ----------
/* Agrupa las cuentas por entidad bancaria

@returns {Object} Objeto donde cada clave es una entidad y su valor es un array de cuentas

Clase 5 - forEach() para recorrer array
Clase 7 - Objetos (uso de corchetes para propiedades dinámicas)
Clase 14 - Array.push() para agregar a un grupo
lase 12 - forEach con arrow function
 */
function agruparCuentasPorEntidad(){

    const grupos = {};                                  // Clase 7 - Creamos un objeto vacío que contendra los grupos

    cuentas.forEach (c => {                             // Clase 5 - forEach recorre cada cuenta del array 'cuentas' // Clase 12 - Arrow function (=>) para simplificar
        if(!grupos [c.entidad]){                        // Clase 7 - Si la entidad no existe como clave en el objeto, la creamos. Usamos corchetes para acceder a una propiedad dinámica                                            
            grupos[c.entidad] = [];                     //  Inicializamos un array vacío
        } 
        grupos[c.entidad].push(c);                      // Clase 14 - push() agrega la cuenta al grupo correspondiente
    });
    return grupos;                                      // Clase 6 - Retornamos el objeto con los grupos
}