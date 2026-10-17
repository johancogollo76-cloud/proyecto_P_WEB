/* ==========================================================
   app.js · Interactividad de MotoWorks (JavaScript puro)
   ----------------------------------------------------------
   1. Utilidades
   2. Iconos
   3. Navegación entre secciones
   4. Botones con acciones (abrir/cerrar diálogos, eliminar, activar)
   5. Filtros del inventario
   6. Productos y usuarios en memoria (crear, editar, dibujar filas)
   7. Validación de formularios
   ========================================================== */

/* 1. UTILIDADES ------------------------------------------- */
const $  = (selector, contexto = document) => contexto.querySelector(selector);
const $$ = (selector, contexto = document) => [...contexto.querySelectorAll(selector)];

/* 2. ICONOS ------------------------------------------------
   En el HTML se escribe <i data-icono="plus"></i> y aquí se
   reemplaza por el SVG correspondiente. */
const ICONOS = {
  'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  'package': '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="m7.5 4.27 9 5.15"/>',
  'receipt-text': '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M14 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>',
  'wallet-cards': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"/><path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.6 1.3-.9 2.1-.9H21"/>',
  'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'circle-pause': '<circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/>',
  'shopping-cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  'chart-no-axes-combined': '<path d="M12 16v5"/><path d="M16 14v7"/><path d="M20 10v11"/><path d="m22 3-8.65 8.65a.5.5 0 0 1-.7 0L9.35 8.35a.5.5 0 0 0-.7 0L2 15"/><path d="M4 18v3"/><path d="M8 14v7"/>',
  'wallet': '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'scan-barcode': '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 7v10"/><path d="M12 7v10"/><path d="M17 7v10"/>',
  'receipt': '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
  'boxes': '<path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0z"/><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3z"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5z"/>',
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'sliders-horizontal': '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  'eye': '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
  'pencil': '<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/>',
  'power': '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
  'trash-2': '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  'upload': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  'save': '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  'triangle-alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'circle-alert': '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  'menu': '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>'
};

function pintarIconos(raiz = document) {
  $$('[data-icono]', raiz).forEach(el => {
    const trazo = ICONOS[el.dataset.icono];
    if (trazo) el.outerHTML = `<svg class="ico ${el.className}" viewBox="0 0 24 24" aria-hidden="true">${trazo}</svg>`;
  });
}

/* 3. NAVEGACIÓN ENTRE SECCIONES ----------------------------
   Cada <section class="vista"> tiene un id. El enlace
   <a href="#inventario"> muestra la sección con ese id. */
function mostrarVista() {
  let vista = document.getElementById(location.hash.slice(1));
  if (!vista || !vista.classList.contains('vista')) vista = $('#inicio');

  $$('.vista').forEach(v => (v.hidden = v !== vista));
  $$('.menu a[data-seccion]').forEach(a =>
    a.classList.toggle('activo', a.dataset.seccion === vista.dataset.seccion));

  document.body.classList.remove('menu-abierto');
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', mostrarVista);

// Menú lateral en tableta y celular
$('#btn-menu').addEventListener('click', () => document.body.classList.toggle('menu-abierto'));
$('#velo').addEventListener('click', () => document.body.classList.remove('menu-abierto'));

/* 4. BOTONES CON ACCIONES ----------------------------------
   Se identifican con atributos data-* en el HTML:
   data-abrir="id"   abre el diálogo con ese id
   data-cerrar       cierra el diálogo donde está el botón
   data-eliminar     pide confirmación para borrar la fila
   data-alternar     activa o desactiva el elemento
   data-modo         prepara el formulario (nuevo / editar)  */
let filaAEliminar = null;
let itemEditando = null;   // fila/tarjeta que se está editando (null = creando una nueva)

document.addEventListener('click', e => {
  const boton = e.target.closest('[data-abrir], [data-cerrar], [data-eliminar], [data-alternar], [data-modo]');
  if (!boton) return;
  const d = boton.dataset;

  // Si el botón está dentro de una fila o tarjeta, esa es la que se edita; si no, se crea una nueva
  if (d.abrir || 'modo' in d) itemEditando = d.sku ? buscarFilaPorSku(d.sku) : boton.closest('[data-item]');
  if (d.abrir === 'dlg-usuario') prepararUsuario(itemEditando);
  if (d.abrir) document.getElementById(d.abrir).showModal();
  if ('cerrar' in d) boton.closest('dialog').close();
  if ('modo' in d) prepararFormulario(itemEditando);

  if ('eliminar' in d) {
    filaAEliminar = boton.closest('[data-item]');
    $('#nombre-eliminar').textContent = filaAEliminar.dataset.nombre;
    $('#dlg-eliminar').showModal();
  }

  if ('alternar' in d) {
    const chip = $('.estado', boton.closest('[data-item]'));
    const activo = chip.classList.toggle('ok');
    chip.textContent = activo ? 'Activo' : 'Inactivo';
    filtrarInventario();
  }
});

$('#confirmar-eliminar').addEventListener('click', () => {
  filaAEliminar?.remove();
  $('#dlg-eliminar').close();
  filtrarInventario();
});

// Cerrar un diálogo al hacer clic fuera de él, y limpiar su formulario al cerrarse
$$('dialog').forEach(dialogo => {
  dialogo.addEventListener('click', e => { if (e.target === dialogo) dialogo.close(); });
  dialogo.addEventListener('close', () => $('form', dialogo)?.reset());
});

/* 5. FILTROS DEL INVENTARIO --------------------------------- */
function filtrarInventario() {
  const texto = $('#buscar').value.toLowerCase();
  const categoria = $('#filtro-categoria').value;
  const estado = $('#filtro-estado').value;
  let visibles = 0;

  $$('#inventario tbody tr').forEach(fila => {
    const coincide =
      fila.textContent.toLowerCase().includes(texto) &&
      (!categoria || fila.dataset.categoria === categoria) &&
      (!estado || $('.estado', fila).textContent === estado);
    fila.hidden = !coincide;
    if (coincide) visibles++;
  });
  $('#sin-resultados').hidden = visibles > 0;
}
['#buscar', '#filtro-categoria', '#filtro-estado'].forEach(id =>
  $(id).addEventListener('input', filtrarInventario));

/* 6. PRODUCTOS Y USUARIOS EN MEMORIA -------------------------
   Los datos solo existen mientras la página está abierta: se dibujan
   directamente en el DOM (no se usa localStorage ni nada que guarde).
   Al recargar la página vuelven los datos de ejemplo del HTML. */
const esc = texto => String(texto).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dinero = n => '$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/* ---------- Productos ---------- */

// Lee los datos de una fila de la tabla (para rellenar el formulario al editar)
function datosDeFila(fila) {
  const celda = etiqueta => $(`[data-label="${etiqueta}"]`, fila).textContent.trim();
  const precio = celda('Precio').replace(/\D/g, '');
  return {
    nombre: fila.dataset.nombre,
    sku: $('small', fila).textContent,
    categoria: fila.dataset.categoria,
    marca: celda('Marca'),
    precio,
    stock: celda('Stock'),
    estado: $('.estado', fila).textContent,
    // Datos que la tabla no muestra: si la fila es de ejemplo, se usan valores por defecto
    proveedor: fila.dataset.proveedor || 'Motopartes S.A.S.',
    costo: fila.dataset.costo || Math.round(precio * 0.75),
    minimo: fila.dataset.minimo || 5,
    modelo: fila.dataset.modelo || 'Universal',
    descripcion: fila.dataset.descripcion || ''
  };
}

// Construye una fila de la tabla a partir de los datos del formulario
function crearFila(p) {
  const fila = document.createElement('tr');
  const stock = Math.round(Number(p.stock));
  Object.assign(fila.dataset, {
    item: '', nombre: p.nombre, categoria: p.categoria, proveedor: p.proveedor,
    costo: p.costo, minimo: p.minimo, modelo: p.modelo, descripcion: p.descripcion, imagen: p.imagen
  });
  fila.innerHTML = `
    <td><div class="producto"><span class="miniatura"><i data-icono="package"></i></span><div><strong>${esc(p.nombre)}</strong><small>${esc(p.sku)}</small></div></div></td>
    <td data-label="Categoría">${esc(p.categoria)}</td>
    <td data-label="Marca">${esc(p.marca)}</td>
    <td data-label="Precio">${dinero(p.precio)}</td>
    <td data-label="Stock"${stock <= Number(p.minimo) ? ' class="bajo"' : ''}>${stock}</td>
    <td data-label="Estado"><span class="chip estado${p.estado === 'Activo' ? ' ok' : ''}">${esc(p.estado)}</span></td>
    <td><div class="acciones">
      <a class="ver" href="#producto-detalle" aria-label="Ver detalle"><i data-icono="eye"></i></a>
      <a class="editar" href="#producto-form" data-modo="editar" aria-label="Editar"><i data-icono="pencil"></i></a>
      <button class="alternar" type="button" data-alternar aria-label="Activar o desactivar"><i data-icono="power"></i></button>
      <button class="eliminar" type="button" data-eliminar aria-label="Eliminar"><i data-icono="trash-2"></i></button>
    </div></td>`;
  if (p.imagen) {
    const miniatura = $('.miniatura', fila);
    miniatura.style.backgroundImage = p.imagen;
    miniatura.classList.add('con-imagen');
  }
  return fila;
}

function buscarFilaPorSku(sku) {
  return $$('#inventario tbody tr').find(fila => $('small', fila).textContent === sku) || null;
}

// Deja el formulario vacío (nuevo) o con los datos de la fila (editar)
function prepararFormulario(fila) {
  const form = $('#form-producto');
  form.reset();
  $('#titulo-form').textContent = fila ? 'Editar producto' : 'Agregar producto';
  $('#miga-form').textContent = fila ? 'Editar producto' : 'Nuevo producto';
  if (fila) {
    Object.entries(datosDeFila(fila)).forEach(([campo, valor]) => (form.elements[campo].value = valor));
    if (fila.dataset.imagen) mostrarVistaPrevia(fila.dataset.imagen);
  }
  verificarSku();
}

// Al guardar: reemplaza la fila editada o agrega una nueva al inicio de la tabla
function guardarProducto(form) {
  const datos = Object.fromEntries(new FormData(form));
  datos.imagen = $('#vista-previa').style.backgroundImage;
  const fila = crearFila(datos);

  if (itemEditando) itemEditando.replaceWith(fila);
  else $('#inventario tbody').prepend(fila);

  pintarIconos(fila);
  ['#buscar', '#filtro-categoria', '#filtro-estado'].forEach(id => ($(id).value = ''));
  filtrarInventario();
}

// El SKU no se puede repetir (se ignora la fila que se está editando)
function verificarSku() {
  const sku = $('#sku');
  const repetido = $$('#inventario tbody tr').some(f => f !== itemEditando && $('small', f).textContent === sku.value.trim());
  sku.setCustomValidity(repetido ? 'Ya existe un producto con este SKU.' : '');
}
$('#sku').addEventListener('input', verificarSku);
$('#form-producto').addEventListener('submit', verificarSku);

// Imagen del producto: botón, vista previa y limpieza al reiniciar
function mostrarVistaPrevia(imagen) {
  const caja = $('#vista-previa');
  caja.style.backgroundImage = imagen;
  caja.classList.add('con-imagen');
}
$('#btn-imagen').addEventListener('click', () => $('#archivo-imagen').click());
$('#archivo-imagen').addEventListener('change', e => {
  const archivo = e.target.files[0];
  if (archivo) mostrarVistaPrevia(`url(${URL.createObjectURL(archivo)})`);
});
$('#form-producto').addEventListener('reset', () => {
  $('#vista-previa').style.backgroundImage = '';
  $('#vista-previa').classList.remove('con-imagen');
});

/* ---------- Usuarios ---------- */

function datosDeUsuario(tarjeta) {
  return {
    nombre: $('strong', tarjeta).textContent,
    correo: $('small', tarjeta).textContent,
    telefono: $('.telefono', tarjeta).textContent.replace(/\D/g, ''),
    rol: $('.chip:not(.estado)', tarjeta).textContent,
    estado: $('.estado', tarjeta).textContent,
    registro: $('.registro', tarjeta).textContent
  };
}

function crearUsuario(u) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta usuario';
  tarjeta.dataset.item = '';
  tarjeta.innerHTML = `
    <div><strong>${esc(u.nombre)}</strong><small>${esc(u.correo)}</small></div>
    <span class="telefono">${u.telefono.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}</span>
    <span class="chip">${esc(u.rol)}</span>
    <span class="chip estado${u.estado === 'Activo' ? ' ok' : ''}">${u.estado}</span>
    <span class="registro">${u.registro}</span>
    <div class="acciones">
      <button class="editar" type="button" data-abrir="dlg-usuario" aria-label="Editar usuario"><i data-icono="pencil"></i></button>
      <button class="alternar" type="button" data-alternar aria-label="Activar o desactivar"><i data-icono="power"></i></button>
    </div>`;
  return tarjeta;
}

function prepararUsuario(tarjeta) {
  const form = $('#form-usuario');
  form.reset();
  $('#titulo-usuario').textContent = tarjeta ? 'Editar usuario' : 'Nuevo usuario';
  if (tarjeta) Object.entries(datosDeUsuario(tarjeta)).forEach(([campo, valor]) => { if (form.elements[campo]) form.elements[campo].value = valor; });
}

function guardarUsuario(form) {
  const hoy = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '');
  const anterior = itemEditando ? datosDeUsuario(itemEditando) : {};
  const tarjeta = crearUsuario({
    ...Object.fromEntries(new FormData(form)),
    estado: anterior.estado || 'Activo',
    registro: anterior.registro || `Registrado ${hoy}`
  });
  if (itemEditando) itemEditando.replaceWith(tarjeta);
  else $('.lista-usuarios').prepend(tarjeta);
  pintarIconos(tarjeta);
}

/* 7. VALIDACIÓN DE FORMULARIOS -------------------------------
   Todo formulario con el atributo data-validar se valida al enviar.
   Las reglas (required, pattern, min, type="email"...) se escriben
   en el HTML; aquí solo se traducen a mensajes en la página. */
function mensajeError(campo) {
  const v = campo.validity;
  if (v.valid) return '';
  if (v.valueMissing) return 'Este campo es obligatorio.';
  if (v.typeMismatch) return 'Ingresa un correo válido, por ejemplo nombre@correo.com.';
  if (v.patternMismatch) return campo.dataset.error || 'El formato no es válido.';
  if (v.tooShort) return `Escribe al menos ${campo.minLength} caracteres.`;
  if (v.rangeUnderflow) return `El valor mínimo es ${campo.min}.`;
  if (v.stepMismatch || v.badInput) return 'Ingresa un número entero válido.';
  return campo.validationMessage;
}

// Muestra (o quita) el mensaje de error debajo del campo
function marcarCampo(campo, mensaje) {
  const caja = campo.closest('.campo');
  $('.error', caja)?.remove();
  campo.removeAttribute('aria-invalid');
  if (!mensaje) return;

  campo.setAttribute('aria-invalid', 'true');
  const aviso = document.createElement('p');
  aviso.className = 'error';
  aviso.setAttribute('role', 'alert');
  aviso.innerHTML = '<i data-icono="circle-alert"></i><span></span>';
  $('span', aviso).textContent = mensaje;
  caja.append(aviso);
  pintarIconos(aviso);
}

function limpiarErrores(form) {
  $$('[aria-invalid]', form).forEach(c => marcarCampo(c, ''));
  $('.resumen-errores', form).hidden = true;
}

// Qué pasa cuando el formulario es válido (por ahora no se guarda nada)
function mostrarExito(form) {
  const aviso = document.getElementById(form.dataset.exito);
  ({ 'form-producto': guardarProducto, 'form-usuario': guardarUsuario })[form.id](form);   // dibuja/actualiza la fila
  form.reset();
  form.closest('dialog')?.close();
  if (form.dataset.destino) location.hash = form.dataset.destino;
  aviso.hidden = false;
  setTimeout(() => (aviso.hidden = true), 5000);
}

$$('form[data-validar]').forEach(form => {
  const campos = $$('input:not([type=file]), select, textarea', form);

  form.addEventListener('submit', e => {
    e.preventDefault();
    let errores = 0;
    campos.forEach(campo => {
      const mensaje = mensajeError(campo);
      marcarCampo(campo, mensaje);
      if (mensaje) errores++;
    });

    const resumen = $('.resumen-errores', form);
    resumen.hidden = errores === 0;
    if (errores) {
      $('span', resumen).textContent = errores === 1
        ? 'Hay 1 campo con error. Corrígelo para continuar.'
        : `Hay ${errores} campos con errores. Corrígelos para continuar.`;
      $('[aria-invalid]', form).focus();
    } else {
      mostrarExito(form);
    }
  });

  // Al corregir un campo marcado, el error se actualiza al instante
  campos.forEach(campo => campo.addEventListener('input', () => {
    if (campo.hasAttribute('aria-invalid')) marcarCampo(campo, mensajeError(campo));
  }));

  form.addEventListener('reset', () => limpiarErrores(form));
});

/* INICIO ---------------------------------------------------- */
pintarIconos();
mostrarVista();
