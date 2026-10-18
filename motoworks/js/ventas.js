/* ==========================================================
   ventas.js · Listado de ventas (desde los datos) y buscador
   ========================================================== */
const ventas = leerDatos('ventas');

function filaHTML(v) {
  const unidades = unidadesVenta(v);
  return `
    <article class="tarjeta venta">
      <div><strong>${v.factura}</strong><small>${v.fecha}</small></div>
      <div><strong>${esc(v.cliente)}</strong><small>${unidades} ${unidades === 1 ? 'producto' : 'productos'}</small></div>
      <span>${dinero(totalVenta(v))}</span>
      <span><span class="chip ${v.estado === 'Pagada' ? 'ok' : 'alerta'}">${v.estado}</span></span>
      <span>${v.metodo}</span>
      <a class="btn" href="venta-detalle.html?id=${v.id}" aria-label="Ver factura ${v.factura}">${icono('arrow-right')}Ver</a>
    </article>`;
}

function dibujar() {
  const texto = $('#buscar-venta').value.toLowerCase();
  const visibles = ventas.filter(v => `${v.factura} ${v.cliente}`.toLowerCase().includes(texto));
  $('#lista-ventas').innerHTML = visibles.map(filaHTML).join('')
    || '<p class="vacio">No hay ventas que coincidan con la búsqueda.</p>';
}
$('#buscar-venta').addEventListener('input', dibujar);
dibujar();
