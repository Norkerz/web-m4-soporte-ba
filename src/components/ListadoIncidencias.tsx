// Consulta independiente: un fallo del listado no oculta el formulario.
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { categorias } from '../schemas/incidencia'
import { obtenerIncidencias } from '../services/api'
import TarjetaIncidencia from './TarjetaIncidencia'
function ListadoIncidencias() {
  const [categoria, setCategoria] = useState('')
  const consulta = useQuery({
    queryKey: ['incidencias'],
    queryFn: ({ signal }) => obtenerIncidencias(signal),
    retry: 1,
  })
  // Derivamos la lista; no duplicamos datos remotos en useState.
  const incidencias = consulta.data ?? []
  const visibles = incidencias.filter((incidencia) => !categoria || incidencia.categoria === categoria)
    .toSorted((a, b) => Date.parse(b.fechaCreacion) - Date.parse(a.fechaCreacion))
  return (
    <section id="solicitudes" className="panel listado" aria-labelledby="titulo-incidencias">
      <div className="panel-cabecera">
        <div><p className="eyebrow">SEGUIMIENTO</p><h2 id="titulo-incidencias">Solicitudes registradas</h2></div>
        <span className="contador" aria-label={incidencias.length + ' solicitudes'}>{incidencias.length}</span>
      </div>
      <p className="texto-suave">Reportes de esta demostración, del más reciente al más antiguo.</p>
      <label htmlFor="filtro-categoria">Filtrar por categoría</label>
      <select id="filtro-categoria" value={categoria} onChange={(evento) => setCategoria(evento.target.value)}>
        <option value="">Todas las categorías</option>
        {categorias.map((valor) => <option key={valor} value={valor}>{valor === 'Aplicacion' ? 'Aplicación' : valor}</option>)}
      </select>
      {consulta.isPending && <p role="status" className="aviso">{consulta.isPaused ? 'Sin conexión. La consulta continuará cuando vuelva la red.' : 'Cargando solicitudes…'}</p>}
      {consulta.isError && <div role="alert" className="aviso error">
        <p>{consulta.error.message}</p>
        <button type="button" className="boton-secundario" disabled={consulta.isFetching} onClick={() => { void consulta.refetch() }}>
          {consulta.isFetching ? 'Consultando…' : 'Reintentar consulta'}
        </button>
      </div>}
      {consulta.isFetching && !consulta.isPending && <p role="status" className="texto-suave">Actualizando solicitudes…</p>}
      {consulta.isSuccess && incidencias.length === 0 && <div className="vacio"><span aria-hidden="true">↗</span><h3>Aún no hay solicitudes</h3><p>La primera aparecerá aquí después de enviar el formulario.</p></div>}
      {consulta.isSuccess && incidencias.length > 0 && visibles.length === 0 && <p className="aviso">No hay solicitudes de esta categoría. Prueba otro filtro.</p>}
      <div className="tarjetas">{visibles.map((incidencia) => <TarjetaIncidencia key={incidencia.id} incidencia={incidencia} />)}</div>
    </section>
  )
}
export default ListadoIncidencias

