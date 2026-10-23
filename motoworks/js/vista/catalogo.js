/* ==========================================================
   VISTA · catalogo.js · Categorías, marcas y proveedores
   Las tres páginas se ven igual, así que usan esta misma vista.
   Cada página dice cuál es con atributos en su <body>:
     data-tabla="marcas"        → nombre de la lista de datos
     data-campo="marca"         → campo del producto que la usa
     data-articulo="una marca"  → para los mensajes
   ========================================================== */
const VistaCatalogo = {
  leerConfiguracion() {
    const { tabla, campo, articulo } = document.body.dataset;
    return { tabla, campo, articulo };
  },

  // item.cantidadProductos lo calcula el controlador
  tarjetaHTML(item) {
    const cantidad = item.cantidadProductos;
    return `
      <article class="tarjeta item-catalogo" data-id="${item.id}">
        <div><strong>${esc(item.nombre)}</strong><small>${esc(item.extra || 'Sin información adicional')}</small></div>
        <span class="chip${cantidad ? ' ok' : ''}">${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}</span>
        <div class="acciones">
          <button class="editar" type="button" data-accion="editar" aria-label="Editar">${icono('pencil')}</button>
          <button class="eliminar" type="button" data-accion="eliminar" aria-label="Eliminar">${icono('trash-2')}</button>
        </div>
      </article>`;
  },

  mostrarItems(items, hayItemsGuardados) {
    $('#lista-catalogo').innerHTML = items.map(item => VistaCatalogo.tarjetaHTML(item)).join('')
      || `<p class="vacio">${hayItemsGuardados
        ? 'No hay registros que coincidan con la búsqueda.'
        : 'Aún no hay registros. Crea el primero con el botón de arriba.'}</p>`;
  },

  leerBusqueda() { return $('#buscar-catalogo').value; },

  // Ventana de crear/editar: vacía (item = null) o con los datos del item
  abrirDialogo(item) {
    const dialogo = $('#dlg-catalogo');
    $('#form-catalogo').reset();
    $('#titulo-dialogo').textContent = item ? dialogo.dataset.editar : dialogo.dataset.nuevo;
    if (item) { $('#cat-nombre').value = item.nombre; $('#cat-extra').value = item.extra || ''; }
    dialogo.showModal();
  },
  cerrarDialogo() { $('#dlg-catalogo').close(); },
  leerFormulario() { return { nombre: $('#cat-nombre').value.trim(), extra: $('#cat-extra').value.trim() }; },

  // Eventos
  alBuscar(manejador) { $('#buscar-catalogo').addEventListener('input', manejador); },
  alPulsarNuevo(manejador) { $('#nuevo-item').addEventListener('click', manejador); },
  alPulsarAccion(manejador) {
    $('#lista-catalogo').addEventListener('click', e => {
      const boton = e.target.closest('[data-accion]');
      if (boton) manejador(boton.dataset.accion, boton.closest('article').dataset.id);
    });
  },
  alGuardar(manejador, reglasExtra) { activarValidacion($('#form-catalogo'), manejador, reglasExtra); }
};
