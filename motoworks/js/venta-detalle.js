/* ==========================================================
   venta-detalle.js · Detalle de una factura (?id=f1)
   ========================================================== */
const ventas = leerDatos('ventas');
const venta = ventas.find(v => v.id === new URLSearchParams(location.search).get('id')) || ventas[0];

if (!venta) {
  location.href = 'ventas.html';
} else {
  const poner = (id, texto) => { $('#' + id).textContent = texto; };
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

  $('#v-items').innerHTML = venta.items.map(i => `
    <tr>
      <td><div class="producto"><span class="miniatura">${icono('package')}</span><strong>${esc(i.nombre)}</strong></div></td>
      <td data-label="Cantidad">${i.cantidad}</td>
      <td data-label="Precio unitario">${dinero(i.precio)}</td>
      <td data-label="Subtotal">${dinero(i.precio * i.cantidad)}</td>
    </tr>`).join('');
}
