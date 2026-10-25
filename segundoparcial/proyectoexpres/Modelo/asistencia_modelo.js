const pool = require('../bd-local');

// 1. Registrar asistencia de un alumno a un taller
async function registrarAsistencia({ taller_id, nombre_alumno, boleta }) {
    const [info] = await pool.query(
        `INSERT INTO asistencias (taller_id, nombre_alumno, boleta) VALUES (?, ?, ?)`,
        [taller_id, nombre_alumno, boleta]
    );
    
    // Retorna el registro de asistencia recién creado consultándolo por su ID
    const [filas] = await pool.query(
        `SELECT * FROM asistencias WHERE id = ?`,
        [info.insertId]
    );
    return filas[0];
}

// 2. Consultar todas las asistencias de un taller específico
async function consultarAsistenciaPorTaller(taller_id) {
    const [filas] = await pool.query(
        `SELECT id, taller_id, nombre_alumno, boleta, fecha_registro
         FROM asistencias
         WHERE taller_id = ?
         ORDER BY fecha_registro DESC`,
        [taller_id]
    );
    return filas;
}

module.exports = {
    registrarAsistencia,
    consultarAsistenciaPorTaller
};