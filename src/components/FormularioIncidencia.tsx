import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  incidenciasSchema,
  type DatosIncidencia,
} from '../schemas/incidencia'

function FormularioIncidencia() {
    const{
        register,
        handleSubmit,
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

    function comprobarDatos(datos: DatosIncidencia){
        console.log('Datos validos:', datos)
    }

    return(
        <form onSubmit={handleSubmit(comprobarDatos)} noValidate>
            <h2>Nueva incidencia</h2>

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
      <button type="submit">Comprobar datos</button>
    </form>
    )
}

export default FormularioIncidencia