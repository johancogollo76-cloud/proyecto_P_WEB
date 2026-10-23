/* ==========================================================
   CONTROLADOR · usuarios.js
   ========================================================== */
let usuarioEnEdicion = null;   // usuario que se está editando (null = nuevo)

function mostrarLista() {
  const usuarios = buscarPorTexto('usuarios', VistaUsuarios.leerBusqueda(), ['nombre', 'correo', 'rol']);
  VistaUsuarios.mostrarUsuarios(usuarios, listarRegistros('usuarios').length > 0);
}

function abrirNuevo() {
  usuarioEnEdicion = null;
  VistaUsuarios.abrirDialogo(null);
}

function eliminarUsuario(usuario) {
  eliminarRegistro('usuarios', usuario.id);
  mostrarLista();
  VistaComun.mostrarAviso('aviso-usuario', 'Usuario eliminado correctamente.');
}

function atenderAccion(accion, id) {
  const usuario = buscarRegistro('usuarios', id);
  if (accion === 'editar') {
    usuarioEnEdicion = usuario;
    VistaUsuarios.abrirDialogo(usuario);
  } else if (accion === 'alternar') {
    alternarEstado('usuarios', id);
    mostrarLista();
  } else {
    VistaComun.confirmarEliminacion(usuario.nombre, () => eliminarUsuario(usuario));
  }
}

function guardarUsuario() {
  const datos = VistaUsuarios.leerFormulario();
  if (usuarioEnEdicion) {
    actualizarRegistro('usuarios', usuarioEnEdicion.id, datos);
  } else {
    crearRegistro('usuarios', { estado: 'Activo', registro: `Registrado ${fechaDeHoy()}`, ...datos });
  }
  VistaUsuarios.cerrarDialogo();
  mostrarLista();
  VistaComun.mostrarAviso('aviso-usuario', 'Usuario guardado correctamente.');
}

// El correo no se puede repetir
const reglasDelFormulario = {
  '#u-correo': correo => existeValor('usuarios', 'correo', correo, usuarioEnEdicion?.id) ? 'Ya existe un usuario con ese correo.' : ''
};

function iniciar() {
  VistaUsuarios.alBuscar(mostrarLista);
  VistaUsuarios.alPulsarNuevo(abrirNuevo);
  VistaUsuarios.alPulsarAccion(atenderAccion);
  VistaUsuarios.alGuardar(guardarUsuario, reglasDelFormulario);
  mostrarLista();
}
iniciar();
