/* ==========================================================
   VISTA · ventas.js · Lista de ventas y formulario de nueva venta
   ========================================================== */
const VistaVentas = {
  // venta.total y venta.unidades los calcula el modelo (ventaConTotales)
  filaHTML(venta) {
    return `
      <article class="tarjeta venta" data-id="${venta.id}">
        <div><strong>${esc(venta.factura)}</strong><small>${venta.fecha}</small></div>
        <div><strong>${esc(venta.cliente)}</strong><small>${venta.unidades} ${venta.unidades === 1 ? 'producto' : 'productos'}</small></div>
        <span>${dinero(venta.total)}</span>
        <span><span class="chip ${venta.estado === 'Pagada' ? 'ok' : 'alerta'}">${venta.estado}</span></span>
        <span>${esc(venta.metodo)}</span>
        <div class="acciones">
          <a class="ver" href="venta-detalle.html?id=${venta.id}" aria-label="Ver factura ${esc(venta.factura)}">${icono('eye')}</a>
          <button class="alternar" type="button" data-accion="alternar" aria-label="Cambiar entre pagada y pendiente">${icono('power')}</button>
          <button class="eliminar" type="button" data-accion="eliminar" aria-label="Eliminar venta">${icono('trash-2')}</button>
        </div>
      </article>`;
  },

  mostrarVentas(ventas, hayVentasGuardadas) {
    $('#lista-ventas').innerHTML = ventas.map(venta => VistaVentas.filaHTML(venta)).join('')
      || `<p class="vacio">${hayVentasGuardadas
        ? 'No hay ventas que coincidan con la búsqueda.'
        : 'Aún no hay ventas. Registra la primera con el botón «Nueva venta».'}</p>`;
  },

  leerBusqueda() { return $('#buscar-venta').value; },

  // Abre la ventana de nueva venta con los productos que se pueden vender
  abrirDialogo(productosDisponibles) {
    $('#v-producto').innerHTML = '<option value="">Selecciona</option>' +
      productosDisponibles.map(producto => `<option value="${producto.id}">${esc(producto.nombre)} (${producto.stock} uds)</option>`).join('');
    $('#dlg-venta').showModal();
  },
  cerrarDialogo() { $('#dlg-venta').close(); },
  leerFormulario() { return Object.fromEntries(new FormData($('#form-venta'))); },

  // Eventos
  alBuscar(manejador) { $('#buscar-venta').addEventListener('input', manejador); },
  alPulsarNueva(manejador) { $('#nueva-venta').addEventListener('click', manejador); },
  alPulsarAccion(manejador) {
    $('#lista-ventas').addEventListener('click', e => {
      const boton = e.target.closest('[data-accion]');
      if (boton) manejador(boton.dataset.accion, boton.closest('article').dataset.id);
    });
  },
  alGuardar(manejador, reglasExtra) { activarValidacion($('#form-venta'), manejador, reglasExtra); }
};
