/* ==========================================================
   VISTA · producto-detalle.js · Dibuja la ficha de un producto
   Cada elemento con data-campo="..." se rellena con ese dato.
   ========================================================== */
const VistaProductoDetalle = {
  // Cómo se muestra cada dato (los que no están aquí se muestran tal cual)
  formato: {
    precio: dinero, costo: dinero,
    stock: cantidad => `${cantidad} uds`, minimo: cantidad => `${cantidad} uds`,
    descripcion: texto => texto || 'Sin descripción.',
    ubicacion: texto => texto || 'Sin asignar'
  },

  mostrarProducto(producto) {
    $$('[data-campo]').forEach(elemento => {
      const campo = elemento.dataset.campo;
      const dar = VistaProductoDetalle.formato[campo] || (valor => valor);
      elemento.textContent = dar(producto[campo]);
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
};
