/* ==========================================================
   CONTROLADOR · producto-form.js · Agregar y editar producto
   Sin ?id= en la dirección se crea uno nuevo; con ?id=p1 se edita ese.
   ========================================================== */
const producto = buscarRegistro('productos', VistaComun.leerParametro('id')) || null;
let imagen = producto?.imagen || '';
let destino = null;   // qué lista se está ampliando con "+ Nuevo": { campo, tabla, titulo }

// Listas desplegables: salen de los módulos Categorías, Marcas y Proveedores
const LISTAS = { categoria: 'categorias', marca: 'marcas', proveedor: 'proveedores' };   // campo → lista de datos

function llenarListas() {
  const listas = {};
  Object.entries(LISTAS).forEach(([campo, tabla]) => (listas[campo] = listarRegistros(tabla)));
  VistaProductoForm.llenarListas(listas);
}

function crearElementoNuevo() {
  const nombre = VistaProductoForm.leerNombreNuevo();
  crearRegistro(destino.tabla, { nombre, extra: '' });
  llenarListas();
  VistaProductoForm.elegirEnLista(destino.campo, nombre);   // queda elegido en el formulario
  VistaProductoForm.cerrarDialogoNuevo();
}

function guardarProducto() {
  const datos = { ...VistaProductoForm.leerFormulario(), imagen };
  ['precio', 'costo', 'stock', 'minimo'].forEach(campo => (datos[campo] = Number(datos[campo])));
  datos.nombre = datos.nombre.trim();
  datos.sku = datos.sku.trim();

  if (producto) actualizarRegistro('productos', producto.id, datos);
  else crearRegistro('productos', { ubicacion: 'Sin asignar', ...datos });

  VistaComun.irA('inventario.html?aviso=producto');
}

// Reglas que no caben en el HTML: nombres y SKU repetidos
const reglasDelProducto = {
  '#sku': sku => existeValor('productos', 'sku', sku, producto?.id) ? 'Ya existe un producto con este SKU.' : ''
};
const reglasDelNuevo = {
  '#nuevo-nombre': nombre => existeValor(destino.tabla, 'nombre', nombre) ? 'Ya existe uno con ese nombre.' : ''
};

function iniciar() {
  llenarListas();                                          // primero las listas, luego los valores
  if (producto) VistaProductoForm.mostrarModoEdicion(producto);
  VistaProductoForm.mostrarVistaPrevia(imagen);

  VistaProductoForm.alPulsarNuevo(datosDestino => {
    destino = datosDestino;
    VistaProductoForm.abrirDialogoNuevo(destino.titulo);
  });
  VistaProductoForm.alGuardarNuevo(crearElementoNuevo, reglasDelNuevo);
  VistaProductoForm.alElegirImagen(imagenNueva => {
    imagen = imagenNueva;
    VistaProductoForm.mostrarVistaPrevia(imagen);
  });
  VistaProductoForm.alGuardar(guardarProducto, reglasDelProducto);
}
iniciar();
