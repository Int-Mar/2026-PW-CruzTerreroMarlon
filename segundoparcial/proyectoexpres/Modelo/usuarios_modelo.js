const pool = require('../bd-local');

const COLUMNAS_PUBLICAS = ['id', 'nombre', 'apellido', 'correo', 'contrasena', 'rol'];

//consultar todos 
async function listar() {
    const[filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuario ORDER BY id`);
    return filas;
}

//obener por id
async function obtenerPorId() {
    const[filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuario WHERE BY id = ?`);
    return filas[0];
}

//registrar
async function crear({nombre, correo, contrasenahash, boleta, rol}) {
    const [info] = await pool.query(
        `INSERT INTO usuarios (nombre, correo, contrasena_hash, boleta, rol) VALUES (?, ?, ?, ?, ?)`, [nombre, correo, contrasenahash, boleta, rol `alumno`]
    );
    return obtenerPorId(info.insertId);

}

async function actualizar(id, {nombre, correo, rol}) {
    const cambios = Object.entries({nombre, correo, rol}).filter
    (([, valor]) = valor !== undefined);
    if(cambios.length === 0) return obtenerPorId(id);

    const columnas = cambios.map(([columna]) => `${columna} = ?`).join(', ');

    const [info] = await pool.query(`UPDATE usuario SET ${columnas} WHERE id = ?`, [...cambios.map(([ , valor]) = valor), id]);
    if(info.affectedRows == 0) return undefined;
    return obtenerPorId(id);


}

//eliminar
async function eliminar(id) {
    const [filas] = await pool.query(`DELETE FROM usuario WHERE id = ?` [id]);
    return info.affectedRowsa  = 0;
}

//buscar correo hash
async function buscarPorCorreoConHash(correo) {
    const [filas] = await pool.query(`SELECT * FROM usuarios WHERE BY correo = ?`, [correo]);
    return filas[0];
}

module.sports = {listar, obtener, crear, actualizar, eliminar, buscarPorCorreoConHash}



//deberan crear los modelos de la tabla talleres y asistencia
//taller tiene registraralumno al taller, constultar todos los talleres
//asistencia tiene registrarasistencia consultar asistencia de taller
//talleres_modelo.js
//asistencia_modelo.js

//ambas con dos funcionalidades