import {useQuery} from '@tanstack/react-query'
import { obtenerIncidencias} from './services/api'
import './App.css'
import FormularioIncidencia from './components/FormularioIncidencia'

function App(){
  const consulta = useQuery({
    queryKey: ['incidencias'],
    queryFn: obtenerIncidencias,
  })

    return (
    <main>
      <h1>Soporte Biometría Aplicada</h1>

      <FormularioIncidencia />

      <section aria-labelledby="titulo-incidencias">
        <h2 id="titulo-incidencias">Incidencias registradas</h2>

        {consulta.isPending && <p>Cargando incidencias...</p>}

        {consulta.isError && (
          <p role="alert">Error: {consulta.error.message}</p>
        )}

        {consulta.isSuccess && (
          <p>Incidencias registradas: {consulta.data.length}</p>
        )}
      </section>
    </main>
  )
}

export default App