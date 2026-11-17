// Ejecuta las funciones HTTP reales con respuestas simuladas; no escribe en MockAPI.
import test from 'node:test'
import assert from 'node:assert/strict'
import { obtenerIncidencias, crearIncidencia } from '../src/services/api.ts'

const datos = { nombre: 'Empleado Demo', correo: 'demo@example.com', empresa: 'Empresa Demo',
  sede: 'Sede Centro', categoria: 'Terminal', equipo: 'Lector 1',
  asunto: 'Lector sin conexión', descripcion: 'El lector muestra sin conexión al registrar la entrada.' }
const registro = { ...datos, id: '1', estado: 'Pendiente', fechaCreacion: '2026-11-17T12:00:00.000Z' }

test('GET devuelve registros validados y transmite la señal de cancelación', async (t) => {
  const controlador = new AbortController()
  t.mock.method(globalThis, 'fetch', async (url, opciones) => {
    assert.equal(url.endsWith('/incidencias'), true)
    assert.equal(opciones.signal, controlador.signal)
    return Response.json([registro])
  })
  assert.deepEqual(await obtenerIncidencias(controlador.signal), [registro])
})
test('GET rechaza HTTP de error y datos corruptos', async (t) => {
  const simulado = t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 500 }))
  await assert.rejects(obtenerIncidencias(), /No se pudieron consultar/)
  simulado.mock.mockImplementation(async () => Response.json([{ ...registro, id: 42 }]))
  await assert.rejects(obtenerIncidencias(), /datos inválidos/)
})
test('POST manda campos, estado y fecha ISO sin inventar ID', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, opciones) => {
    assert.equal(url.endsWith('/incidencias'), true)
    assert.equal(opciones.method, 'POST')
    assert.equal(opciones.headers['Content-Type'], 'application/json')
    const enviado = JSON.parse(opciones.body)
    assert.deepEqual({ ...enviado, estado: undefined, fechaCreacion: undefined }, { ...datos, estado: undefined, fechaCreacion: undefined })
    assert.equal(enviado.estado, 'Pendiente')
    assert.equal(typeof enviado.fechaCreacion, 'string')
    assert.equal(Number.isNaN(Date.parse(enviado.fechaCreacion)), false)
    assert.equal('id' in enviado, false)
    return Response.json({ ...enviado, id: '1' }, { status: 201 })
  })
  await crearIncidencia(datos)
})
test('POST propaga errores HTTP y de red', async (t) => {
  const simulado = t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 503 }))
  await assert.rejects(crearIncidencia(datos), /No se pudo registrar/)
  simulado.mock.mockImplementation(async () => { throw new TypeError('Fallo de red simulado') })
  await assert.rejects(crearIncidencia(datos), /Fallo de red simulado/)
})

