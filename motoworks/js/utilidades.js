/* ==========================================================
   utilidades.js · Funciones pequeñas que usan las tres capas
   ----------------------------------------------------------
   Son funciones "puras": reciben un valor y devuelven otro.
   No tocan la pantalla ni guardan datos.
   ========================================================== */

// $1.250.000
const dinero = numero => '$' + String(Math.round(numero)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// $7,4 M  (para los contadores del dashboard)
const dineroCorto = numero => numero >= 1000000 ? '$' + (numero / 1000000).toFixed(1).replace('.', ',') + ' M' : dinero(numero);

// Buscador: ¿alguno de los textos contiene lo que se escribió? (sin importar mayúsculas)
const coincideConBusqueda = (textoBuscado, ...textos) =>
  textos.join(' ').toLowerCase().includes(textoBuscado.trim().toLowerCase());

// Fecha y hora de este momento, con el formato de la app: "15 oct 2026" y "10:42 a. m."
const fechaDeHoy = () => new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '').replace(/ de /g, ' ');
const horaActual = () => new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
