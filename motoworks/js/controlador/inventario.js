/* ==========================================================
   CONTROLADOR · inventario.js
   Conecta el modelo (datos) con la vista (pantalla):
   escucha lo que hace la persona, actualiza los datos y
   le dice a la vista que se redibuje.
   ========================================================== */
function mostrarLista() {
  const productos = filtrarProductos(VistaInventario.leerFiltros());
  VistaInventario.mostrarProductos(productos, listarRegistros('productos').length > 0);
}

function eliminarProducto(producto) {
  eliminarRegistro('productos', producto.id);
  mostrarLista();
  VistaComun.mostrarAviso('aviso-producto', 'Producto eliminado correctamente.');
}

function atenderAccion(accion, id) {
  const producto = buscarRegistro('productos', id);
  if (accion === 'alternar') {
    alternarEstado('productos', id);
    mostrarLista();
  } else {
    VistaComun.confirmarEliminacion(producto.nombre, () => eliminarProducto(producto));
  }
}

function iniciar() {
  // Las categorías del filtro salen de la lista de categorías (módulo "Categorías")
  VistaInventario.llenarFiltroCategorias(listarRegistros('categorias'));
  VistaInventario.alCambiarFiltros(mostrarLista);   // filtra mientras se escribe
  VistaInventario.alPulsarAccion(atenderAccion);
  mostrarLista();
  if (VistaComun.avisoPendiente() === 'producto') VistaComun.mostrarAviso('aviso-producto');
}
iniciar();
