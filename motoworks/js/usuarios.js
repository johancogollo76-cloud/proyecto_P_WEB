/* ==========================================================
   usuarios.js · Lista de usuarios
   Crear y editar en un diálogo, activar/desactivar.
   ========================================================== */
const usuarios = leerDatos('usuarios');
const form = $('#form-usuario');
let editando = null;   // usuario que se está editando (null = nuevo)

function tarjetaHTML(u) {
  return `
    <article class="tarjeta usuario" data-id="${u.id}">
      <div><strong>${esc(u.nombre)}</strong><small>${esc(u.correo)}</small></div>
      <span class="telefono">${u.telefono.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}</span>
      <span class="chip">${esc(u.rol)}</span>
      <span class="chip${u.estado === 'Activo' ? ' ok' : ''}">${u.estado}</span>
      <span class="registro">${u.registro}</span>
      <div class="acciones">
        <button class="editar" type="button" data-accion="editar" aria-label="Editar usuario">${icono('pencil')}</button>
        <button class="alternar" type="button" data-accion="alternar" aria-label="Activar o desactivar">${icono('power')}</button>
      </div>
    </article>`;
}

function dibujar() {
  $('#lista-usuarios').innerHTML = usuarios.map(tarjetaHTML).join('');
}

// Abre el diálogo vacío (nuevo) o con los datos del usuario (editar)
function abrirDialogo(usuario) {
  editando = usuario;
  form.reset();
  $('#titulo-usuario').textContent = usuario ? 'Editar usuario' : 'Nuevo usuario';
  if (usuario) $$('[name]', form).forEach(campo => (campo.value = usuario[campo.name]));
  $('#dlg-usuario').showModal();
}
$('#nuevo-usuario').addEventListener('click', () => abrirDialogo(null));

$('#lista-usuarios').addEventListener('click', e => {
  const boton = e.target.closest('[data-accion]');
  if (!boton) return;
  const usuario = usuarios.find(u => u.id === boton.closest('article').dataset.id);

  if (boton.dataset.accion === 'editar') {
    abrirDialogo(usuario);
  } else {
    usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
    guardarDatos('usuarios', usuarios);
    dibujar();
  }
});

// Cuando el formulario es válido
function guardarUsuario() {
  const datos = Object.fromEntries(new FormData(form));
  if (editando) {
    Object.assign(editando, datos);
  } else {
    const hoy = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '');
    usuarios.unshift({ id: 'u' + Date.now(), estado: 'Activo', registro: `Registrado ${hoy}`, ...datos });
  }
  guardarDatos('usuarios', usuarios);
  $('#dlg-usuario').close();
  dibujar();
  mostrarAviso('aviso-usuario');
}
activarValidacion(form, guardarUsuario);

dibujar();
