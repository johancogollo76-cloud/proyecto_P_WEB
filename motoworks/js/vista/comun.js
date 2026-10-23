/* ==========================================================
   VISTA · comun.js · Lo que se ve, compartido por TODAS las páginas
   ----------------------------------------------------------
   La vista solo DIBUJA y LEE la pantalla. No guarda datos ni
   decide reglas: eso lo hacen el modelo y el controlador.

   1. Utilidades de pantalla
   2. Iconos
   3. Menú lateral (se dibuja aquí para no repetirlo en cada HTML)
   4. Diálogos (ventanas emergentes)
   5. Validación de formularios
   6. Confirmar eliminación
   7. VistaComun: lo que los controladores pueden usar
   ========================================================== */

/* 1. UTILIDADES DE PANTALLA ------------------------------- */
const $  = (selector, contexto = document) => contexto.querySelector(selector);
const $$ = (selector, contexto = document) => [...contexto.querySelectorAll(selector)];

// Convierte texto en HTML seguro (evita que lo escrito en un formulario se ejecute como código)
const esc = texto => String(texto).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Escribe un texto dentro del elemento con ese id
const poner = (id, texto) => { $('#' + id).textContent = texto; };

// Aviso verde de "guardado": la página anterior lo pide con ?aviso=algo en la dirección
function avisoPendiente() {
  const aviso = new URLSearchParams(location.search).get('aviso');
  try { history.replaceState(null, '', location.pathname); } catch (e) { /* no pasa nada */ }
  return aviso;
}
function mostrarAviso(id, texto) {
  const aviso = document.getElementById(id);
  if (texto) $('span', aviso).textContent = texto;   // texto opcional (el aviso debe tener un <span>)
  aviso.hidden = false;
  setTimeout(() => (aviso.hidden = true), 5000);
}

/* 2. ICONOS ------------------------------------------------
   Los dibujos (SVG) están al final de cada página HTML, dentro del
   "catálogo de iconos". icono('plus') devuelve el HTML que muestra
   el dibujo llamado "plus". */
const icono = nombre => `<svg class="ico"><use href="#${nombre}"></use></svg>`;

/* 3. MENÚ LATERAL -------------------------------------------
   Cada página indica su sección con <body data-seccion="inventario">
   y el enlace de esa sección se marca como activo. */
const MENU = [
  // [sección, página, icono, texto]   (sin página = aún no existe)
  ['inicio',      'index.html',       'layout-dashboard', 'Inicio'],
  ['inventario',  'inventario.html',  'package',          'Inventario'],
  ['categorias',  'categorias.html',  'tag',              'Categorías'],
  ['marcas',      'marcas.html',      'badge-check',      'Marcas'],
  ['proveedores', 'proveedores.html', 'truck',            'Proveedores'],
  ['ventas',      'ventas.html',      'receipt-text',     'Ventas'],
  ['usuarios',    'usuarios.html',    'users',            'Usuarios'],
  [null,          null,               'wallet-cards',     'Pagos'],
  [null,          null,               'settings',         'Ajustes']
];

function dibujarMenu() {
  const actual = document.body.dataset.seccion;
  const enlaces = MENU.map(([seccion, pagina, dibujo, texto]) => pagina
    ? `<a href="${pagina}"${seccion === actual ? ' class="activo"' : ''}>${icono(dibujo)}${texto}</a>`
    : `<a class="pendiente" title="No incluida en esta entrega">${icono(dibujo)}${texto}</a>`
  ).join('');

  document.body.insertAdjacentHTML('afterbegin', '<div class="velo" id="velo"></div>');
  $('.app').insertAdjacentHTML('afterbegin', `
    <aside class="lateral">
      <a class="marca" href="index.html">
        <span class="marca-logo">MW</span>
        <span><strong>MOTOWORKS</strong><small>Repuestos y taller</small></span>
      </a>
      <nav class="menu">${enlaces}</nav>
      <div class="admin"><span class="avatar">CR</span><div><strong>Carlos Ruiz</strong><small>Administrador</small></div></div>
    </aside>`);
  $('.contenido').insertAdjacentHTML('afterbegin', `
    <header class="barra-movil">
      <button type="button" id="btn-menu" aria-label="Abrir menú">${icono('menu')}</button>
      <strong>MOTOWORKS</strong>
    </header>`);

  // En tableta y celular el menú se abre y cierra con el botón ☰
  $('#btn-menu').addEventListener('click', () => document.body.classList.toggle('menu-abierto'));
  $('#velo').addEventListener('click', () => document.body.classList.remove('menu-abierto'));
}

/* 4. DIÁLOGOS -----------------------------------------------
   Se cierran con el botón [data-cerrar] o haciendo clic fuera,
   y al cerrarse limpian su formulario. */
function activarDialogos() {
  $$('dialog').forEach(dialogo => {
    dialogo.addEventListener('click', e => { if (e.target === dialogo) dialogo.close(); });
    dialogo.addEventListener('close', () => $('form', dialogo)?.reset());
  });
  document.addEventListener('click', e => {
    const boton = e.target.closest('[data-cerrar]');
    if (boton) boton.closest('dialog').close();
  });
  $('#confirmar-eliminar')?.addEventListener('click', () => {
    $('#dlg-eliminar').close();
    accionConfirmada();
  });
}

/* 5. VALIDACIÓN DE FORMULARIOS -------------------------------
   Las reglas (required, pattern, min, type="email"...) se escriben en
   el HTML; aquí solo se traducen a mensajes que aparecen en la página.
   Uso:  activarValidacion(formulario, funcionQueGuarda, reglasExtra)

   reglasExtra (opcional) son reglas que no se pueden escribir en el HTML,
   como "este nombre ya existe". Las da el controlador así:
     { '#sku': valor => (yaExiste(valor) ? 'Ese SKU ya existe.' : '') }
   Cada regla devuelve un texto de error, o '' si el valor está bien.   */
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
  aviso.innerHTML = icono('circle-alert') + '<span></span>';
  $('span', aviso).textContent = mensaje;
  caja.append(aviso);
}

function activarValidacion(form, alValidar, reglasExtra = {}) {
  const campos = $$('input:not([type=file]), select, textarea', form);
  const resumen = $('.resumen-errores', form);

  const aplicarReglasExtra = () => Object.entries(reglasExtra).forEach(([selector, regla]) => {
    const campo = $(selector, form);
    campo.setCustomValidity(regla(campo.value));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    aplicarReglasExtra();
    let errores = 0;
    campos.forEach(campo => {
      const mensaje = mensajeError(campo);
      marcarCampo(campo, mensaje);
      if (mensaje) errores++;
    });

    resumen.hidden = errores === 0;
    if (errores) {
      $('span', resumen).textContent = errores === 1
        ? 'Hay 1 campo con error. Corrígelo para continuar.'
        : `Hay ${errores} campos con errores. Corrígelos para continuar.`;
      $('[aria-invalid]', form).focus();
    } else {
      alValidar(form);
    }
  });

  // Al corregir un campo marcado, el error se actualiza al instante
  campos.forEach(campo => campo.addEventListener('input', () => {
    aplicarReglasExtra();
    campos.filter(otro => otro.hasAttribute('aria-invalid')).forEach(otro => marcarCampo(otro, mensajeError(otro)));
  }));

  form.addEventListener('reset', () => {
    $$('[aria-invalid]', form).forEach(c => marcarCampo(c, ''));
    resumen.hidden = true;
  });
}

/* 6. CONFIRMAR ELIMINACIÓN -----------------------------------
   Todas las páginas con botón "Eliminar" usan esta función: abre el
   diálogo "¿Eliminar?" y SOLO si la persona confirma ejecuta lo que
   se le pase.
   El controlador dice QUÉ hacer si se confirma; la vista solo pregunta.
   Uso:  confirmarEliminacion(producto.nombre, () => { ...eliminar... }) */
let accionConfirmada = null;

function confirmarEliminacion(nombre, alConfirmar) {
  accionConfirmada = alConfirmar;
  $('#nombre-eliminar').textContent = nombre;
  $('#dlg-eliminar').showModal();
}

/* 7. VISTACOMUN ----------------------------------------------
   Lo que los controladores pueden pedirle a la vista en cualquier página. */
const leerParametro = nombre => new URLSearchParams(location.search).get(nombre);   // ?id=p1 → leerParametro('id')
const irA = pagina => { location.href = pagina; };

const VistaComun = { mostrarAviso, avisoPendiente, confirmarEliminacion, activarValidacion, leerParametro, irA };

/* INICIO ---------------------------------------------------- */
dibujarMenu();
activarDialogos();
