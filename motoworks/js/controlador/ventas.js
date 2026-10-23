/* ==========================================================
   CONTROLADOR · ventas.js
   Al vender se descuenta el stock; al eliminar la venta se devuelve
   (esas reglas viven en el modelo: registrarVenta y anularVenta).
   ========================================================== */
function mostrarLista() {
  const ventas = buscarPorTexto('ventas', VistaVentas.leerBusqueda(), ['factura', 'cliente']).map(ventaConTotales);
  VistaVentas.mostrarVentas(ventas, listarRegistros('ventas').length > 0);
}

// Solo se pueden vender productos activos con stock
const productosVendibles = () => listarRegistros('productos').filter(producto => producto.estado === 'Activo' && producto.stock > 0);

function abrirNuevaVenta() {
  const disponibles = productosVendibles();
  if (disponibles.length === 0) {
    VistaComun.mostrarAviso('aviso-error', 'No hay productos activos con stock. Agrégalos primero en Inventario.');
    return;
  }
  VistaVentas.abrirDialogo(disponibles);
}

function guardarVenta() {
  const { productoId, cantidad, ...datosVenta } = VistaVentas.leerFormulario();
  datosVenta.cliente = datosVenta.cliente.trim();
  datosVenta.contacto = datosVenta.contacto.trim() || 'Sin contacto';
  datosVenta.detallePago = datosVenta.detallePago.trim() || 'Sin detalle';

  registrarVenta(datosVenta, buscarRegistro('productos', productoId), Number(cantidad));
  VistaVentas.cerrarDialogo();
  mostrarLista();
  VistaComun.mostrarAviso('aviso-venta', 'Venta registrada correctamente.');
}

function eliminarVenta(venta) {
  anularVenta(venta.id);
  mostrarLista();
  VistaComun.mostrarAviso('aviso-venta', 'Venta eliminada. El stock se devolvió al inventario.');
}

function atenderAccion(accion, id) {
  const venta = buscarRegistro('ventas', id);
  if (accion === 'alternar') {
    alternarEstado('ventas', id, ['Pagada', 'Pendiente']);
    mostrarLista();
  } else {
    VistaComun.confirmarEliminacion(venta.factura, () => eliminarVenta(venta));
  }
}

// No se pueden vender más unidades de las que hay
const reglasDelFormulario = {
  '#v-cantidad': cantidad => {
    const producto = buscarRegistro('productos', VistaVentas.leerFormulario().productoId);
    return producto && Number(cantidad) > producto.stock ? `Solo hay ${producto.stock} unidades disponibles.` : '';
  }
};

function iniciar() {
  VistaVentas.alBuscar(mostrarLista);
  VistaVentas.alPulsarNueva(abrirNuevaVenta);
  VistaVentas.alPulsarAccion(atenderAccion);
  VistaVentas.alGuardar(guardarVenta, reglasDelFormulario);
  mostrarLista();
}
iniciar();
