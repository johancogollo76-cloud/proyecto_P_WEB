/* ==========================================================
   inicio.js · Dashboard con contadores REALES
   Todo se calcula con los datos que hay en este momento
   (lo que hayas creado, editado o eliminado y quedó guardado).
   ========================================================== */
const productos = listarRegistros('productos');
const ventas = listarRegistros('ventas');

/* Contadores de productos */
const activos = productos.filter(producto => producto.estado === 'Activo').length;
const unidades = productos.reduce((suma, producto) => suma + producto.stock, 0);
const valorInventario = productos.reduce((suma, producto) => suma + producto.costo * producto.stock, 0);

poner('m-productos', productos.length);
poner('n-productos', `${unidades} uds en stock`);
poner('m-activos', activos);
poner('m-inactivos', productos.length - activos);
poner('m-inventario', dineroCorto(valorInventario));

/* Contadores de ventas (los ingresos cuentan solo las facturas pagadas) */
const ingresos = ventas.filter(venta => venta.estado === 'Pagada').reduce((suma, venta) => suma + totalVenta(venta), 0);
poner('m-ventas', ventas.length);
poner('m-ingresos', dineroCorto(ingresos));

/* Lista: stock bajo (los productos con stock igual o menor al mínimo) */
const stockBajo = productos.filter(producto => producto.stock <= producto.minimo).slice(0, 3);
$('#lista-stock').innerHTML = stockBajo.map(producto => `
  <li><div><strong>${esc(producto.nombre)}</strong><small>${esc(producto.sku)} · ${esc(producto.categoria)}</small></div><span class="bajo">${producto.stock} uds</span></li>`).join('')
  || '<li><small>Todo el stock está al día.</small></li>';

/* Lista: ventas recientes */
$('#lista-recientes').innerHTML = ventas.slice(0, 3).map(venta => `
  <li><div><strong>${esc(venta.factura)}</strong><small>${esc(venta.cliente)}</small></div><span>${dinero(totalVenta(venta))}</span></li>`).join('')
  || '<li><small>Aún no hay ventas.</small></li>';
