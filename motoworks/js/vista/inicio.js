/* ==========================================================
   VISTA · inicio.js · Dibuja el dashboard
   Recibe el resumen ya calculado y lo escribe en la página.
   ========================================================== */
const VistaInicio = {
  mostrarResumen(resumen) {
    poner('m-productos', resumen.totalProductos);
    poner('n-productos', `${resumen.unidadesEnStock} uds en stock`);
    poner('m-activos', resumen.activos);
    poner('m-inactivos', resumen.inactivos);
    poner('m-inventario', dineroCorto(resumen.valorInventario));
    poner('m-ventas', resumen.totalVentas);
    poner('m-ingresos', dineroCorto(resumen.ingresos));

    $('#lista-stock').innerHTML = resumen.stockBajo.map(producto => `
      <li><div><strong>${esc(producto.nombre)}</strong><small>${esc(producto.sku)} · ${esc(producto.categoria)}</small></div><span class="bajo">${producto.stock} uds</span></li>`).join('')
      || '<li><small>Todo el stock está al día.</small></li>';

    $('#lista-recientes').innerHTML = resumen.ventasRecientes.map(venta => `
      <li><div><strong>${esc(venta.factura)}</strong><small>${esc(venta.cliente)}</small></div><span>${dinero(venta.total)}</span></li>`).join('')
      || '<li><small>Aún no hay ventas.</small></li>';
  }
};
