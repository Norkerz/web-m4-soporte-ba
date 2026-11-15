import { z } from 'zod'

export const incidenciasSchema = z.object({
    nombre: z.string().trim().min(2, 'Escribe al menos 2 caracteres.'),
    correo: z.email('Escribe un correo valido.'),
    empresa: z.string().trim().min(2, 'Indica tu empresa.'),
    sede: z.string().trim().min(2, 'Indica tu sede.'),
    categoria: z.enum([
        'Control de acceso',
        'Asistencia',
        'Terminal',
        'Aplicacion',
    ]),
    equipo: z.string().trim(),
    asunto: z.string().trim().min(5, 'Escribe un asunto mas detallado.'),
    descripcion: z.string().trim().min(
        20,
        'Describe el problema con al menos 20 caracteres.',
    ),
}).refine(
  (datos) => {
    const necesitaEquipo =
      datos.categoria === 'Control de acceso' ||
      datos.categoria === 'Terminal'

    return !necesitaEquipo || datos.equipo.length > 0
  },
  {
    message: 'Indica el equipo o puerta donde ocurre el problema.',
    path: ['equipo'],
  },
)

export type DatosIncidencia = z.infer<typeof incidenciasSchema>