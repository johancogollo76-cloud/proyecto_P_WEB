/* ==========================================================
   comun.js · Código compartido por TODAS las páginas
   ----------------------------------------------------------
   1. Utilidades
   2. Iconos
   3. Menú lateral (se dibuja aquí para no repetirlo en cada HTML)
   4. Diálogos (ventanas emergentes)
   5. Validación de formularios
   ========================================================== */

/* 1. UTILIDADES ------------------------------------------- */
const $  = (selector, contexto = document) => contexto.querySelector(selector);
const $$ = (selector, contexto = document) => [...contexto.querySelectorAll(selector)];

// Convierte texto en HTML seguro (evita que lo escrito en un formulario se ejecute como código)
const esc = texto => String(texto).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// $7,4 M  (para los contadores del dashboard)
const dineroCorto = n => n >= 1000000 ? '$' + (n / 1000000).toFixed(1).replace('.', ',') + ' M' : dinero(n);
const dinero = n => '$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

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
}

/* 5. VALIDACIÓN DE FORMULARIOS -------------------------------
   Las reglas (required, pattern, min, type="email"...) se escriben en
   el HTML; aquí solo se traducen a mensajes que aparecen en la página.
   Uso:  activarValidacion(formulario, funcionQueGuarda)             */
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

function activarValidacion(form, alValidar) {
  const campos = $$('input:not([type=file]), select, textarea', form);
  const resumen = $('.resumen-errores', form);

  form.addEventListener('submit', e => {
    e.preventDefault();
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
    if (campo.hasAttribute('aria-invalid')) marcarCampo(campo, mensajeError(campo));
  }));

  form.addEventListener('reset', () => {
    $$('[aria-invalid]', form).forEach(c => marcarCampo(c, ''));
    resumen.hidden = true;
  });
}

/* INICIO ---------------------------------------------------- */
dibujarMenu();
activarDialogos();
