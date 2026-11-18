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

    
  }

  return { verificar };
}

module.exports = { crearModeloUsuarios };