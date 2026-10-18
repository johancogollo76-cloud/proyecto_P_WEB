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
const items = leerDatos(tabla);
const productos = leerDatos('productos');
const form = $('#form-catalogo');
let editando = null;     // registro que se edita (null = se está creando uno nuevo)
let idAEliminar = null;

// Cuántos productos usan este registro
const usos = item => productos.filter(p => p[campo] === item.nombre).length;

function tarjetaHTML(i) {
  const n = usos(i);
  return `
    <article class="tarjeta item-catalogo" data-id="${i.id}">
      <div><strong>${esc(i.nombre)}</strong><small>${esc(i.extra || 'Sin información adicional')}</small></div>
      <span class="chip${n ? ' ok' : ''}">${n} ${n === 1 ? 'producto' : 'productos'}</span>
      <div class="acciones">
        <button class="editar" type="button" data-accion="editar" aria-label="Editar">${icono('pencil')}</button>
        <button class="eliminar" type="button" data-accion="eliminar" aria-label="Eliminar">${icono('trash-2')}</button>
      </div>
    </article>`;
}

function dibujar() {
  $('#lista-catalogo').innerHTML = items.map(tarjetaHTML).join('')
    || '<p class="vacio">Aún no hay registros. Crea el primero con el botón de arriba.</p>';
}

/* Abrir la ventana: vacía (nuevo) o con los datos del registro (editar) */
const dialogo = $('#dlg-catalogo');
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
  const item = items.find(i => i.id === boton.closest('article').dataset.id);

  if (boton.dataset.accion === 'editar') {
    abrirDialogo(item);
  } else if (usos(item) > 0) {
    // Regla: no se elimina algo que tiene productos
    mostrarAviso('aviso-error', `No se puede eliminar «${item.nombre}»: lo usan ${usos(item)} producto(s). Cámbialos primero.`);
  } else {
    idAEliminar = item.id;
    $('#nombre-eliminar').textContent = item.nombre;
    $('#dlg-eliminar').showModal();   // pide confirmación
  }
});

$('#confirmar-eliminar').addEventListener('click', () => {
  items.splice(items.findIndex(i => i.id === idAEliminar), 1);
  guardarDatos(tabla, items);
  $('#dlg-eliminar').close();
  dibujar();
  mostrarAviso('aviso-catalogo', 'Eliminado correctamente.');
});

/* El nombre no se puede repetir */
function verificarNombre() {
  const nombre = $('#cat-nombre').value.trim().toLowerCase();
  const repetido = items.some(i => i !== editando && i.nombre.toLowerCase() === nombre);
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
    productos.forEach(p => { if (p[campo] === editando.nombre) p[campo] = nombre; });
    guardarDatos('productos', productos);
    Object.assign(editando, { nombre, extra });
  } else {
    items.unshift({ id: tabla[0] + Date.now(), nombre, extra });
  }

  guardarDatos(tabla, items);
  dialogo.close();
  dibujar();
  mostrarAviso('aviso-catalogo', 'Guardado correctamente.');
}
activarValidacion(form, guardarItem);

dibujar();
