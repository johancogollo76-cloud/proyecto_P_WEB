/* ==========================================================
   CONTROLADOR · venta-detalle.js · Factura de la dirección (?id=f1)
   ========================================================== */
const venta = buscarRegistro('ventas', VistaComun.leerParametro('id')) || listarRegistros('ventas')[0];

if (venta) {
  VistaVentaDetalle.mostrarVenta(ventaConTotales(venta));
} else {
  VistaComun.irA('ventas.html');   // no hay ventas que mostrar
}
