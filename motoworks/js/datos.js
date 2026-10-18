/* ==========================================================
   datos.js · Datos de ejemplo y "memoria temporal"
   ----------------------------------------------------------
   Como cada vista es una página distinta, al cambiar de página
   JavaScript empieza de cero. Para que un producto nuevo se siga
   viendo al volver al inventario, los datos se guardan en
   sessionStorage: vive solo mientras la pestaña esté abierta y se
   borra al cerrarla. No hay base de datos ni archivos.
   ========================================================== */

const SEMILLA = {
  productos: [
    { id: 'p1', nombre: 'Kit de arrastre DID 520VX3', sku: 'MW-KA-001', categoria: 'Transmisión', marca: 'DID',
      proveedor: 'Motopartes S.A.S.', precio: 389900, costo: 298000, stock: 14, minimo: 5, estado: 'Activo',
      modelo: 'Yamaha MT-03 / R3', ubicacion: 'Bodega A · Estante 3', imagen: '',
      descripcion: 'Kit de arrastre con cadena DID 520VX3 de alta resistencia, piñón y corona en acero. Incluye eslabón de unión. Pensado para motos de 250 a 500 cc.' },
    { id: 'p2', nombre: 'Pastillas de freno delanteras Brembo', sku: 'MW-FR-014', categoria: 'Frenos', marca: 'Brembo',
      proveedor: 'Distribuciones Andina', precio: 129900, costo: 97000, stock: 32, minimo: 8, estado: 'Activo',
      modelo: 'Yamaha R3 / MT-03', ubicacion: 'Bodega A · Estante 5', imagen: '',
      descripcion: 'Pastillas sinterizadas de alto rendimiento para freno delantero.' },
    { id: 'p3', nombre: 'Aceite Motul 7100 10W-40 (1 L)', sku: 'MW-LU-007', categoria: 'Lubricantes', marca: 'Motul',
      proveedor: 'Lubricantes del Norte', precio: 64900, costo: 48000, stock: 3, minimo: 10, estado: 'Activo',
      modelo: 'Universal 4T', ubicacion: 'Bodega B · Estante 1', imagen: '',
      descripcion: 'Aceite 100% sintético para motos de cuatro tiempos.' },
    { id: 'p4', nombre: 'Filtro de aire K&N', sku: 'MW-FI-022', categoria: 'Motor', marca: 'K&N',
      proveedor: 'Motopartes S.A.S.', precio: 219900, costo: 165000, stock: 0, minimo: 4, estado: 'Inactivo',
      modelo: 'Honda CB 500', ubicacion: 'Bodega A · Estante 2', imagen: '',
      descripcion: 'Filtro de aire lavable de alto flujo.' }
  ],
  usuarios: [
    { id: 'u1', nombre: 'Carlos Ruiz', correo: 'carlos.ruiz@motoworks.co', telefono: '3001234567', rol: 'Administrador', estado: 'Activo', registro: 'Registrado 12 ene 2026' },
    { id: 'u2', nombre: 'Laura Méndez', correo: 'laura.mendez@motoworks.co', telefono: '3114567890', rol: 'Vendedor', estado: 'Activo', registro: 'Registrado 03 mar 2026' },
    { id: 'u3', nombre: 'Andrés Torres', correo: 'andres.torres@motoworks.co', telefono: '3209876543', rol: 'Bodega', estado: 'Inactivo', registro: 'Registrado 21 jun 2026' }
  ]
};

// Catálogos: listas que el usuario puede ampliar desde sus módulos (o desde "+ Nuevo" en el formulario de producto)
// "extra" es un dato opcional: descripción (categorías), país (marcas) o teléfono (proveedores)
SEMILLA.categorias = [
  { id: 'c1', nombre: 'Transmisión', extra: 'Cadenas, piñones y coronas' },
  { id: 'c2', nombre: 'Frenos', extra: 'Pastillas, discos y bombas' },
  { id: 'c3', nombre: 'Lubricantes', extra: 'Aceites y grasas' },
  { id: 'c4', nombre: 'Motor', extra: 'Filtros, pistones y empaques' },
  { id: 'c5', nombre: 'Eléctrico', extra: 'Bujías, baterías y luces' },
  { id: 'c6', nombre: 'Accesorios', extra: 'Espejos, maletas y protectores' }
];
SEMILLA.marcas = [
  { id: 'm1', nombre: 'DID', extra: 'Japón' },
  { id: 'm2', nombre: 'Brembo', extra: 'Italia' },
  { id: 'm3', nombre: 'Motul', extra: 'Francia' },
  { id: 'm4', nombre: 'K&N', extra: 'Estados Unidos' },
  { id: 'm5', nombre: 'NGK', extra: 'Japón' }
];
SEMILLA.proveedores = [
  { id: 'v1', nombre: 'Motopartes S.A.S.', extra: '300 111 2233' },
  { id: 'v2', nombre: 'Distribuciones Andina', extra: '310 444 5566' },
  { id: 'v3', nombre: 'Lubricantes del Norte', extra: '320 777 8899' }
];

// Ventas de ejemplo (cada ítem guarda el nombre y el precio con que se vendió)
SEMILLA.ventas = [
  { id: 'f1', factura: 'FAC-0001042', fecha: '15 oct 2026', hora: '10:42 a. m.', cliente: 'Juan Pérez',
    contacto: 'juan.perez@correo.com · 300 555 1234', metodo: 'Tarjeta', detallePago: 'Débito terminada en 4417', estado: 'Pagada',
    items: [{ nombre: 'Kit de arrastre DID 520VX3', cantidad: 1, precio: 389900 },
            { nombre: 'Aceite Motul 7100 10W-40 (1 L)', cantidad: 2, precio: 64900 }] },
  { id: 'f2', factura: 'FAC-0001041', fecha: '15 oct 2026', hora: '09:15 a. m.', cliente: 'Taller Moto Express',
    contacto: 'compras@motoexpress.co · 310 777 8899', metodo: 'Transferencia', detallePago: 'Bancolombia, pendiente de confirmar', estado: 'Pendiente',
    items: [{ nombre: 'Kit de arrastre DID 520VX3', cantidad: 2, precio: 389900 },
            { nombre: 'Pastillas de freno delanteras Brembo', cantidad: 3, precio: 129900 }] },
  { id: 'f3', factura: 'FAC-0001040', fecha: '14 oct 2026', hora: '04:30 p. m.', cliente: 'María Gómez',
    contacto: 'maria.gomez@correo.com · 315 222 3344', metodo: 'Efectivo', detallePago: 'Pago en caja', estado: 'Pagada',
    items: [{ nombre: 'Aceite Motul 7100 10W-40 (1 L)', cantidad: 1, precio: 64900 }] }
];

const totalVenta = venta => venta.items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
const unidadesVenta = venta => venta.items.reduce((suma, i) => suma + i.cantidad, 0);

// Devuelve la lista guardada en esta pestaña o, si no hay, los datos de ejemplo
function leerDatos(tabla) {
  try {
    const texto = sessionStorage.getItem('mw_' + tabla);
    if (texto) return JSON.parse(texto);
  } catch (e) { /* si el navegador no deja usar sessionStorage, se usan los de ejemplo */ }
  return JSON.parse(JSON.stringify(SEMILLA[tabla]));
}

function guardarDatos(tabla, lista) {
  try { sessionStorage.setItem('mw_' + tabla, JSON.stringify(lista)); } catch (e) { /* sin espacio o bloqueado */ }
}
