// App compone la página. Los componentes gestionan formulario y consulta.
import FormularioIncidencia from './components/FormularioIncidencia'
import ListadoIncidencias from './components/ListadoIncidencias'
import './App.css'
function App() {
  return <main><h1>Soporte Biometría Aplicada</h1><FormularioIncidencia /><ListadoIncidencias /></main>
}
export default App

