import Link from 'next/link';
import styles from './TarjetaTaller.module.css';
import { yaPaso, formatearFecha } from '../lib/formato';

export default function TarjetaTaller({ taller }) {
  const pasado = yaPaso(taller.fecha);

  return (
    <article className={styles.tarjeta}>
      <span className={pasado ? styles.etiquetaPasado : styles.etiqueta}>
        {pasado ? 'Ya pasó' : 'Próximo'}
      </span>
      <h3 className={styles.titulo}>{taller.nombre}</h3>
      <p className={styles.dato}>
        <strong>Instructor:</strong> {taller.instructor || 'Por confirmar'}
      </p>
      <p className={styles.dato}>
        <strong>Fecha:</strong> {formatearFecha(taller.fecha)}
      </p>
      <p className={styles.dato}>
        <strong>Cupo:</strong> {taller.cupo} lugares
      </p>
      <Link className={styles.enlace} href={`/talleres/${taller.id}`}>
        Ver detalle e inscribirme →
      </Link>
    </article>
  );
}