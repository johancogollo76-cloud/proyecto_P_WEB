/* ==========================================================
   VISTA · producto-form.js · Formulario de producto
   Dibuja y lee el formulario, la ventana "+ Nuevo" y la imagen.
   ========================================================== */
const VistaProductoForm = {
  // listas = { categoria: [...], marca: [...], proveedor: [...] } → llena cada lista desplegable
  llenarListas(listas) {
    Object.entries(listas).forEach(([campo, items]) => {
      const lista = $('#' + campo);
      const elegido = lista.value;
      lista.innerHTML = '<option value="">Selecciona</option>' +
        items.map(item => `<option>${esc(item.nombre)}</option>`).join('');
      lista.value = elegido;   // conserva lo que ya estaba elegido
    });
  },
  elegirEnLista(campo, nombre) { $('#' + campo).value = nombre; },

  // Modo editar: título y campos rellenos
  mostrarModoEdicion(producto) {
    $('#titulo-form').textContent = 'Editar producto';
    $('#miga-form').textContent = producto.nombre;
    $$('[name]', $('#form-producto')).forEach(campo => (campo.value = producto[campo.name] ?? ''));
  },
  leerFormulario() { return Object.fromEntries(new FormData($('#form-producto'))); },

  // Ventana "+ Nuevo" (crear categoría, marca o proveedor sin salir del formulario)
  abrirDialogoNuevo(titulo) {
    $('#form-nuevo').reset();
    $('#titulo-nuevo').textContent = titulo;
    $('#dlg-nuevo').showModal();
  },
  cerrarDialogoNuevo() { $('#dlg-nuevo').close(); },
  leerNombreNuevo() { return $('#nuevo-nombre').value.trim(); },

  // Imagen
  mostrarVistaPrevia(imagen) {
    const caja = $('#vista-previa');
    caja.style.backgroundImage = imagen ? `url(${imagen})` : '';
    caja.classList.toggle('con-imagen', Boolean(imagen));
  },
  // La foto se reduce para que quepa en el almacenamiento del navegador
  alElegirImagen(manejador) {
    $('#btn-imagen').addEventListener('click', () => $('#archivo-imagen').click());
    $('#archivo-imagen').addEventListener('change', e => {
      const archivo = e.target.files[0];
      if (!archivo) return;
      const foto = new Image();
      foto.onload = () => {
        const escala = Math.min(1, 320 / Math.max(foto.width, foto.height));
        const lienzo = document.createElement('canvas');
        lienzo.width = foto.width * escala;
        lienzo.height = foto.height * escala;
        lienzo.getContext('2d').drawImage(foto, 0, 0, lienzo.width, lienzo.height);
        URL.revokeObjectURL(foto.src);
        manejador(lienzo.toDataURL('image/jpeg', 0.8));
      };
      foto.src = URL.createObjectURL(archivo);
    });
  },

  // Eventos
  alPulsarNuevo(manejador) {
    $$('.enlace-nuevo').forEach(boton => boton.addEventListener('click', () => manejador({ ...boton.dataset })));
  },
  alGuardarNuevo(manejador, reglasExtra) { activarValidacion($('#form-nuevo'), manejador, reglasExtra); },
  alGuardar(manejador, reglasExtra) { activarValidacion($('#form-producto'), manejador, reglasExtra); }
};
