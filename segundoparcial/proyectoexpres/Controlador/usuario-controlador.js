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
        res.json(usuarios);
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





async function cresrUsuario(req, res) {
    const {nombre, correo, contraseña, boleta, rol} = req.body;

    if(!nombre || !correo || !contraseña || !boleta){
        return res.status(400).json({error: `los campos nombre, correo, contraseña y boleta son obligatorios`});
    }
    if(!validarCorreo(correo)) return res.status(400).json({error : `la contraseña debe tener al menos 8 caracteres`});

    try{
        const contrasenaHash = await bcrypt.hash(contraseña, 10);
        const usuario = await usuariosModel.crear({nombre, correo, contrasenaHash, boleta, rol});
        res.status(201).json(usuario);
    }catch(error){
        if(esDuplicado(error)){
            return res.status(409).json({error: `ya existe usuario con corrreo o boleta registrada`});
        }
        res.status(500).json({error: error.message});
    }
}

async function actuslizarUsuario(req, res) {
    const {nombre, correo, rol} = req.body;

    if(nombre === undefined && correo === undefined && rol === undefined){
        return res.status(400).json({error: `se debe de llenar almenos uno de los campos de nombre, correo o rol para actualizar datos`});
    }
    if(correo !== undefined && !validarCorreo(correo)) {
        return res.status(400).json({error: `el correo tiene formato valido`});
    }
    //aqui mandan a llamar la funcion de nombre

    try{
        const usuario = await usuariosModel.actualizar(req.params.id, {nombre, correo, rol});
        if(!usuario) return res.status(404).json({error: `usuario no encontrado`});
        res.json(usuario);
    }catch(error){
        if(esDuplicado(error)) return res.status(400).json({error: `ya existe usuario con correo registrado`});
        res.status(500).json({error: error.message});
    }
        
}

async function eliminarUsuario(req, res) {
    try{
        const eliminado = await usuariosModel.eliminar(req.params.id);
        if(!eliminado) return res.status(404).json({error: `no se encontro al usuario`});
        res.json({mensaje: `usuario eliminado correctamente`});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

module.exports = {listarUsuarios, obetenerUsuario, cresrUsuario, actuslizarUsuario, eliminarUsuario};