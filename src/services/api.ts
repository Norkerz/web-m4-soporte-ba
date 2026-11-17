import type { DatosIncidencia } from '../schemas/incidencia'

const URL_INCIDENCIAS =
  'https://6af97cd36d8b86fb22d708a5.mockapi.io/incidencias'


export async function obtenerIncidencias(): Promise<unknown[]>{
    const respuesta = await fetch(URL_INCIDENCIAS)

    if(!respuesta.ok){
        throw new Error('No se pudieron consultar las incidencias.')
    }

    const datos: unknown = await respuesta.json()

    if(!Array.isArray(datos)){
        throw new Error('La API no devolvio una lista de incidencias')
    }

    return datos
}

export async function crearIncidencia(
  datos: DatosIncidencia,
): Promise<void> {
  const respuesta = await fetch(URL_INCIDENCIAS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...datos,
      estado: 'Pendiente',
      fechaCreacion: new Date().toISOString(),
    }),
  })

  if (!respuesta.ok) {
    throw new Error('No se pudo registrar la incidencia.')
  }
}