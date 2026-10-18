/* ==========================================================
   inventario.js · Tabla de productos
   Dibujar filas, filtrar, activar/desactivar y eliminar (con confirmación)
   ========================================================== */
let productos = leerDatos('productos');
let idAEliminar = null;

// Una fila de la tabla a partir de un producto
function filaHTML(p) {
  const bajo = Number(p.stock) <= Number(p.minimo);
  const claseImagen = p.imagen ? ' con-imagen' : '';
  const estiloImagen = p.imagen ? ` style="background-image:url('${p.imagen}')"` : '';
  return `
    <tr data-id="${p.id}">
      <td><div class="producto"><span class="miniatura${claseImagen}"${estiloImagen}>${icono('package')}</span><div><strong>${esc(p.nombre)}</strong><small>${esc(p.sku)}</small></div></div></td>
      <td data-label="Categoría">${esc(p.categoria)}</td>
      <td data-label="Marca">${esc(p.marca)}</td>
      <td data-label="Precio">${dinero(p.precio)}</td>
      <td data-label="Stock"${bajo ? ' class="bajo"' : ''}>${p.stock}</td>
      <td data-label="Estado"><span class="chip${p.estado === 'Activo' ? ' ok' : ''}">${p.estado}</span></td>
      <td><div class="acciones">
        <a class="ver" href="producto-detalle.html?id=${p.id}" aria-label="Ver detalle">${icono('eye')}</a>
        <a class="editar" href="producto-form.html?id=${p.id}" aria-label="Editar">${icono('pencil')}</a>
        <button class="alternar" type="button" data-accion="alternar" aria-label="Activar o desactivar">${icono('power')}</button>
        <button class="eliminar" type="button" data-accion="eliminar" aria-label="Eliminar">${icono('trash-2')}</button>
      </div></td>
    </tr>`;
}

function dibujar() {
  $('#lista-productos').innerHTML = productos.map(filaHTML).join('');
  filtrar();
}

// Muestra solo los productos que cumplen la búsqueda y los dos filtros
function filtrar() {
  const texto = $('#buscar').value.toLowerCase();
  const categoria = $('#filtro-categoria').value;
  const estado = $('#filtro-estado').value;
  let visibles = 0;

  $$('#lista-productos tr').forEach(fila => {
    const p = productos.find(x => x.id === fila.dataset.id);
    const coincide =
      `${p.nombre} ${p.sku} ${p.marca}`.toLowerCase().includes(texto) &&
      (!categoria || p.categoria === categoria) &&
      (!estado || p.estado === estado);
    fila.hidden = !coincide;
    if (coincide) visibles++;
  });
  $('#sin-resultados').hidden = visibles > 0;
}
// Las categorías del filtro salen de la lista de categorías (módulo "Categorías")
$('#filtro-categoria').insertAdjacentHTML('beforeend', leerDatos('categorias').map(c => `<option>${esc(c.nombre)}</option>`).join(''));
['#buscar', '#filtro-categoria', '#filtro-estado'].forEach(id => $(id).addEventListener('input', filtrar));

// Botones de cada fila (activar/desactivar y eliminar)
$('#lista-productos').addEventListener('click', e => {
  const boton = e.target.closest('[data-accion]');
  if (!boton) return;
  const id = boton.closest('tr').dataset.id;
  const producto = productos.find(p => p.id === id);

  if (boton.dataset.accion === 'alternar') {
    producto.estado = producto.estado === 'Activo' ? 'Inactivo' : 'Activo';
    guardarDatos('productos', productos);
    dibujar();
  } else {
    idAEliminar = id;
    $('#nombre-eliminar').textContent = producto.nombre;
    $('#dlg-eliminar').showModal();
  }
});

// Confirmación de eliminar
$('#confirmar-eliminar').addEventListener('click', () => {
  productos = productos.filter(p => p.id !== idAEliminar);
  guardarDatos('productos', productos);
  $('#dlg-eliminar').close();
  dibujar();
});

dibujar();
if (avisoPendiente() === 'producto') mostrarAviso('aviso-producto');
