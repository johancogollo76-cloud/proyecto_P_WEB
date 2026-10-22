/* ==========================================================
   ventas.js · Listado de ventas
   Registrar una venta, buscar, cambiar su estado, ver y eliminar.
   Al vender se descuenta el stock; al eliminar la venta se devuelve.
   ========================================================== */
const form = $('#form-venta');
const dialogo = $('#dlg-venta');

function filaHTML(venta) {
  const unidades = unidadesVenta(venta);
  return `
    <article class="tarjeta venta" data-id="${venta.id}">
      <div><strong>${esc(venta.factura)}</strong><small>${venta.fecha}</small></div>
      <div><strong>${esc(venta.cliente)}</strong><small>${unidades} ${unidades === 1 ? 'producto' : 'productos'}</small></div>
      <span>${dinero(totalVenta(venta))}</span>
      <span><span class="chip ${venta.estado === 'Pagada' ? 'ok' : 'alerta'}">${venta.estado}</span></span>
      <span>${esc(venta.metodo)}</span>
      <div class="acciones">
        <a class="ver" href="venta-detalle.html?id=${venta.id}" aria-label="Ver factura ${esc(venta.factura)}">${icono('eye')}</a>
        <button class="alternar" type="button" data-accion="alternar" aria-label="Cambiar entre pagada y pendiente">${icono('power')}</button>
        <button class="eliminar" type="button" data-accion="eliminar" aria-label="Eliminar venta">${icono('trash-2')}</button>
      </div>
    </article>`;
}

// Dibuja la lista; el buscador filtra por factura o cliente
function dibujar() {
  const ventas = listarRegistros('ventas');
  const texto = $('#buscar-venta').value;
  const visibles = ventas.filter(venta => coincideConBusqueda(texto, venta.factura, venta.cliente));
  $('#lista-ventas').innerHTML = visibles.map(filaHTML).join('')
    || `<p class="vacio">${ventas.length === 0
      ? 'Aún no hay ventas. Registra la primera con el botón «Nueva venta».'
      : 'No hay ventas que coincidan con la búsqueda.'}</p>`;
}
$('#buscar-venta').addEventListener('input', dibujar);

/* Nueva venta: solo se pueden vender productos activos con stock */
const productosVendibles = () => listarRegistros('productos').filter(producto => producto.estado === 'Activo' && producto.stock > 0);

$('#nueva-venta').addEventListener('click', () => {
  const disponibles = productosVendibles();
  if (disponibles.length === 0) {
    mostrarAviso('aviso-error', 'No hay productos activos con stock. Agrégalos primero en Inventario.');
    return;
  }
  $('#v-producto').innerHTML = '<option value="">Selecciona</option>' +
    disponibles.map(producto => `<option value="${producto.id}">${esc(producto.nombre)} (${producto.stock} uds)</option>`).join('');
  dialogo.showModal();
});

// No se pueden vender más unidades de las que hay
function verificarStock() {
  const producto = buscarRegistro('productos', $('#v-producto').value);
  const demasiado = producto && Number($('#v-cantidad').value) > producto.stock;
  $('#v-cantidad').setCustomValidity(demasiado ? `Solo hay ${producto.stock} unidades disponibles.` : '');
}
['#v-producto', '#v-cantidad'].forEach(id => $(id).addEventListener('input', verificarStock));
form.addEventListener('submit', verificarStock);   // debe ir antes de activarValidacion

function guardarVenta() {
  const { productoId, cantidad, ...datosVenta } = Object.fromEntries(new FormData(form));
  datosVenta.cliente = datosVenta.cliente.trim();
  datosVenta.contacto = datosVenta.contacto.trim() || 'Sin contacto';
  datosVenta.detallePago = datosVenta.detallePago.trim() || 'Sin detalle';

  registrarVenta(datosVenta, buscarRegistro('productos', productoId), Number(cantidad));
  dialogo.close();
  dibujar();
  mostrarAviso('aviso-venta', 'Venta registrada correctamente.');
}
activarValidacion(form, guardarVenta);

/* Botones de cada venta (cambiar estado y eliminar) */
$('#lista-ventas').addEventListener('click', e => {
  const boton = e.target.closest('[data-accion]');
  if (!boton) return;
  const venta = buscarRegistro('ventas', boton.closest('article').dataset.id);

  if (boton.dataset.accion === 'alternar') {
    alternarEstado('ventas', venta.id, ['Pagada', 'Pendiente']);
    dibujar();
  } else {
    confirmarEliminacion(venta.factura, () => {
      anularVenta(venta.id);
      dibujar();
      mostrarAviso('aviso-venta', 'Venta eliminada. El stock se devolvió al inventario.');
    });
  }
});

dibujar();
