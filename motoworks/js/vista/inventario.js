/* ==========================================================
   VISTA · inventario.js · Tabla de productos
   Dibuja las filas, lee los filtros y avisa al controlador
   cuando la persona escribe o pulsa un botón.
   ========================================================== */
const VistaInventario = {
  // Una fila de la tabla a partir de un producto
  filaHTML(producto) {
    const bajo = Number(producto.stock) <= Number(producto.minimo);
    const claseImagen = producto.imagen ? ' con-imagen' : '';
    const estiloImagen = producto.imagen ? ` style="background-image:url('${producto.imagen}')"` : '';
    return `
      <tr data-id="${producto.id}">
        <td><div class="producto"><span class="miniatura${claseImagen}"${estiloImagen}>${icono('package')}</span><div><strong>${esc(producto.nombre)}</strong><small>${esc(producto.sku)}</small></div></div></td>
        <td data-label="Categoría">${esc(producto.categoria)}</td>
        <td data-label="Marca">${esc(producto.marca)}</td>
        <td data-label="Precio">${dinero(producto.precio)}</td>
        <td data-label="Stock"${bajo ? ' class="bajo"' : ''}>${producto.stock}</td>
        <td data-label="Estado"><span class="chip${producto.estado === 'Activo' ? ' ok' : ''}">${producto.estado}</span></td>
        <td><div class="acciones">
          <a class="ver" href="producto-detalle.html?id=${producto.id}" aria-label="Ver detalle">${icono('eye')}</a>
          <a class="editar" href="producto-form.html?id=${producto.id}" aria-label="Editar">${icono('pencil')}</a>
          <button class="alternar" type="button" data-accion="alternar" aria-label="Activar o desactivar">${icono('power')}</button>
          <button class="eliminar" type="button" data-accion="eliminar" aria-label="Eliminar">${icono('trash-2')}</button>
        </div></td>
      </tr>`;
  },

  // hayProductosGuardados sirve para elegir el mensaje cuando la tabla queda vacía
  mostrarProductos(productos, hayProductosGuardados) {
    $('#lista-productos').innerHTML = productos.map(producto => VistaInventario.filaHTML(producto)).join('');
    $('#sin-resultados').textContent = hayProductosGuardados
      ? 'No hay productos que coincidan. Cambia la búsqueda o los filtros.'
      : 'Aún no hay productos. Crea el primero con el botón «Agregar producto».';
    $('#sin-resultados').hidden = productos.length > 0;
  },

  llenarFiltroCategorias(categorias) {
    $('#filtro-categoria').insertAdjacentHTML('beforeend', categorias.map(categoria => `<option>${esc(categoria.nombre)}</option>`).join(''));
  },

  leerFiltros() {
    return { texto: $('#buscar').value, categoria: $('#filtro-categoria').value, estado: $('#filtro-estado').value };
  },

  // Eventos: la vista los detecta, el controlador decide qué hacer
  alCambiarFiltros(manejador) {
    ['#buscar', '#filtro-categoria', '#filtro-estado'].forEach(id => $(id).addEventListener('input', manejador));
  },
  alPulsarAccion(manejador) {
    $('#lista-productos').addEventListener('click', e => {
      const boton = e.target.closest('[data-accion]');
      if (boton) manejador(boton.dataset.accion, boton.closest('tr').dataset.id);
    });
  }
};
