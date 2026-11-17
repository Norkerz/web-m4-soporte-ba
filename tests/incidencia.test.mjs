import test from 'node:test'
import assert from 'node:assert/strict'
import { incidenciasSchema, listaIncidenciasSchema } from '../src/schemas/incidencia.ts'
const formulario = {
  nombre: 'Empleado Demo', correo: 'demo@example.com', empresa: 'Empresa Demo', sede: 'Sede Centro',
  categoria: 'Control de acceso', equipo: 'Puerta principal', asunto: 'Lector sin respuesta',
  descripcion: 'El lector no responde al intentar registrar la entrada.',
}
const registro = { ...formulario, id: 'demo-1', estado: 'Pendiente', fechaCreacion: '2026-11-17T12:00:00.000Z' }
test('trim rechaza espacios y normaliza el nombre', () => {
  assert.equal(incidenciasSchema.safeParse({ ...formulario, nombre: '     ' }).success, false)
  assert.equal(incidenciasSchema.parse({ ...formulario, nombre: '  Ana Pérez  ' }).nombre, 'Ana Pérez')
})
test('equipo obligatorio solo para acceso y terminal', () => {
  for (const categoria of ['Control de acceso', 'Terminal']) {
    const resultado = incidenciasSchema.safeParse({ ...formulario, categoria, equipo: '   ' })
    assert.equal(resultado.success, false)
    assert.deepEqual(resultado.error.issues[0].path, ['equipo'])
  }
  for (const categoria of ['Asistencia', 'Aplicacion']) {
    assert.equal(incidenciasSchema.safeParse({ ...formulario, categoria, equipo: '' }).success, true)
  }
})
test('rechaza correo, categoría, descripción y longitudes inválidas', () => {
  for (const cambio of [{ correo: 'sin-arroba' }, { categoria: 'Desconocida' }, { descripcion: 'corta' }, { asunto: 'a'.repeat(121) }]) {
    assert.equal(incidenciasSchema.safeParse({ ...formulario, ...cambio }).success, false)
  }
})
test('API acepta lista vacía y registro completo', () => {
  assert.equal(listaIncidenciasSchema.safeParse([]).success, true)
  assert.equal(listaIncidenciasSchema.safeParse([registro]).success, true)
})
test('BONUS: atrapa dato corrupto de API', () => {
  const resultado = listaIncidenciasSchema.safeParse([{ ...registro, id: 42, fechaCreacion: 'ayer' }])
  assert.equal(resultado.success, false)
  console.log('Dato corrupto rechazado:', resultado.error.issues.map((error) => error.path.join('.')).join(', '))
})

