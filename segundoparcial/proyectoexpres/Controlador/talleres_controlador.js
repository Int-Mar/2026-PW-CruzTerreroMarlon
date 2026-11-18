const talleresModel = require('../Modelo/talleres_modelo');

const { validarTitulo, validarFecha, validarCupo, validarNombre, limpiar } = require('../validaciones');

function esDuplicado(error) {
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

function esLlaveInvalida(error) {
    return error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === '23503';
}

async function listarTalleres(req, res) {
    try {
        const talleres = await talleresModel.listar();
        res.json(talleres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function obtenerTaller(req, res) {
    try {
        const taller = await talleresModel.obtenerPorId(req.params.id);
        if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
        res.json(taller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function crearTaller(req, res) {
    const { nombre, instructor, fecha, cupo } = req.body || {};

    if (!nombre || !fecha) {
        return res.status(400).json({ error: 'nombre y fecha son obligatorios' });
    }
    if (!validarTitulo(nombre)) return res.status(400).json({ error: 'El nombre del taller debe tener de 3 a 100 caracteres' });
    if (!validarFecha(fecha)) return res.status(400).json({ error: 'La fecha debe existir y tener el formato AAAA-MM-DD' });
    if (instructor !== undefined && !validarNombre(instructor)) {
        return res.status(400).json({ error: 'El instructor debe tener de 2 a 60 letras, sin números' });
    }
    if (cupo !== undefined && !validarCupo(cupo)) {
        return res.status(400).json({ error: 'El cupo debe ser un número entero entre 1 y 500' });
    }

    try {
        const taller = await talleresModel.crear({
            nombre: limpiar(nombre),
            instructor: instructor !== undefined ? limpiar(instructor) : undefined,
            fecha,
            cupo,
        });
        res.status(201).json(taller);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function registrarAlumno(req, res) {
    const { usuarioId } = req.body || {};

    if (!usuarioId) {
        return res.status(400).json({ error: 'El campo usuarioId es obligatorio' });
    }

    try {
        const taller = await talleresModel.obtenerPorId(req.params.id);
        if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });

        const inscripcion = await talleresModel.registrarAlumno(req.params.id, usuarioId);
        res.status(201).json(inscripcion);
    } catch (error) {
        if (esDuplicado(error)) return res.status(409).json({ error: 'El alumno ya está registrado en ese taller' });
        if (esLlaveInvalida(error)) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(500).json({ error: error.message });
    }
}

module.exports = { listarTalleres, obtenerTaller, crearTaller, registrarAlumno };