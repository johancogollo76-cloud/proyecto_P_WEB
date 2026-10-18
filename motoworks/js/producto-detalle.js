/* ==========================================================
   producto-detalle.js · Ficha de un producto (?id=p1)
   Cada elemento con data-campo="..." se rellena con ese dato.
   ========================================================== */
const productos = leerDatos('productos');
const producto = productos.find(p => p.id === new URLSearchParams(location.search).get('id')) || productos[0];

if (!producto) {
  location.href = 'inventario.html';   // no hay productos que mostrar
} else {
  // Cómo se muestra cada dato (los que no están aquí se muestran tal cual)
  const formato = {
    precio: dinero, costo: dinero,
    stock: n => `${n} uds`, minimo: n => `${n} uds`,
    descripcion: t => t || 'Sin descripción.',
    ubicacion: t => t || 'Sin asignar'
  };
  $$('[data-campo]').forEach(el => {
    const campo = el.dataset.campo;
    el.textContent = (formato[campo] || (v => v))(producto[campo]);
  });

  const chip = $('#chip-estado');
  chip.textContent = producto.estado;
  chip.classList.toggle('ok', producto.estado === 'Activo');

  $('#btn-editar').href = `producto-form.html?id=${producto.id}`;
  if (producto.imagen) {
    const caja = $('#imagen-producto');
    caja.style.backgroundImage = `url(${producto.imagen})`;
    caja.classList.add('con-imagen');
  }
}
