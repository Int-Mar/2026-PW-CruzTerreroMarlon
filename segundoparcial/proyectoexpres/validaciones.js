// Límites de longitud: evitan cadenas gigantes que llenan la base de datos.
const LIMITES = {
    nombre: { min: 2, max: 60 },
    correo: { max: 100 },
    contrasena: { min: 8, max: 72 }, // bcrypt solo usa los primeros 72 bytes
    tituloTaller: { min: 3, max: 100 },
    cupo: { min: 1, max: 500 },
};

const ROLES_VALIDOS = ['alumno', 'docente', 'admin'];

function limpiar(texto) {
    return texto.trim().replace(/\s+/g, ' ');
}

// Solo letras, espacios, apóstrofe, punto y guion. Sin números ni símbolos.
function validarNombre(nombre) {
    if (typeof nombre !== 'string') return false;
    const n = limpiar(nombre);
    return n.length >= LIMITES.nombre.min
        && n.length <= LIMITES.nombre.max
        && /^\p{L}[\p{L}' .-]*$/u.test(n);
}

function validarCorreo(correo) {
    if (typeof correo !== 'string') return false;
    const c = correo.trim();
    return c.length <= LIMITES.correo.max && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
}

// Solo texto: si llega como número se pierden los ceros de la izquierda.
function validarBoleta(boleta) {
    return typeof boleta === 'string' && /^\d{10}$/.test(boleta.trim());
}

// Al menos 8 caracteres, máximo 72 bytes, con una letra y un número.
function validarContrasena(contrasena) {
    if (typeof contrasena !== 'string') return false;
    return contrasena.length >= LIMITES.contrasena.min
        && Buffer.byteLength(contrasena, 'utf8') <= LIMITES.contrasena.max
        && /[A-Za-z]/.test(contrasena)
        && /\d/.test(contrasena);
}

function validarTitulo(titulo) {
    if (typeof titulo !== 'string') return false;
    const t = limpiar(titulo);
    return t.length >= LIMITES.tituloTaller.min && t.length <= LIMITES.tituloTaller.max;
}

// Fecha AAAA-MM-DD que exista de verdad (rechaza 2026-02-30, 2026-13-01, etc.).
function validarFecha(fecha) {
    if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const f = new Date(Date.UTC(anio, mes - 1, dia));
    return f.getUTCFullYear() === anio && f.getUTCMonth() === mes - 1 && f.getUTCDate() === dia;
}

function validarCupo(cupo) {
    return Number.isInteger(cupo) && cupo >= LIMITES.cupo.min && cupo <= LIMITES.cupo.max;
}

// Los ids de talleres son UUID (char(36)).
function validarUUID(id) {
    return typeof id === 'string'
        && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// Los ids de usuarios son enteros positivos.
function validarIdEntero(id) {
    return /^[1-9]\d*$/.test(String(id));
}

function validarRol(rol) {
    return ROLES_VALIDOS.includes(rol);
}

module.exports = {
    LIMITES,
    limpiar,
    validarNombre,
    validarCorreo,
    validarBoleta,
    validarContrasena,
    validarTitulo,
    validarFecha,
    validarCupo,
    validarUUID,
    validarIdEntero,
    validarRol,
};