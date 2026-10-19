const bcrypt = require(`bcryptjs`);

const usuariosModel = require(`../Modelo/usuarios_modelo`);

const {validarCorreo, validarBoleta, validarContrasena} = require
(`../validaciones`);

function esDuplicado(error) {
    return error.code === `ER_DUP_ENTRY` || error.code === `23505`;

}

async function listarUsuarios(req, res) {
    try{
        const usuarios = await usuariosModel.listar();
        res.json(usuario);
    }catch{
        res.status(500).json({error: error.message});
    }
}

//Realizar los controladores de asistncia y talleres con funciones correspondientes

async function obetenerUsuario(req, res) {
    try{
        const usuario = await usuariosModel.obtenerPorId(req.params.id);
        if(!usuario) return res.status(404).json({error : `usuario no encontrado`});
        res.json(usuario);
    
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

