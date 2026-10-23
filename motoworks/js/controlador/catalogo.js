/* ==========================================================
   CONTROLADOR · catalogo.js · Categorías, marcas y proveedores
   Un solo controlador para las tres páginas (principio DRY).
   ========================================================== */
const { tabla, campo, articulo } = VistaCatalogo.leerConfiguracion();
let itemEnEdicion = null;   // registro que se edita (null = se está creando uno nuevo)

const cantidadDeProductos = item => productosQueUsan(campo, item.nombre).length;

function mostrarLista() {
  const items = buscarPorTexto(tabla, VistaCatalogo.leerBusqueda(), ['nombre', 'extra'])
    .map(item => ({ ...item, cantidadProductos: cantidadDeProductos(item) }));
  VistaCatalogo.mostrarItems(items, listarRegistros(tabla).length > 0);
}

function abrirNuevo() {
  itemEnEdicion = null;
  VistaCatalogo.abrirDialogo(null);
}

function eliminarItem(item) {
  eliminarRegistro(tabla, item.id);
  mostrarLista();
  VistaComun.mostrarAviso('aviso-catalogo', 'Eliminado correctamente.');
}

function atenderAccion(accion, id) {
  const item = buscarRegistro(tabla, id);
  if (accion === 'editar') {
    itemEnEdicion = item;
    VistaCatalogo.abrirDialogo(item);
  } else if (cantidadDeProductos(item) > 0) {
    // Regla: no se elimina algo que tiene productos
    VistaComun.mostrarAviso('aviso-error', `No se puede eliminar «${item.nombre}»: lo usan ${cantidadDeProductos(item)} producto(s). Cámbialos primero.`);
  } else {
    VistaComun.confirmarEliminacion(item.nombre, () => eliminarItem(item));
  }
}

function guardarItem() {
  const datos = VistaCatalogo.leerFormulario();
  if (itemEnEdicion) {
    // Si cambió el nombre, se actualiza también en los productos que lo usaban
    renombrarEnProductos(campo, itemEnEdicion.nombre, datos.nombre);
    actualizarRegistro(tabla, itemEnEdicion.id, datos);
  } else {
    crearRegistro(tabla, datos);
  }
  VistaCatalogo.cerrarDialogo();
  mostrarLista();
  VistaComun.mostrarAviso('aviso-catalogo', 'Guardado correctamente.');
}

// El nombre no se puede repetir
const reglasDelFormulario = {
  '#cat-nombre': nombre => existeValor(tabla, 'nombre', nombre, itemEnEdicion?.id) ? `Ya existe ${articulo} con ese nombre.` : ''
};

function iniciar() {
  VistaCatalogo.alBuscar(mostrarLista);
  VistaCatalogo.alPulsarNuevo(abrirNuevo);
  VistaCatalogo.alPulsarAccion(atenderAccion);
  VistaCatalogo.alGuardar(guardarItem, reglasDelFormulario);
  mostrarLista();
}
iniciar();
