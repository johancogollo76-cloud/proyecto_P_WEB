/* ==========================================================
   venta-detalle.js · Detalle de una factura (?id=f1)
   ========================================================== */
const idVenta = new URLSearchParams(location.search).get('id');
const venta = buscarRegistro('ventas', idVenta) || listarRegistros('ventas')[0];

if (!venta) {
  location.href = 'ventas.html';   // no hay ventas que mostrar
} else {
  poner('v-factura', 'Factura ' + venta.factura);
  poner('v-cliente', venta.cliente);
  poner('v-contacto', venta.contacto);
  poner('v-fecha', venta.fecha);
  poner('v-hora', venta.hora);
  poner('v-metodo', venta.metodo);
  poner('v-pago', venta.detallePago);
  poner('v-total', dinero(totalVenta(venta)));

  const estado = $('#v-estado');
  estado.textContent = venta.estado;
  estado.classList.add(venta.estado === 'Pagada' ? 'ok' : 'alerta');

  $('#v-items').innerHTML = venta.items.map(item => `
    <tr>
      <td><div class="producto"><span class="miniatura">${icono('package')}</span><strong>${esc(item.nombre)}</strong></div></td>
      <td data-label="Cantidad">${item.cantidad}</td>
      <td data-label="Precio unitario">${dinero(item.precio)}</td>
      <td data-label="Subtotal">${dinero(item.precio * item.cantidad)}</td>
    </tr>`).join('');
}
