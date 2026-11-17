import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearIncidencia } from '../services/api'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  incidenciasSchema,
  type DatosIncidencia,
} from '../schemas/incidencia'

function FormularioIncidencia() {
    const{
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DatosIncidencia> ({
        resolver: zodResolver(incidenciasSchema),
        defaultValues: {
            nombre: '',
            correo: '',
            empresa: '',
            sede: '',
            categoria: 'Control de acceso',
            equipo: '',
            asunto: '',
            descripcion: '',
        },
    })

    const queryClient = useQueryClient()
    const envio = useMutation({
        mutationFn: crearIncidencia,
        networkMode: 'always',
        onSuccess: async () => {
            reset()
            await queryClient.invalidateQueries({ queryKey: ['incidencias'] })
        },
    })

    function enviarDatos(datos: DatosIncidencia){
        if (!envio.isPending) envio.mutate(datos)
    }

    return(
        <form onSubmit={handleSubmit(enviarDatos)} noValidate
          onChange={() => { if (envio.isSuccess || envio.isError) envio.reset() }}>
            <h2>Nueva incidencia</h2>
            <fieldset disabled={envio.isPending}>
            <legend>Datos de la solicitud</legend>

            <label htmlFor="nombre">Nombre</label>
        <input
            id="nombre"
            {...register('nombre')}
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={errors.nombre ? 'error-nombre' : undefined}
        />

        {errors.nombre && (
            <p id="error-nombre" role="alert">
                {errors.nombre.message}
            </p>
      )}
          <label htmlFor="correo">Correo electrónico</label>
      <input
        id="correo"
        type="email"
        {...register('correo')}
        aria-invalid={Boolean(errors.correo)}
        aria-describedby={errors.correo ? 'error-correo' : undefined}
      />
      {errors.correo && (
        <p id="error-correo" role="alert">{errors.correo.message}</p>
      )}

      <label htmlFor="empresa">Empresa</label>
      <input
        id="empresa"
        {...register('empresa')}
        aria-invalid={Boolean(errors.empresa)}
        aria-describedby={errors.empresa ? 'error-empresa' : undefined}
      />
      {errors.empresa && (
        <p id="error-empresa" role="alert">{errors.empresa.message}</p>
      )}

      <label htmlFor="sede">Sede</label>
      <input
        id="sede"
        {...register('sede')}
        aria-invalid={Boolean(errors.sede)}
        aria-describedby={errors.sede ? 'error-sede' : undefined}
      />
      {errors.sede && (
        <p id="error-sede" role="alert">{errors.sede.message}</p>
      )}

      <label htmlFor="categoria">Categoría</label>
      <select id="categoria" {...register('categoria')}>
        <option value="Control de acceso">Control de acceso</option>
        <option value="Asistencia">Asistencia</option>
        <option value="Terminal">Terminal</option>
        <option value="Aplicacion">Aplicación</option>
      </select>

      <label htmlFor="equipo">Equipo o puerta, si corresponde</label>
      <input
        id="equipo"
        {...register('equipo')}
        aria-invalid={Boolean(errors.equipo)}
        aria-describedby={errors.equipo ? 'error-equipo' : undefined}
      />
      {errors.equipo && (
        <p id="error-equipo" role="alert">{errors.equipo.message}</p>
      )}

      <label htmlFor="asunto">Asunto</label>
      <input
        id="asunto"
        {...register('asunto')}
        aria-invalid={Boolean(errors.asunto)}
        aria-describedby={errors.asunto ? 'error-asunto' : undefined}
      />
      {errors.asunto && (
        <p id="error-asunto" role="alert">{errors.asunto.message}</p>
      )}

      <label htmlFor="descripcion">Descripción del problema</label>
      <textarea
        id="descripcion"
        rows={5}
        {...register('descripcion')}
        aria-invalid={Boolean(errors.descripcion)}
        aria-describedby={
          errors.descripcion ? 'error-descripcion' : undefined
        }
      />
      {errors.descripcion && (
        <p id="error-descripcion" role="alert">
          {errors.descripcion.message}
        </p>
      )}
      <button type="submit" disabled={envio.isPending}>
        {envio.isPending ? 'Enviando...' : 'Enviar incidencia'}
      </button>
      </fieldset>
      {envio.isError && <p role="alert">{envio.error.message} Tus datos se conservan para reintentar.</p>}
      {envio.isSuccess && <p role="status">Incidencia registrada correctamente.</p>}
    </form>
    )
}

export default FormularioIncidencia
