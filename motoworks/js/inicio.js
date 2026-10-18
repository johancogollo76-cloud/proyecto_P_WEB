/* ==========================================================
   inicio.js · Dashboard con contadores REALES
   Todo se calcula con los datos que hay en este momento
   (los de ejemplo más lo que hayas creado, editado o eliminado).
   ========================================================== */
const productos = leerDatos('productos');
const ventas = leerDatos('ventas');

const poner = (id, texto) => { $('#' + id).textContent = texto; };

/* Contadores de productos */
const activos = productos.filter(p => p.estado === 'Activo').length;
const unidades = productos.reduce((suma, p) => suma + p.stock, 0);
const valorInventario = productos.reduce((suma, p) => suma + p.costo * p.stock, 0);

poner('m-productos', productos.length);
poner('n-productos', `${unidades} uds en stock`);
poner('m-activos', activos);
poner('m-inactivos', productos.length - activos);
poner('m-inventario', dineroCorto(valorInventario));

/* Contadores de ventas (los ingresos cuentan solo las facturas pagadas) */
const ingresos = ventas.filter(v => v.estado === 'Pagada').reduce((suma, v) => suma + totalVenta(v), 0);
poner('m-ventas', ventas.length);
poner('m-ingresos', dineroCorto(ingresos));

/* Lista: stock bajo (los productos con stock igual o menor al mínimo) */
const stockBajo = productos.filter(p => p.stock <= p.minimo).slice(0, 3);
$('#lista-stock').innerHTML = stockBajo.map(p => `
  <li><div><strong>${esc(p.nombre)}</strong><small>${esc(p.sku)} · ${esc(p.categoria)}</small></div><span class="bajo">${p.stock} uds</span></li>`).join('')
  || '<li><small>Todo el stock está al día.</small></li>';

/* Lista: ventas recientes */
$('#lista-recientes').innerHTML = ventas.slice(0, 3).map(v => `
  <li><div><strong>${v.factura}</strong><small>${esc(v.cliente)}</small></div><span>${dinero(totalVenta(v))}</span></li>`).join('')
  || '<li><small>Aún no hay ventas.</small></li>';
