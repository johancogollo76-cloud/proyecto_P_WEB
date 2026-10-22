/* ==========================================================
   usuarios.js · Lista de usuarios
   Crear y editar en un diálogo, buscar, activar/desactivar y eliminar.
   ========================================================== */
const form = $('#form-usuario');
let editando = null;   // usuario que se está editando (null = nuevo)

function tarjetaHTML(usuario) {
  return `
    <article class="tarjeta usuario" data-id="${usuario.id}">
      <div><strong>${esc(usuario.nombre)}</strong><small>${esc(usuario.correo)}</small></div>
      <span class="telefono">${usuario.telefono.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}</span>
      <span class="chip">${esc(usuario.rol)}</span>
      <span class="chip${usuario.estado === 'Activo' ? ' ok' : ''}">${usuario.estado}</span>
      <span class="registro">${usuario.registro}</span>
      <div class="acciones">
        <button class="editar" type="button" data-accion="editar" aria-label="Editar usuario">${icono('pencil')}</button>
        <button class="alternar" type="button" data-accion="alternar" aria-label="Activar o desactivar">${icono('power')}</button>
        <button class="eliminar" type="button" data-accion="eliminar" aria-label="Eliminar usuario">${icono('trash-2')}</button>
      </div>
    </article>`;
}

// Dibuja la lista; el buscador filtra por nombre, correo o rol
function dibujar() {
  const usuarios = listarRegistros('usuarios');
  const texto = $('#buscar-usuario').value;
  const visibles = usuarios.filter(usuario => coincideConBusqueda(texto, usuario.nombre, usuario.correo, usuario.rol));
  $('#lista-usuarios').innerHTML = visibles.map(tarjetaHTML).join('')
    || `<p class="vacio">${usuarios.length === 0
      ? 'Aún no hay usuarios. Crea el primero con el botón «Nuevo usuario».'
      : 'No hay usuarios que coincidan con la búsqueda.'}</p>`;
}
$('#buscar-usuario').addEventListener('input', dibujar);

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
  const usuario = buscarRegistro('usuarios', boton.closest('article').dataset.id);

  if (boton.dataset.accion === 'editar') {
    abrirDialogo(usuario);
  } else if (boton.dataset.accion === 'alternar') {
    alternarEstado('usuarios', usuario.id);
    dibujar();
  } else {
    confirmarEliminacion(usuario.nombre, () => {
      eliminarRegistro('usuarios', usuario.id);
      dibujar();
      mostrarAviso('aviso-usuario', 'Usuario eliminado correctamente.');
    });
  }
});

// El correo no se puede repetir
function verificarCorreo() {
  const repetido = existeValor('usuarios', 'correo', $('#u-correo').value, editando?.id);
  $('#u-correo').setCustomValidity(repetido ? 'Ya existe un usuario con ese correo.' : '');
}
$('#u-correo').addEventListener('input', verificarCorreo);
form.addEventListener('submit', verificarCorreo);   // debe ir antes de activarValidacion

// Cuando el formulario es válido
function guardarUsuario() {
  const datos = Object.fromEntries(new FormData(form));
  if (editando) {
    actualizarRegistro('usuarios', editando.id, datos);
  } else {
    crearRegistro('usuarios', { estado: 'Activo', registro: `Registrado ${fechaDeHoy()}`, ...datos });
  }
  $('#dlg-usuario').close();
  dibujar();
  mostrarAviso('aviso-usuario', 'Usuario guardado correctamente.');
}
activarValidacion(form, guardarUsuario);

dibujar();
