/* ==========================================================
   VISTA · usuarios.js · Lista de usuarios y su formulario
   ========================================================== */
const VistaUsuarios = {
  tarjetaHTML(usuario) {
    return `
      <article class="tarjeta usuario" data-id="${usuario.id}">
        <div><strong>${esc(usuario.nombre)}</strong><small>${esc(usuario.correo)}</small></div>
        <span class="telefono">${esc(usuario.telefono).replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}</span>
        <span class="chip">${esc(usuario.rol)}</span>
        <span class="chip${usuario.estado === 'Activo' ? ' ok' : ''}">${usuario.estado}</span>
        <span class="registro">${usuario.registro}</span>
        <div class="acciones">
          <button class="editar" type="button" data-accion="editar" aria-label="Editar usuario">${icono('pencil')}</button>
          <button class="alternar" type="button" data-accion="alternar" aria-label="Activar o desactivar">${icono('power')}</button>
          <button class="eliminar" type="button" data-accion="eliminar" aria-label="Eliminar usuario">${icono('trash-2')}</button>
        </div>
      </article>`;
  },

  mostrarUsuarios(usuarios, hayUsuariosGuardados) {
    $('#lista-usuarios').innerHTML = usuarios.map(usuario => VistaUsuarios.tarjetaHTML(usuario)).join('')
      || `<p class="vacio">${hayUsuariosGuardados
        ? 'No hay usuarios que coincidan con la búsqueda.'
        : 'Aún no hay usuarios. Crea el primero con el botón «Nuevo usuario».'}</p>`;
  },

  leerBusqueda() { return $('#buscar-usuario').value; },

  // Ventana de crear/editar: vacía (usuario = null) o con los datos del usuario
  abrirDialogo(usuario) {
    const form = $('#form-usuario');
    form.reset();
    $('#titulo-usuario').textContent = usuario ? 'Editar usuario' : 'Nuevo usuario';
    if (usuario) $$('[name]', form).forEach(campo => (campo.value = usuario[campo.name]));
    $('#dlg-usuario').showModal();
  },
  cerrarDialogo() { $('#dlg-usuario').close(); },
  leerFormulario() { return Object.fromEntries(new FormData($('#form-usuario'))); },

  // Eventos
  alBuscar(manejador) { $('#buscar-usuario').addEventListener('input', manejador); },
  alPulsarNuevo(manejador) { $('#nuevo-usuario').addEventListener('click', manejador); },
  alPulsarAccion(manejador) {
    $('#lista-usuarios').addEventListener('click', e => {
      const boton = e.target.closest('[data-accion]');
      if (boton) manejador(boton.dataset.accion, boton.closest('article').dataset.id);
    });
  },
  alGuardar(manejador, reglasExtra) { activarValidacion($('#form-usuario'), manejador, reglasExtra); }
};
