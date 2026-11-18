// Consultas a la tabla usuarios. Siempre con ? (consulta parametrizada), nunca pegando texto en el SQL.
const bcrypt = require('bcryptjs');

// Hash bcrypt de relleno (el de ana). Solo se usa cuando el usuario no existe.
const HASH_FALSO = '$2a$10$zngOdAyKeY6JTTKdax4nwu9nq7YOkXlSCCfouJLolZF6JR0QIabSy';

function crearModeloUsuarios(pool) {
  // Regresa el usuario (sin el hash) si la contraseña es correcta, o null si no.
  async function verificar(usuario, contrasena) {
    if (typeof usuario !== 'string' || typeof contrasena !== 'string') return null;

    // "?" = consulta parametrizada: el texto del usuario nunca se pega al SQL (evita inyección SQL).
    const [filas] = await pool.query(
      'SELECT id, usuario, nombre, rol, contrasena_hash FROM usuarios WHERE usuario = ?',
      [usuario]
    );
    const fila = filas[0];

    // Si el usuario no existe igual comparamos contra un hash cualquiera: así "no existe" y
    // "contraseña mala" tardan lo mismo y dan el mismo mensaje (P-03).
    const hash = fila ? fila.contrasena_hash : HASH_FALSO;
    const coincide = await bcrypt.compare(contrasena, hash);
    if (!fila || !coincide) return null;

    // Nunca regresamos contrasena_hash.
    const { contrasena_hash, ...sinHash } = fila;
    return sinHash;
  }

  return { verificar };
}

module.exports = { crearModeloUsuarios };