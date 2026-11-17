// HTTP: Query gestiona los estados, estas funciones piden o envían datos.
import { listaIncidenciasSchema, type DatosIncidencia, type Incidencia } from '../schemas/incidencia.ts'
const URL_INCIDENCIAS = 'https://6af97cd36d8b86fb22d708a5.mockapi.io/incidencias'
export async function obtenerIncidencias(signal?: AbortSignal): Promise<Incidencia[]> {
  const respuesta = await fetch(URL_INCIDENCIAS, { signal })
  if (!respuesta.ok) throw new Error('No se pudieron consultar las incidencias.')
  const datos: unknown = await respuesta.json()
  const resultado = listaIncidenciasSchema.safeParse(datos)
  if (!resultado.success) throw new Error('El servidor devolvió incidencias con datos inválidos. No se pueden mostrar.')
  return resultado.data
}
export async function crearIncidencia(datos: DatosIncidencia): Promise<void> {
  const respuesta = await fetch(URL_INCIDENCIAS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...datos, estado: 'Pendiente', fechaCreacion: new Date().toISOString() }),
  })
  if (!respuesta.ok) throw new Error('No se pudo registrar la incidencia.')
}

