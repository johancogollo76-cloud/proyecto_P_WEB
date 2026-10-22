/* ==========================================================
   datos.js · Los datos y sus reglas (CRUD)
   ----------------------------------------------------------
   Crear, leer, editar y eliminar registros, más las reglas del
   negocio (stock, nombres repetidos...). Para guardar usa
   almacenamiento.js y NO toca la pantalla.

   Las listas ("tablas") son: productos, categorias, marcas,
   proveedores, usuarios y ventas. Empiezan vacías.
   ========================================================== */

/* CRUD genérico: sirve para cualquier lista ---------------- */
const generarId = prefijo => prefijo + Date.now();

function listarRegistros(tabla) {
  return leerLista(tabla);
}

function buscarRegistro(tabla, id) {
  return leerLista(tabla).find(registro => registro.id === id);
}

function crearRegistro(tabla, datos) {
  const lista = leerLista(tabla);
  const registro = { id: generarId(tabla[0]), ...datos };   // "..." copia los campos de datos
  lista.unshift(registro);                                   // el más nuevo queda arriba
  guardarLista(tabla, lista);
  return registro;
}

function actualizarRegistro(tabla, id, cambios) {
  const lista = leerLista(tabla).map(registro => registro.id === id ? { ...registro, ...cambios } : registro);
  guardarLista(tabla, lista);
}

function eliminarRegistro(tabla, id) {
  guardarLista(tabla, leerLista(tabla).filter(registro => registro.id !== id));
}

// Activo ⇄ Inactivo (o el par de estados que se indique, por ejemplo Pagada ⇄ Pendiente)
function alternarEstado(tabla, id, [estadoUno, estadoDos] = ['Activo', 'Inactivo']) {
  const registro = buscarRegistro(tabla, id);
  actualizarRegistro(tabla, id, { estado: registro.estado === estadoUno ? estadoDos : estadoUno });
}

/* Reglas ---------------------------------------------------- */

// ¿Ya existe un registro con ese valor? (ignora mayúsculas y el registro que se está editando)
function existeValor(tabla, campo, valor, idIgnorado) {
  const buscado = valor.trim().toLowerCase();
  return leerLista(tabla).some(registro =>
    registro.id !== idIgnorado && String(registro[campo]).toLowerCase() === buscado);
}

// Productos que usan una categoría, marca o proveedor (campo = 'categoria' | 'marca' | 'proveedor')
function productosQueUsan(campo, nombre) {
  return leerLista('productos').filter(producto => producto[campo] === nombre);
}

// Si se cambia el nombre de una categoría/marca/proveedor, los productos se actualizan
function renombrarEnProductos(campo, nombreViejo, nombreNuevo) {
  productosQueUsan(campo, nombreViejo).forEach(producto =>
    actualizarRegistro('productos', producto.id, { [campo]: nombreNuevo }));
}

/* Ventas ---------------------------------------------------- */
const totalVenta = venta => venta.items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
const unidadesVenta = venta => venta.items.reduce((suma, item) => suma + item.cantidad, 0);

function siguienteFactura() {
  const mayorNumero = leerLista('ventas').reduce((mayor, venta) => Math.max(mayor, Number(venta.factura.slice(4))), 0);
  return 'FAC-' + String(mayorNumero + 1).padStart(7, '0');
}

// Crea la factura y descuenta del stock lo que se vendió
function registrarVenta(datosVenta, producto, cantidad) {
  const venta = crearRegistro('ventas', {
    factura: siguienteFactura(),
    fecha: fechaDeHoy(),
    hora: horaActual(),
    ...datosVenta,
    items: [{ productoId: producto.id, nombre: producto.nombre, cantidad, precio: producto.precio }]
  });
  actualizarRegistro('productos', producto.id, { stock: producto.stock - cantidad });
  return venta;
}

// Elimina la factura y devuelve al stock lo que se había vendido
function anularVenta(id) {
  buscarRegistro('ventas', id).items.forEach(item => {
    const producto = buscarRegistro('productos', item.productoId);
    if (producto) actualizarRegistro('productos', producto.id, { stock: producto.stock + item.cantidad });
  });
  eliminarRegistro('ventas', id);
}
