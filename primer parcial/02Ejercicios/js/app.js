const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];

// funcion para rellenar la tabla
function pintarTabla() {
  const tbody = document.querySelector('#tabla-talleres tbody');
  
  //borra todo al inicio
  tbody.innerHTML = '';

  //mueve los arreglos
  talleres.forEach((t) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${t.nombre}</td>
      <td>${t.instructor}</td>
      <td>${t.cupo}</td>
      <td>${t.inscritos}</td>
    `;
    tbody.appendChild(fila);
  });
}

//inicia la funcion
pintarTabla();





// manejar el formulario de arreglos
const formArreglos = document.getElementById('form-arreglos');
const resultadoArreglos = document.getElementById('resultado-arreglo');
const selectOperacionArreglo = document.getElementById('operacion-arreglo');

formArreglos.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const operacion = selectOperacionArreglo.value;

  let resultado;

  switch (operacion) {
    
    // forEach: imprime la lista formateada
    case 'forEach':
      resultado = talleres
        .map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`)
        .join('\n');
      break;

    // map: Crea un arreglo con solo los nombres de los talleres
    case 'map':
      const nombres = talleres.map((t) => t.nombre);
      resultado = nombres.join(', ');
      break;

    // filter: Filtra solo los talleres con cupo lleno
    case 'filter':
      const llenos = talleres.filter((t) => t.inscritos >= t.cupo);
      resultado = llenos.map((t) => `- ${t.nombre} (LLENO)`).join('\n');
      break;

    // find: Encuentra el primer taller impartido por Ing. María López
    case 'find':
      const tallerMaria = talleres.find((t) => t.instructor === 'Ing. María López');
      resultado = tallerMaria
        ? `Encontrado: ${tallerMaria.nombre} - Instructor: ${tallerMaria.instructor}`
        : 'No se encontró ningún taller';
      break;

    // reduce: Suma el total de inscritos entre todos los talleres
    case 'reduce':
      const totalInscritos = talleres.reduce((acumulador, t) => acumulador + t.inscritos, 0);
      resultado = `Total de alumnos inscritos en todos los talleres: ${totalInscritos}`;
      break;

    // filter + map: Nombres de los talleres con cupo disponible
    case 'disponibles':
      const nombresDisponibles = talleres
        .filter((t) => t.inscritos < t.cupo)
        .map((t) => t.nombre);
      resultado = `Talleres con disponibilidad:\n` + nombresDisponibles.map((n) => `- ${n}`).join('\n');
      break;

    default:
      resultado = 'Operación no válida';
  }

  // mostrara la respuesta en la etiqueta <output>
  resultadoArreglos.textContent = resultado;
});