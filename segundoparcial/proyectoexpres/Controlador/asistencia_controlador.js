const asistenciaModel = require('../Modelo/asistencia_modelo');
const talleresModel = require('../Modelo/talleres_modelo');

const { validarNombre, validarBoleta, validarUUID, limpiar } = require('../validaciones');

async function registrarAsistencia(req, res) {
    const { taller_id, nombre_alumno, boleta } = req.body || {};

    if (!taller_id || !nombre_alumno || !boleta) {
        return res.status(400).json({ error: 'taller_id, nombre_alumno y boleta son obligatorios' });
    }
    if (!validarUUID(taller_id)) return res.status(400).json({ error: 'taller_id no tiene un formato válido' });
    if (!validarNombre(nombre_alumno)) return res.status(400).json({ error: 'El nombre debe tener de 2 a 60 letras, sin números' });
    if (!validarBoleta(boleta)) return res.status(400).json({ error: 'La boleta debe tener 10 dígitos' });

    try {
        const taller = await talleresModel.obtenerPorId(taller_id);
        if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
        if (taller.asistentes >= taller.cupo) return res.status(409).json({ error: 'El taller ya no tiene lugares' });

        const boletaLimpia = boleta.trim();
        if (await asistenciaModel.existeBoletaEnTaller(taller_id, boletaLimpia)) {
            return res.status(409).json({ error: 'Esa boleta ya está inscrita en este taller' });
        }

        const asistencia = await asistenciaModel.registrarAsistencia({
            taller_id: taller_id,
            nombre_alumno: limpiar(nombre_alumno),
            boleta: boletaLimpia,
        });
        res.status(201).json(asistencia);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function consultarAsistenciaTaller(req, res) {
    try {
        const taller = await talleresModel.obtenerPorId(req.params.id);
        if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });

        const asistencias = await asistenciaModel.consultarAsistenciaPorTaller(req.params.id);
        res.json(asistencias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { registrarAsistencia, consultarAsistenciaTaller };