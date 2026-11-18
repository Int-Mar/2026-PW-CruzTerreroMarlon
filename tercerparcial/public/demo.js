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







// ETAPA 2 La bitácora

// Por qué una función aparte: elegir el color según el código es una decisión que
// solo depende del número, así la bitácora no se llena de ifs.
function claseCodigo(status) {
  if (status >= 200 && status < 300) return 'ok';
  if (status === 401) return 'e401';
  if (status === 403) return 'e403';
  return 'error';
}

// Por qué textContent y no innerHTML: el JSON puede traer texto que escribió alguien
// (un nombre, por ejemplo). Con innerHTML ese texto se interpretaría como HTML y permitiría
// XSS: un <script> o un <img onerror=…> corriendo en nuestra página. Si la cookie no fuera
// httpOnly, ese código podría leer document.cookie y mandarla al atacante (secuestro de sesión).
// textContent siempre lo trata como texto plano.
function anotar(metodo, url, status, datos) {
  const li = document.createElement('li');

  const codigo = document.createElement('span');
  codigo.className = `codigo ${claseCodigo(status)}`;
  codigo.textContent = status;

  const ruta = document.createElement('strong');
  ruta.textContent = ` ${metodo} ${url}`;

  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(datos, null, 2);

  li.append(codigo, ruta, pre);

  // prepend: el más nuevo queda arriba.
  $('bitacora').prepend(li);
}






// ETAPA 3 El estado ("¿quién soy para el servidor?")

// Por qué preguntamos al servidor y no a la cookie: la cookie solo trae un id firmado;
// quién eres y cuánto te queda lo sabe únicamente el servidor.
async function cargarEstado() {
  const { status, datos } = await llamar('GET', '/api/sesion');
  const estado = $('estado');

  if (status === 200 && datos) {
    estado.className = 'estado con-sesion';
    estado.textContent =
      `${datos.usuario.nombre} (${datos.usuario.rol}) · sesión ${datos.sesion} · vence en ${datos.expiraEnSegundos} s`;
  } else {
    estado.className = 'estado sin-sesion';
    estado.textContent = `Sin sesión (el servidor responde ${status === 0 ? 'nada' : status})`;
  }

  // Con httpOnly: true esto sale vacío aunque estés logueado: el navegador esconde la cookie
  // del JavaScript (por eso un XSS no puede robarla), pero igual la manda en cada petición.
  $('cookie-js').textContent = document.cookie || '(vacío)';
}




// ETAPA 4 La tabla de lo que guarda el servidor

function agregarFila(tbody, celdas, clase) {
  const tr = document.createElement('tr');
  if (clase) tr.className = clase;
  for (const texto of celdas) {
    const td = document.createElement('td');
    td.textContent = texto; // textContent: el nombre de usuario viene del servidor
    tr.append(td);
  }
  tbody.append(tr);
}

async function cargarTabla() {
  const { status, datos } = await llamar('GET', '/api/diagnostico/sesiones');
  const tbody = $('tabla-sesiones');

  // Por qué vaciar primero: si no, cada clic agregaría las filas otra vez (se duplicarían).
  tbody.replaceChildren();

  if (status !== 200 || !datos) {
    $('donde').textContent = 'No se pudo leer el almacén de sesiones';
    agregarFila(tbody, ['(sin sesiones)', '', '', '']);
    return;
  }

  $('donde').textContent =
    datos.almacen === 'mysql'
      ? 'En MySQL, tabla sessions: sobreviven si el servidor se reinicia'
      : 'En la memoria del servidor: se pierden si el servidor se reinicia';

  if (datos.sesiones.length === 0) {
    agregarFila(tbody, ['(sin sesiones)', '', '', '']);
    return;
  }

  for (const s of datos.sesiones) {
    // expira llega como texto ISO ("2026-11-11T23:16:47.313Z"); new Date lo entiende
    // y toLocaleTimeString lo muestra en la hora de tu computadora.
    const vence = s.expira ? new Date(s.expira).toLocaleTimeString('es-MX') : '—';
    agregarFila(
      tbody,
      [s.esLaTuya ? `${s.sesion} (la tuya)` : s.sesion, s.usuario, s.visitas, vence],
      s.esLaTuya ? 'tuya' : ''
    );
  }
}

// Por qué una función que hace las dos: después de cualquier acción (login, logout, botón)
// tanto el estado como la tabla pueden haber cambiado.
async function refrescarTodo() {
  await Promise.all([cargarEstado(), cargarTabla()]);
}