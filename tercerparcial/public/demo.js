// La página solo hace fetch a la API. El navegador manda la cookie solo (misma página, mismo servidor).
const $ = (id) => document.getElementById(id);

// ETAPA 1 Una sola función para hablar con la API

// Por qué una sola función: todas las rutas se llaman igual, así evitamos repetir el fetch
// diez veces y siempre regresamos la misma forma { status, datos }.
// Por qué no ponemos credentials: 'include': la página y la API viven en el mismo origen
// (localhost:4600), y en ese caso fetch ya manda la cookie por defecto. Haría falta si la
// página estuviera en otro puerto/dominio (por ejemplo Next.js en :3000 llamando a :4600).
async function llamar(metodo, url, cuerpo) {
  const opciones = { method: metodo, headers: {} };

  // Por qué el encabezado solo cuando hay cuerpo: express.json() necesita
  // Content-Type: application/json para leer el body; un GET no lleva body.
  if (cuerpo !== undefined) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(cuerpo);
  }

  try {
    const respuesta = await fetch(url, opciones);

    // fetch NO lanza error con un 401 o 403: el código está en respuesta.status.
    // Si el servidor contesta algo que no es JSON, .json() falla; en ese caso datos = null.
    let datos = null;
    try {
      datos = await respuesta.json();
    } catch {
      datos = null;
    }
    return { status: respuesta.status, datos };
  } catch (error) {
    // Solo llega aquí si ni siquiera hubo respuesta (servidor apagado, sin red).
    return { status: 0, datos: { error: 'No se pudo conectar con el servidor' } };
  }
}