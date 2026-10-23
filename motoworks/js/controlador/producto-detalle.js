/* ==========================================================
   CONTROLADOR · producto-detalle.js · Producto de la dirección (?id=p1)
   ========================================================== */
const producto = buscarRegistro('productos', VistaComun.leerParametro('id')) || listarRegistros('productos')[0];

if (producto) {
  VistaProductoDetalle.mostrarProducto(producto);
} else {
  VistaComun.irA('inventario.html');   // no hay productos que mostrar
}
