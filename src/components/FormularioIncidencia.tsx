// RHF recoge los campos, Zod los valida y la mutation gestiona el envío.
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearIncidencia } from '../services/api'
import { categorias, incidenciasSchema, type DatosIncidencia } from '../schemas/incidencia'

const ayudas: Record<DatosIncidencia['categoria'], string> = {
  'Control de acceso': 'Indica qué puerta o lector falla y qué mensaje aparece. No adjuntes huellas ni claves.',
  Asistencia: 'Explica la fecha y el tipo de marcación afectada: entrada o salida.',
  Terminal: 'Identifica el terminal y explica si está apagado, sin conexión o muestra un error.',
  Aplicacion: 'Indica la pantalla afectada y los pasos para reproducir el problema. No compartas tu contraseña.',
}

function FormularioIncidencia() {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<DatosIncidencia>({
    resolver: zodResolver(incidenciasSchema),
    defaultValues: {
      nombre: '', correo: '', empresa: '', sede: '', categoria: 'Control de acceso',
      equipo: '', asunto: '', descripcion: '',
    },
  })
  // Solo observamos categoría para mostrar una ayuda; las reglas siguen en Zod.
  const categoria = useWatch({ control, name: 'categoria' })
  const necesitaEquipo = categoria === 'Control de acceso' || categoria === 'Terminal'
  const queryClient = useQueryClient()
  const envio = useMutation({
    mutationFn: crearIncidencia,
    networkMode: 'always',
    onSuccess: async () => {
      reset()
      await queryClient.invalidateQueries({ queryKey: ['incidencias'] })
    },
  })
  function enviarDatos(datos: DatosIncidencia) {
    if (!envio.isPending) envio.mutate(datos)
  }
  return (
    <section id="nueva-incidencia" className="panel formulario" aria-labelledby="titulo-formulario">
      <div className="panel-cabecera">
        <div><p className="eyebrow">ESTAMOS PARA AYUDARTE</p><h2 id="titulo-formulario">Cuéntanos qué ocurre</h2></div>
        <span className="paso" aria-hidden="true">01</span>
      </div>
      <p className="texto-suave">Completa los datos para identificar tu incidencia. Todos los campos son obligatorios salvo el equipo cuando se indique.</p>
      <form noValidate onSubmit={handleSubmit(enviarDatos)}
        onChange={() => { if (envio.isSuccess || envio.isError) envio.reset() }}>
        <fieldset disabled={envio.isPending} className="campos">
          <legend>Datos de contacto y del problema</legend>
          <div className="campo">
            <label htmlFor="nombre">Nombre completo</label>
            <input id="nombre" type="text" autoComplete="name" placeholder="Ej.: Empleado de demostración" {...register('nombre')}
              aria-invalid={Boolean(errors.nombre)} aria-describedby={errors.nombre ? 'error-nombre' : undefined} />
            {errors.nombre && <p className="error-campo" id="error-nombre" role="alert">{errors.nombre.message}</p>}
          </div>
          <div className="campo">
            <label htmlFor="correo">Correo de contacto</label>
            <input id="correo" type="email" autoComplete="email" placeholder="demo@example.com" {...register('correo')}
              aria-invalid={Boolean(errors.correo)} aria-describedby={errors.correo ? 'error-correo' : undefined} />
            {errors.correo && <p className="error-campo" id="error-correo" role="alert">{errors.correo.message}</p>}
          </div>
          <div className="campo">
            <label htmlFor="empresa">Empresa</label>
            <input id="empresa" type="text" autoComplete="organization" placeholder="Ej.: Empresa Demo" {...register('empresa')}
              aria-invalid={Boolean(errors.empresa)} aria-describedby={errors.empresa ? 'error-empresa' : undefined} />
            {errors.empresa && <p className="error-campo" id="error-empresa" role="alert">{errors.empresa.message}</p>}
          </div>
          <div className="campo">
            <label htmlFor="sede">Sede o instalación</label>
            <input id="sede" type="text" autoComplete="off" placeholder="Ej.: Sede Centro" {...register('sede')}
              aria-invalid={Boolean(errors.sede)} aria-describedby={errors.sede ? 'error-sede' : undefined} />
            {errors.sede && <p className="error-campo" id="error-sede" role="alert">{errors.sede.message}</p>}
          </div>
          <div className="campo">
            <label htmlFor="categoria">Tipo de incidencia</label>
            <select id="categoria" {...register('categoria')} aria-describedby={errors.categoria ? 'error-categoria ayuda-categoria' : 'ayuda-categoria'} aria-invalid={Boolean(errors.categoria)}>
              {categorias.map((valor) => <option key={valor} value={valor}>{valor === 'Aplicacion' ? 'Aplicación' : valor}</option>)}
            </select>
            {errors.categoria && <p className="error-campo" id="error-categoria" role="alert">{errors.categoria.message}</p>}
          </div>
          <div className="campo">
            <label htmlFor="equipo">Equipo o puerta {necesitaEquipo ? '(obligatorio)' : '(opcional)'}</label>
            <input id="equipo" type="text" autoComplete="off" placeholder="Ej.: Lector de entrada principal" {...register('equipo')}
              aria-invalid={Boolean(errors.equipo)} aria-describedby={errors.equipo ? 'error-equipo' : undefined} />
            {errors.equipo && <p className="error-campo" id="error-equipo" role="alert">{errors.equipo.message}</p>}
          </div>
          <p id="ayuda-categoria" className="ayuda ancho-completo" aria-live="polite">{ayudas[categoria]}</p>
          <div className="campo ancho-completo">
            <label htmlFor="asunto">Asunto</label>
            <input id="asunto" type="text" autoComplete="off" placeholder="Resume el problema en una frase" {...register('asunto')}
              aria-invalid={Boolean(errors.asunto)} aria-describedby={errors.asunto ? 'error-asunto' : undefined} />
            {errors.asunto && <p className="error-campo" id="error-asunto" role="alert">{errors.asunto.message}</p>}
          </div>
          <div className="campo ancho-completo">
            <label htmlFor="descripcion">Descripción del problema</label>
            <textarea id="descripcion" rows={4} placeholder="¿Qué intentabas hacer? ¿Qué ocurrió y desde cuándo?"
              {...register('descripcion')} aria-invalid={Boolean(errors.descripcion)}
              aria-describedby={errors.descripcion ? 'error-descripcion ayuda-descripcion' : 'ayuda-descripcion'} />
            <p id="ayuda-descripcion" className="texto-pequeno">Entre 20 y 1500 caracteres. Usa datos ficticios en esta demostración.</p>
            {errors.descripcion && <p className="error-campo" id="error-descripcion" role="alert">{errors.descripcion.message}</p>}
          </div>
          <div className="pie-formulario ancho-completo">
            <p className="texto-pequeno">Tu solicitud se registrará como <strong>Pendiente</strong>.</p>
            <button type="submit" className="boton-principal" disabled={envio.isPending}>{envio.isPending ? 'Enviando…' : 'Enviar incidencia'} <span aria-hidden="true">↗</span></button>
          </div>
        </fieldset>
        {envio.isPending && <p className="aviso" role="status">Guardando y actualizando el listado…</p>}
        {envio.isError && <p className="aviso error" role="alert">{envio.error.message} Tus datos se conservan; comprueba la conexión y vuelve a enviar.</p>}
        {envio.isSuccess && <p className="aviso exito" role="status">Incidencia registrada correctamente. Puedes consultar su tarjeta en el listado.</p>}
      </form>
    </section>
  )
}
export default FormularioIncidencia

