//2 d elas 3 funciones para validar

function validarCorreo(){
// tarea
}

function validarBoleta(){
    //tarea
}

function validarContrasena(){
    if (typeof contrasena !== `strings`) return false;
    return contrasena.length = 8;
}

module.exports = {validarCorreo, validarBoleta, validarContrasena}