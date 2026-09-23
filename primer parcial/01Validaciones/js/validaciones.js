/*
Las validaciones para este formulario se realizaran  mediante el uso de Expresiones Regulares, las cuales las vamos a dividir en 3:
1.- Texto para el nombre
2.- Numerico para la boleta
3.- Debe tener un patron para la fecha

Las expresiones regulares, son patrones que nos ayudan a validar cadenas bajo ciertas condiciones.
*/ 

const patrones = {
    nombre : /^[A-Za-zÁÉÍÓÚÑáéíóúñÜü\s]{2,60}$/,
    boleta : /^\d{10}$/,
    fecha : /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
};

const mensajes = {
    nombre : "Solo letras y espacios, entre 3 y 60 caracteres.",
    boleta : "Debe tener exactamente 10 dígitos numéricos.",
    fecha : "La fecha debe tener el formato DD/MM/AAAA y ser una fecha válida."
};

function validarCampo(campo, valor){
    return patrones[campo].test(valor.trim());
}


if (typeof document !== 'undefined') {
    
    const formulario = document.getElementById('formRegistro');

    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            let formularioValido = true;

            for (const campo of Object.keys(patrones)) {
                const input = document.getElementById(campo);
                const errorSpan = document.getElementById(`error-${campo}`);

                if (!input) continue;

                const esValido = validarCampo(campo, input.value);
                
                if (errorSpan) {
                    if (esValido) {
                        errorSpan.textContent = '';
                        
                        errorSpan.style.display = 'none'; 
                    } else {
                        errorSpan.textContent = mensajes[campo];
                        
                        errorSpan.style.display = 'block'; 
                    }
                }

                if (!esValido) {
                    formularioValido = false;
                }
            }

            
            const mensajeExito = document.getElementById('mensajeExito');
            
            if (mensajeExito) {
                if (formularioValido) {
                    mensajeExito.textContent = '¡Registro exitoso!';
                    
                    mensajeExito.classList.add('mostrar');
                } else {
                    
                    mensajeExito.classList.remove('mostrar');
                }
            }
        });
    }
}