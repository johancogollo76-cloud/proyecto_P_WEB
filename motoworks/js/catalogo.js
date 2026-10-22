/* ==========================================================
   catalogo.js · Categorías, marcas y proveedores
   ----------------------------------------------------------
   Las tres páginas funcionan igual, así que usan este mismo script.
   Cada página dice cuál es con atributos en su <body>:
     data-tabla="marcas"        → nombre de la lista en datos.js
     data-campo="marca"         → campo del producto que usa esta lista
     data-articulo="una marca"  → para los mensajes
   ========================================================== */
const { tabla, campo, articulo } = document.body.dataset;
const form = $('#form-catalogo');
const dialogo = $('#dlg-catalogo');
let editando = null;     // registro que se edita (null = se está creando uno nuevo)

// Cuántos productos usan este registro
const cantidadDeProductos = item => productosQueUsan(campo, item.nombre).length;

function tarjetaHTML(item) {
  const cantidad = cantidadDeProductos(item);
  return `
    <article class="tarjeta item-catalogo" data-id="${item.id}">
      <div><strong>${esc(item.nombre)}</strong><small>${esc(item.extra || 'Sin información adicional')}</small></div>
      <span class="chip${cantidad ? ' ok' : ''}">${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}</span>
      <div class="acciones">
        <button class="editar" type="button" data-accion="editar" aria-label="Editar">${icono('pencil')}</button>
        <button class="eliminar" type="button" data-accion="eliminar" aria-label="Eliminar">${icono('trash-2')}</button>
      </div>
    </article>`;
}

// Dibuja la lista; el buscador filtra por nombre o descripción
function dibujar() {
  const items = listarRegistros(tabla);
  const texto = $('#buscar-catalogo').value;
  const visibles = items.filter(item => coincideConBusqueda(texto, item.nombre, item.extra || ''));
  $('#lista-catalogo').innerHTML = visibles.map(tarjetaHTML).join('')
    || `<p class="vacio">${items.length === 0
      ? 'Aún no hay registros. Crea el primero con el botón de arriba.'
      : 'No hay registros que coincidan con la búsqueda.'}</p>`;
}
$('#buscar-catalogo').addEventListener('input', dibujar);

/* Abrir la ventana: vacía (nuevo) o con los datos del registro (editar) */
function abrirDialogo(item) {
  editando = item;
  form.reset();
  $('#titulo-dialogo').textContent = item ? dialogo.dataset.editar : dialogo.dataset.nuevo;
  if (item) { $('#cat-nombre').value = item.nombre; $('#cat-extra').value = item.extra || ''; }
  dialogo.showModal();
}
$('#nuevo-item').addEventListener('click', () => abrirDialogo(null));

/* Botones de cada tarjeta */
$('#lista-catalogo').addEventListener('click', e => {
  const boton = e.target.closest('[data-accion]');
  if (!boton) return;
  const item = buscarRegistro(tabla, boton.closest('article').dataset.id);

  if (boton.dataset.accion === 'editar') {
    abrirDialogo(item);
  } else if (cantidadDeProductos(item) > 0) {
    // Regla: no se elimina algo que tiene productos
    mostrarAviso('aviso-error', `No se puede eliminar «${item.nombre}»: lo usan ${cantidadDeProductos(item)} producto(s). Cámbialos primero.`);
  } else {
    confirmarEliminacion(item.nombre, () => {
      eliminarRegistro(tabla, item.id);
      dibujar();
      mostrarAviso('aviso-catalogo', 'Eliminado correctamente.');
    });
  }
});

/* El nombre no se puede repetir */
function verificarNombre() {
  const repetido = existeValor(tabla, 'nombre', $('#cat-nombre').value, editando?.id);
  $('#cat-nombre').setCustomValidity(repetido ? `Ya existe ${articulo} con ese nombre.` : '');
}
$('#cat-nombre').addEventListener('input', verificarNombre);
form.addEventListener('submit', verificarNombre);   // debe ir antes de activarValidacion

/* Guardar: crea uno nuevo o actualiza el que se editaba */
function guardarItem() {
  const nombre = $('#cat-nombre').value.trim();
  const extra = $('#cat-extra').value.trim();

  if (editando) {
    // Si cambió el nombre, se actualiza también en los productos que lo usaban
    renombrarEnProductos(campo, editando.nombre, nombre);
    actualizarRegistro(tabla, editando.id, { nombre, extra });
  } else {
    crearRegistro(tabla, { nombre, extra });
  }

  dialogo.close();
  dibujar();
  mostrarAviso('aviso-catalogo', 'Guardado correctamente.');
}
activarValidacion(form, guardarItem);

dibujar();
