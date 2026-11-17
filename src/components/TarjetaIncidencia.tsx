// Presenta una solicitud recibida por props; no hace peticiones.
import type { Incidencia } from '../schemas/incidencia'
function TarjetaIncidencia({ incidencia }: { incidencia: Incidencia }) {
  return (
    <article className="tarjeta">
      <div className="tarjeta-meta"><span className="numero">#{incidencia.id}</span><span className="estado">{incidencia.estado}</span></div>
      <h3>{incidencia.asunto}</h3>
      <p className="categoria">{incidencia.categoria === 'Aplicacion' ? 'Aplicación' : incidencia.categoria}</p>
      <p className="descripcion">{incidencia.descripcion}</p>
      <dl>
        <div><dt>Ubicación</dt><dd>{incidencia.empresa} · {incidencia.sede}</dd></div>
        {incidencia.equipo && <div><dt>Equipo / puerta</dt><dd>{incidencia.equipo}</dd></div>}
        <div><dt>Solicitante</dt><dd>{incidencia.nombre}</dd></div>
        <div><dt>Registro</dt><dd><time dateTime={incidencia.fechaCreacion}>{new Date(incidencia.fechaCreacion).toLocaleString('es-CL')}</time></dd></div>
      </dl>
    </article>
  )
}
export default TarjetaIncidencia

