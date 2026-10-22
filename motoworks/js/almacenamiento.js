/* ==========================================================
   almacenamiento.js · Lo ÚNICO que habla con localStorage
   ----------------------------------------------------------
   Solo guarda y lee listas. No sabe qué es un producto ni qué
   se ve en pantalla. localStorage conserva los datos aunque se
   recargue la página o se cierre el navegador.
   ========================================================== */
const PREFIJO = 'mw_';   // todas las claves empiezan así: mw_productos, mw_marcas...

function leerLista(nombreLista) {
  try {
    const texto = localStorage.getItem(PREFIJO + nombreLista);
    return texto ? JSON.parse(texto) : [];
  } catch (error) {
    return [];   // sin permiso o texto dañado: se empieza con la lista vacía
  }
}

function guardarLista(nombreLista, lista) {
  try {
    localStorage.setItem(PREFIJO + nombreLista, JSON.stringify(lista));
  } catch (error) {
    console.error('No se pudo guardar en localStorage:', error);
  }
}
