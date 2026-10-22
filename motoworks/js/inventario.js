/* ==========================================================
   inventario.js · Tabla de productos
   Dibujar filas, buscar/filtrar mientras se escribe,
   activar/desactivar y eliminar (con confirmación)
   ========================================================== */

// Una fila de la tabla a partir de un producto
function filaHTML(producto) {
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
}

// Los productos que cumplen la búsqueda y los dos filtros
function productosVisibles(productos) {
  const texto = $('#buscar').value;
  const categoria = $('#filtro-categoria').value;
  const estado = $('#filtro-estado').value;
  return productos.filter(producto =>
    coincideConBusqueda(texto, producto.nombre, producto.sku, producto.marca) &&
    (!categoria || producto.categoria === categoria) &&
    (!estado || producto.estado === estado));
}

function dibujar() {
  const productos = listarRegistros('productos');
  const visibles = productosVisibles(productos);
  $('#lista-productos').innerHTML = visibles.map(filaHTML).join('');
  $('#sin-resultados').textContent = productos.length === 0
    ? 'Aún no hay productos. Crea el primero con el botón «Agregar producto».'
    : 'No hay productos que coincidan. Cambia la búsqueda o los filtros.';
  $('#sin-resultados').hidden = visibles.length > 0;
}

// Las categorías del filtro salen de la lista de categorías (módulo "Categorías")
$('#filtro-categoria').insertAdjacentHTML('beforeend', listarRegistros('categorias').map(categoria => `<option>${esc(categoria.nombre)}</option>`).join(''));
['#buscar', '#filtro-categoria', '#filtro-estado'].forEach(id => $(id).addEventListener('input', dibujar));

// Botones de cada fila (activar/desactivar y eliminar)
$('#lista-productos').addEventListener('click', e => {
  const boton = e.target.closest('[data-accion]');
  if (!boton) return;
  const producto = buscarRegistro('productos', boton.closest('tr').dataset.id);

  if (boton.dataset.accion === 'alternar') {
    alternarEstado('productos', producto.id);
    dibujar();
  } else {
    confirmarEliminacion(producto.nombre, () => {
      eliminarRegistro('productos', producto.id);
      dibujar();
      mostrarAviso('aviso-producto', 'Producto eliminado correctamente.');
    });
  }
});

dibujar();
if (avisoPendiente() === 'producto') mostrarAviso('aviso-producto');
