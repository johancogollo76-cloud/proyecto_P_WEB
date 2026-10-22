/* ==========================================================
   producto-form.js · Agregar y editar producto
   Sin ?id= en la dirección se crea uno nuevo; con ?id=p1 se edita ese.
   ========================================================== */
const idProducto = new URLSearchParams(location.search).get('id');
const producto = buscarRegistro('productos', idProducto) || null;
const form = $('#form-producto');
let imagen = producto?.imagen || '';

/* Listas desplegables: salen de los módulos Categorías, Marcas y Proveedores */
const LISTAS = { categoria: 'categorias', marca: 'marcas', proveedor: 'proveedores' };   // campo → lista en datos.js

function llenarListas() {
  Object.entries(LISTAS).forEach(([campo, tabla]) => {
    const lista = $('#' + campo);
    const elegido = lista.value;
    lista.innerHTML = '<option value="">Selecciona</option>' +
      listarRegistros(tabla).map(item => `<option>${esc(item.nombre)}</option>`).join('');
    lista.value = elegido;   // conserva lo que ya estaba elegido
  });
}
llenarListas();

/* Modo editar: título y campos rellenos */
if (producto) {
  $('#titulo-form').textContent = 'Editar producto';
  $('#miga-form').textContent = producto.nombre;
  $$('[name]', form).forEach(campo => (campo.value = producto[campo.name] ?? ''));
}

/* Botones "+ Nuevo": crean una categoría, marca o proveedor sin salir del formulario */
const dialogoNuevo = $('#dlg-nuevo');
const formNuevo = $('#form-nuevo');
let destino = null;   // qué lista se está ampliando: { campo, tabla, titulo }

$$('.enlace-nuevo').forEach(boton => boton.addEventListener('click', () => {
  destino = boton.dataset;
  formNuevo.reset();
  $('#titulo-nuevo').textContent = destino.titulo;
  dialogoNuevo.showModal();
}));

function verificarNombreNuevo() {
  const repetido = existeValor(destino.tabla, 'nombre', $('#nuevo-nombre').value);
  $('#nuevo-nombre').setCustomValidity(repetido ? 'Ya existe uno con ese nombre.' : '');
}
$('#nuevo-nombre').addEventListener('input', verificarNombreNuevo);
formNuevo.addEventListener('submit', verificarNombreNuevo);   // debe ir antes de activarValidacion

activarValidacion(formNuevo, () => {
  const nombre = $('#nuevo-nombre').value.trim();
  crearRegistro(destino.tabla, { nombre, extra: '' });

  llenarListas();
  $('#' + destino.campo).value = nombre;   // queda elegido en el formulario
  dialogoNuevo.close();
});

/* Imagen: se reduce para que quepa en el almacenamiento del navegador */
function mostrarVistaPrevia() {
  const caja = $('#vista-previa');
  caja.style.backgroundImage = imagen ? `url(${imagen})` : '';
  caja.classList.toggle('con-imagen', Boolean(imagen));
}
$('#btn-imagen').addEventListener('click', () => $('#archivo-imagen').click());
$('#archivo-imagen').addEventListener('change', e => {
  const archivo = e.target.files[0];
  if (!archivo) return;
  const img = new Image();
  img.onload = () => {
    const escala = Math.min(1, 320 / Math.max(img.width, img.height));
    const lienzo = document.createElement('canvas');
    lienzo.width = img.width * escala;
    lienzo.height = img.height * escala;
    lienzo.getContext('2d').drawImage(img, 0, 0, lienzo.width, lienzo.height);
    imagen = lienzo.toDataURL('image/jpeg', 0.8);
    URL.revokeObjectURL(img.src);
    mostrarVistaPrevia();
  };
  img.src = URL.createObjectURL(archivo);
});
mostrarVistaPrevia();

/* El SKU no se puede repetir (se ignora el del producto que se edita) */
function verificarSku() {
  const sku = $('#sku');
  const repetido = existeValor('productos', 'sku', sku.value, producto?.id);
  sku.setCustomValidity(repetido ? 'Ya existe un producto con este SKU.' : '');
}
$('#sku').addEventListener('input', verificarSku);
form.addEventListener('submit', verificarSku);   // debe ir antes de activarValidacion
verificarSku();

/* Guardar: actualiza o agrega el producto y vuelve al inventario */
function guardarProducto() {
  const datos = { ...Object.fromEntries(new FormData(form)), imagen };
  ['precio', 'costo', 'stock', 'minimo'].forEach(campo => (datos[campo] = Number(datos[campo])));
  datos.nombre = datos.nombre.trim();
  datos.sku = datos.sku.trim();

  if (producto) actualizarRegistro('productos', producto.id, datos);
  else crearRegistro('productos', { ubicacion: 'Sin asignar', ...datos });

  location.href = 'inventario.html?aviso=producto';
}

activarValidacion(form, guardarProducto);
