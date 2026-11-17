// Reglas compartidas por formulario y respuesta remota.
import { z } from 'zod'
export const categorias = ['Control de acceso', 'Asistencia', 'Terminal', 'Aplicacion'] as const
const camposIncidenciaSchema = z.object({
  nombre: z.string().trim().min(2, 'Escribe al menos 2 caracteres.').max(80, 'Máximo 80 caracteres.'),
  correo: z.string().trim().pipe(z.email('Escribe un correo válido.')),
  empresa: z.string().trim().min(2, 'Indica tu empresa.').max(100, 'Máximo 100 caracteres.'),
  sede: z.string().trim().min(2, 'Indica tu sede.').max(100, 'Máximo 100 caracteres.'),
  categoria: z.enum(categorias, { error: 'Selecciona una categoría válida.' }),
  equipo: z.string().trim().max(100, 'Máximo 100 caracteres.'),
  asunto: z.string().trim().min(5, 'Escribe un asunto más detallado.').max(120, 'Máximo 120 caracteres.'),
  descripcion: z.string().trim().min(20, 'Describe el problema con al menos 20 caracteres.').max(1500, 'Máximo 1500 caracteres.'),
})
export const incidenciasSchema = camposIncidenciaSchema.refine(
  (datos) => {
    const necesitaEquipo = datos.categoria === 'Control de acceso' || datos.categoria === 'Terminal'
    return !necesitaEquipo || datos.equipo.length > 0
  },
  { message: 'Indica el equipo o puerta donde ocurre el problema.', path: ['equipo'] },
)
// La respuesta incluye también los metadatos añadidos al crear la solicitud.
export const incidenciaRemotaSchema = camposIncidenciaSchema.extend({
  id: z.string().min(1),
  estado: z.enum(['Pendiente', 'En revisión', 'Resuelta']),
  fechaCreacion: z.iso.datetime(),
})
export const listaIncidenciasSchema = z.array(incidenciaRemotaSchema)
export type DatosIncidencia = z.infer<typeof incidenciasSchema>
export type Incidencia = z.infer<typeof incidenciaRemotaSchema>

